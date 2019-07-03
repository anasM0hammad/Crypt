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
}

module.exports = Block ;