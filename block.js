const cryptoHash = require('./crypto-hash') ;
const { GENESIS_DATA }  = require('./config') ;

class Block{

   constructor({timestamp , data , lastHash , hash}){
       this.timestamp = timestamp ;
       this.data = data ;
       this.lastHash = lastHash ;
       this.hash = hash ;
   }

   static genesis(){
        return new Block(GENESIS_DATA) ;
   }

   static mineBlock({lastBlock , data}){
    
    const timestamp = Date.now() ;
    const lastHash = lastBlock.hash ;
    const hash = cryptoHash(timestamp , lastHash , data) ;
    
    return new this({ timestamp , lastHash , data , hash});
   }
}

module.exports = Block ;