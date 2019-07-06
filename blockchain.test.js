const Block = require('./block') ;
const Blockchain = require('./blockchain') ;

describe('Blockchain', ()=>{

    const blockchain = new Blockchain() ;

    it('contains a chain of type array' , ()=>{
        expect(blockchain.chain instanceof Array).toBe(true) ;
    });

    it('starts with the genesis block' , ()=>{
        expect(blockchain.chain[blockchain.chain.length - 1]).toEqual(Block.genesis()) ;
    });

    it('add the block with correct data' , ()=>{
        const newData = 'foo' ;
        blockchain.addBlock({data : newData}) ;
        expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(newData) ;
    });

});
