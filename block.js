const cryptoHash = require('./crypto-hash') ;
const { GENESIS_DATA }  = require('./config') ;

class Block{

   constructor({timestamp , data , lastHash , difficulty , nonce , hash}){
       this.timestamp = timestamp ;
       this.data = data ;
       this.lastHash = lastHash ;
       this.hash = hash ;
       this.difficulty = difficulty ;
       this.nonce = nonce ;
   }

   static genesis(){
        return new Block(GENESIS_DATA) ;
   }

   static mineBlock({lastBlock , data}){
    
    const lastHash = lastBlock.hash ;
    const { difficulty } = lastBlock ;
    let nonce = 0 ;
    let timestamp ;
    let hash ;

   do{
    nonce++ ;
    timestamp = Date.now() ;
    hash = cryptoHash(data , timestamp , lastHash , nonce , difficulty) ;
   }while(hash.substring(0,difficulty) !== '0'.repeat(difficulty)) ;
    
    return new this({ timestamp , lastHash , data , difficulty , nonce , hash});
   }
} 

module.exports = Block ;