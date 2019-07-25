const { ec } = require('../utli') ;
const { STARTING_BALANCE } = require('../config') ;
const cryptoHash = require('../utli/crypto-hash') ;

class Wallet{
    constructor(){
         this.keyPair = ec.genKeyPair() ;

        this.balance = STARTING_BALANCE ;
        this. publicKey = this.keyPair.getPublic().encode('hex') ;
    }

    sign(data){
        return this.keyPair.sign(cryptoHash(data)) ;
    }
}

module.exports = Wallet ;