const Block = require('./block') ;
const { cryptoHash } = require('../util') ;

class Blockchain{
    constructor(){
        this.chain = [Block.genesis()] ;
    }

    addBlock({data}){
        const lastBlock = this.chain[this.chain.length - 1] ;
        const newBlock = Block.mineBlock({data : data , lastBlock : lastBlock }) ;

        this.chain.push(newBlock) ;
    }

    replaceChain(chain){
        if(chain.length <= this.chain.length){
            console.error('New Chain must be longer') ;
            return ;
        }

        if(!Blockchain.isValid(chain)){
            console.error('New Chain must be valid') ;
            return ;
        }

        this.chain = chain ;
        return ;
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
           const difficulty = block.difficulty ;
           const nonce = block.nonce ;
           const lastDifficulty = chain[i-1].difficulty ;
           
           if(block.lastHash !== lastHash)
            return false ;

           if(cryptoHash(timestamp , lastHash , data , difficulty , nonce) !== hash)
            return false ; 

           if(difficulty - lastDifficulty > 1)
            return false ; 
       }  

       return true ;

    }
}

module.exports = Blockchain ;