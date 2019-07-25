const uuid = require('uuid/v1') ;

class Transaction{
    constructor({senderWallet , recipient , amount }){
        this.id = uuid() ;
        this.outputMap = this.createMap({senderWallet , recipient , amount}) ;

        this.input = this.createInput({senderWallet , outputMap : this.outputMap }) ;
    }

    createMap({senderWallet , recipient , amount}){
        const outputMap = {} ;

        outputMap[recipient] = amount ;
        outputMap[senderWallet.publicKey] = senderWallet.balance - amount ;

        return outputMap ;
    }

    createInput({senderWallet , outputMap}){
        const input = {} ;
        input.amount = senderWallet.balance ;
        input.timestamp = Date.now() ;
        input.address = senderWallet.publicKey ;
        input.signature = senderWallet.sign(outputMap) ;

        return input ;
    }
}

module.exports = Transaction ;