const Block = require('./block') ;
const { GENESIS_DATA } = require('./config') ;

describe('Block' , ()=>{
  
    const timestamp = 'any-data' ;
    const data = 'some-data' ;
    const lastHash = 'any-hash' ;
    const hash = 'hash' ;
    const block = new Block({timestamp , data , lastHash , hash}) ;

    it('has timestamp , data , lastHash and Hash' , ()=>{
        expect(block.timestamp).toEqual(timestamp) ;
        expect(block.data).toEqual(data) ;
        expect(block.lastHash).toEqual(lastHash) ;
        expect(block.hash).toEqual(hash) ;
    });

   
    describe('genesis()' , ()=>{

        const genesisBlock = Block.genesis() ;

        it('return a block instance', ()=>{
            expect(genesisBlock instanceof Block).toBe(true) ;
        });

        it('correct value of genesis block', ()=>{
            expect(genesisBlock).toEqual(GENESIS_DATA) ;
        });

    });

});