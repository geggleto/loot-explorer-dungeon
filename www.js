require("dotenv").config();
const express = require('express')
const app = express();
const port = process.env.PORT ?? 8000;
const bodyParser = require('body-parser');
const path = require('path');
const web3 = require('./src/Infrastructure/MyWeb3');
const VerifyService = require('./src/Infrastructure/VerifySignature');
const dnd = require('dnd-npc');

const MongoClient = require('./src/Infrastructure/MongoDb');
const {ObjectId} = require("mongodb");

const Contract = require('./src/Infrastructure/LootContract');

const http = require('http');
const server = http.createServer(app);

const cors = require('cors');
const mustacheExpress = require('mustache-express');

const axios = require('axios');

app.use(express.static('public'));
app.engine('html', mustacheExpress());
app.set("view engine", "html");
app.set("views", path.join(__dirname, "views"));
app.disable('x-powered-by')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

MongoClient.connectToServer( async (db) => {
    //Assert requests collection exists
    try {
        await db.createCollection('requests');
        console.log("request collection created");
    } catch (e) {
        console.log("request collection already exists")
    }

    //Assert tokens collection exists
    try {
        await db.createCollection('tokens');
        console.log("request collection created");
    } catch (e) {
        console.log("request collection already exists")
    }


    let requestCollection = db.collection('requests');
    let tokenCollection = db.collection('tokens');

    app.get('/tokens', async (req, res) => {
        res.render('roll.html', {});
    })


    app.get('/verify/:token', async (req, res) => {

        try {
            let r = await requestCollection.findOne({_id: ObjectId(req.params.token)});

            if (r === null) {
                res.send('ERROR');
                return;
            }

            res.render('verify.html', {
                token: r._id
            });
        } catch (e) {
            res.send('ERROR');
        }
    });

    app.post('/api/token', async (req,res) => {
        let discordId = req.body.discord_id ?? null;

        if (discordId === null) {
            res.error();
        } else {
            let r = await requestCollection.insertOne({
                discord_id: discordId
            });

            res.json({
                _id : r.insertedId
            });
        }
    });

    app.get('/api/tokens/:discord_id', async (req, res) => {

        let tokens = await tokenCollection.find({
            discord_id: parseInt(req.params.discord_id)
        }).toArray();

        res.json(tokens);
    });

    app.get('/api/tokens/by/:address', async (req, res) => {

        let tokens = await tokenCollection.find({
            owner:   {'$regex' : req.params.address, '$options' : 'i'}
        }).toArray();

        res.json(tokens);
    });

    app.post('/api/token/:token_id/roll', async (req,res) => {
        let npc = new dnd.npc().generate();

        let r = await tokenCollection.findOne({ tokenId: parseInt(req.params.token_id) });

        let signatureHex = req.body.signature;
        let address = req.body.address;
        let original_message = "token-"+parseInt(req.params.token_id);

        if (0 /*r.stats*/ ) {
            res.send('error');
        } else {

            if (VerifyService.verify(address, original_message, signatureHex)) { //verified

                let metadata = await axios.get('https://infura-ipfs.io/ipfs/bafybeifnr3u547tcxszqh4cx7updzer5bkvximsxqki3hizn4zlcz625du/metadata/' + req.params.token_id);
                metadata.data.image = metadata.data.image.replace('ipfs://', 'https://infura-ipfs.io/ipfs/');

                await tokenCollection.updateOne({_id: r._id},
                    {
                        $set: {"role": npc.role, ipfs: metadata.data}
                    });

                let t = await tokenCollection.findOne({_id: r._id})

                res.json(t);
                return;
            } else {
                console.log("verify failure");
            }
        }
        res.send('error');
    });

    app.post('/api/verify/:token', async (req, res) => {
        let r = await requestCollection.findOne({_id: new ObjectId(req.params.token) });

        let signatureHex = req.body.signature;
        let address = req.body.address;
        let original_message = req.params.token;

        if (VerifyService.verify(address, original_message, signatureHex)) { //verified
            let tokens = await Contract.getOwnedTokens(address);

            for (let i = 0; i < tokens.length; i++) {
                let token = parseInt(tokens[i]);

                let result = await tokenCollection.updateOne(
                    {
                        tokenId: token
                    }, {
                        $set: {"owner": recoveredAddress, "discord_id": r.discord_id}
                    },
                    {
                        upsert: true
                    }
                );
            }

            await requestCollection.deleteMany({token: req.params.token});

            res.json(tokens);
        } else { //failed
            res.error()
        }
    });

    app.get('/api/metadata/:tokenId', async (req, res) => {

        axios.get('https://infura-ipfs.io/ipfs/bafybeifnr3u547tcxszqh4cx7updzer5bkvximsxqki3hizn4zlcz625du/metadata/'+req.params.tokenId)
        .then(r => {
            r.data.image = r.data.image.replace('ipfs://', 'https://infura-ipfs.io/ipfs/')

            res.json(r.data);
        }).catch((e) => {
            console.log(e);
            res.send('ERROR');
        })
    })

    server.listen(port, () => {
        console.log('server running at ' + port)
    });
})