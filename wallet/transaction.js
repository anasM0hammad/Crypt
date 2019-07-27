const uuid = require('uuid/v1') ;
const { verifySignature } = require('../util') ;

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

    static validTransaction(transaction){

       const { outputMap , input } = transaction ;
       const { amount , address , signature } = input ;

       const outputTotal = Object.values(outputMap).reduce((total , outputAmount) => total + outputAmount) ;

        if(outputTotal !== amount){
            console.error(`Invalid Transaction from ${address}`) ;
            return false ;
        }

        if(!verifySignature({data : outputMap , publicKey : address , signature})){
            console.error(`Invalid Transaction from ${address}`) ;
            return false ;
        }

        return true ;
    }

    update({senderWallet , amount , recipient}){

        if(amount > this.outputMap[senderWallet.publicKey]){
            throw new Error('Amount exceed balance') ;
        }

        this.outputMap[recipient] = amount ;
        this.outputMap[senderWallet.publicKey] = this.outputMap[senderWallet.publicKey] - amount ;

        this.input = this.createInput({senderWallet , outputMap :this.outputMap })  ;

        return ;

    }

}

module.exports = Transaction ;