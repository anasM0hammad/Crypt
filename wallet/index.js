const { ec , cryptoHash } = require('../util') ;
const { STARTING_BALANCE } = require('../config') ;
const Transaction = require('./transaction') ;

class Wallet{
    constructor(){
         this.keyPair = ec.genKeyPair() ;

        this.balance = STARTING_BALANCE ;
        this. publicKey = this.keyPair.getPublic().encode('hex') ;
    }

    sign(data){
        return this.keyPair.sign(cryptoHash(data)) ;
    }

    createTransaction({amount , recipient}){

        if(amount > this.balance){
            throw new Error('Amount exceed balance') ;
        }

        return new Transaction({senderWallet : this , recipient , amount}) ;

    }
}

module.exports = Wallet ;