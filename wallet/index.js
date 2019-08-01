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

    static calculateBalance({chain , address}){

        let output_total = 0 ;

        for(let i = 1 ; i<chain.length ; i++){
            
            let block = chain[i] ;

            for(let transaction of block.data){
                if(transaction.outputMap[address]){
                    output_total += transaction.outputMap[address] ;
                }
            }
        }

        return STARTING_BALANCE + output_total ;
    }
}

module.exports = Wallet ;