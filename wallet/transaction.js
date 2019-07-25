const uuid = require('uuid/v1') ;

class Transaction{
    constructor({senderWallet , recipient , amount }){
        this.id = uuid() ;
        this.outputMap = this.createMap({senderWallet , recipient , amount}) ;
    }

    createMap({senderWallet , recipient , amount}){
        const outputMap = {} ;

        outputMap[recipient] = amount ;
        outputMap[senderWallet.publicKey] = senderWallet.balance - amount ;

        return outputMap ;
    }
}

module.exports = Transaction ;