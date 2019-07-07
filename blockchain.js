const Block = require('./block') ;
const cryptoHash = require('./crypto-hash') ;

class Blockchain{
    constructor(){
        this.chain = [Block.genesis()] ;
    }

    addBlock({data}){
        const lastBlock = this.chain[this.chain.length - 1] ;
        const newBlock = Block.mineBlock({data : data , lastBlock : lastBlock }) ;

        this.chain.push(newBlock) ;
    }

    static isValid(chain){
       if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) 
        return false ;
        
       for(let i=1 ; i<chain.length ; i++){
           const block = chain[i] ;
           const lastHash = chain[i-1].hash ;
           const data = block.data ;
           const timestamp = block.timestamp ;
           const hash = block.hash ;
           
           if(block.lastHash !== lastHash)
            return false ;

           if(cryptoHash(timestamp , lastHash , data) !== hash)
            return false ; 
       }  

       return true ;

    }
}

module.exports = Blockchain ;