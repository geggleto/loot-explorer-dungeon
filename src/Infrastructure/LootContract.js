const web3 = require('./MyWeb3');
let abi = require('./abi');

let contract = new web3.eth.Contract(abi, '0x508d06b8f3a4b0fd363239ce61e0c4b0b82f3626');

let c = {

    async getOwnedTokens(address) {
        let store = {};

        let incomingTokenTransferEvents = await contract.getPastEvents('Transfer', {
            filter: {'to': address},
            fromBlock: 0,
            toBlock: 'latest'
        });
        incomingTokenTransferEvents.forEach((event) => {
            if (undefined === store[event.returnValues.tokenId]) {
                store[event.returnValues.tokenId] = 0;
            }
            store[event.returnValues.tokenId]++;
        });
        let outgoingTokenTransferEvents = await contract.getPastEvents('Transfer', {
            filter: {'from': address},
            fromBlock: 0,
            toBlock: 'latest'
        });
        outgoingTokenTransferEvents.forEach((event) => {
            store[event.returnValues.tokenId]--;
        });

        console.log(store);

        for (let key in store) {
            if (store[key] <= 0) {
                delete store[key];
            }
        }

        return Object.keys(store);
    }
}

module.exports = c;
