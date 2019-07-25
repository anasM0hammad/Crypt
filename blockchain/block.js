const hexToBinary = require('hex-to-binary') ;
const { cryptoHash } = require('../util') ;
const { GENESIS_DATA , MINE_RATE }  = require('../config') ;


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


   static adjustDifficulty({orignalBlock , timestamp}){
        const difference = timestamp - orignalBlock.timestamp ;
        const difficulty = orignalBlock.difficulty ;

        if(difficulty < 1)
         return 1 ;

        if(difference > MINE_RATE)
         return difficulty + 1 ;

        return difficulty - 1 ; 
   }


   static mineBlock({lastBlock , data}){
    
    const lastHash = lastBlock.hash ;
    let { difficulty } = lastBlock ;
    let nonce = 0 ;
    let timestamp ;
    let hash ;

   do{
        nonce++ ;
        timestamp = Date.now() ;
        difficulty = Block.adjustDifficulty({orignalBlock : lastBlock , timestamp})
        hash = cryptoHash(data , timestamp , lastHash , nonce , difficulty) ;

   } while(hexToBinary(hash).substring(0,difficulty) !== '0'.repeat(difficulty)) ;
    
    return new this({ timestamp , lastHash , data , difficulty , nonce , hash});
   }
} 

module.exports = Block ;