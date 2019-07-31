const uuid = require('uuid/v1') ;
const { verifySignature } = require('../util') ;
const { MINER_REWARD , REWARD_INPUT } = require('../config') ; 

class Transaction{
    constructor({senderWallet , recipient , amount , output , input }){
        this.id = uuid() ;
        this.outputMap = output || this.createMap({senderWallet , recipient , amount}) ;

        this.input = input || this.createInput({senderWallet , outputMap : this.outputMap }) ;
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

        if(!this.outputMap[recipient]){
            this.outputMap[recipient] = amount ;
        }
        else{
            this.outputMap[recipient] = this.outputMap[recipient] + amount ;
        }
      
        this.outputMap[senderWallet.publicKey] = this.outputMap[senderWallet.publicKey] - amount ;
        this.input = this.createInput({senderWallet , outputMap :this.outputMap })  ;
      
        return ;
    }


    static rewardTransaction({ minerWallet }){
        return new this({
            input : REWARD_INPUT ,
            output : { [minerWallet.publicKey] : MINER_REWARD }
        });
    }

}

module.exports = Transaction ;