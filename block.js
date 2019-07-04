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
       return new this({
        timestamp : Date.now() ,
        lastHash : lastBlock.hash ,
        data  
     });
   }
}

module.exports = Block ;