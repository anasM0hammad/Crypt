const Block = require('./block') ;
const Blockchain = require('./blockchain') ;

describe('Blockchain', ()=>{

    let blockchain  ;

    beforeEach(() => {
        blockchain = new Blockchain() ;
    });

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


    describe('isValid()' , ()=>{

        beforeEach(() => {
            blockchain = new Blockchain() ;
            blockchain.addBlock({data : 'jon'}) ;
            blockchain.addBlock({data : 'sansa'}) ;
            blockchain.addBlock({data : 'arya'}) ;
        });

        describe('When chain does not start with genesis block' , ()=>{
            it('returns false', ()=>{
                blockchain.chain[0] = {data : 'fake-genesis'} ;
                expect(Blockchain.isValid(blockchain.chain)).toBe(false) ;
            }) ;
        });

        describe('When chain does start with genesis block having multiple blocks' , ()=>{
            describe('and last hash not matches the hash of last block' , ()=>{
                it('return false' , () =>{
                    blockchain.chain[2].lastHash = 'fake-hash' ;
                    expect(Blockchain.isValid(blockchain.chain)).toBe(false) ;
                }) ;
            });

            describe('and chain has a block with invalid inputs ' , ()=> {
                it('return false' , () => {
                    blockchain.chain[2].data = 'bad-data' ;
                    expect(Blockchain.isValid(blockchain.chain)).toBe(false) ;
                }) ;
            }) ;

            describe('and chain does not contain any invalid block' , ()=>{
                it('return true' , () =>{ 
                    expect(Blockchain.isValid(blockchain.chain)).toBe(true) ;
                }) ;
            }) ;
        });
    });

});
