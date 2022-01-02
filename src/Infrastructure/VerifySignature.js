const web3 = require("./MyWeb3");

let service = {
    verify(address, original_message, signatureHex) {
        let recoveredAddress = web3.eth.accounts.recover(original_message, signatureHex);

        return recoveredAddress.toUpperCase() === address.toUpperCase();
    }
};



module.exports = service;