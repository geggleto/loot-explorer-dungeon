const {MongoClient} = require('mongodb');
const uri = process.env.MONGO_URL;
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

let _db;

module.exports = {

    connectToServer: function (callback) {
        client.connect((err, _client) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }

            _db = _client.db('ethships');

            callback(_db, _client);
        });
    },

    getDb: function () {
        return _db;
    }
};