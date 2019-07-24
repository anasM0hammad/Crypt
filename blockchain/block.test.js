const hexToBinary = require('hex-to-binary') ;
const Block = require('./block') ;
const cryptoHash = require('../utli/crypto-hash') ;
const { GENESIS_DATA , MINE_RATE } = require('../config') ;

describe('Block' , ()=>{
  
    const timestamp = 2000 ;
    const data = 'some-data' ;
    const lastHash = 'any-hash' ;
    const hash = 'hash' ;
    const difficulty = 1 ;
    const nonce = 1 ;
    const block = new Block({timestamp , data , lastHash , difficulty , nonce , hash}) ;

    it('has timestamp , data , lastHash and Hash' , ()=>{
        expect(block.timestamp).toEqual(timestamp) ;
        expect(block.data).toEqual(data) ;
        expect(block.lastHash).toEqual(lastHash) ;
        expect(block.hash).toEqual(hash) ;
        expect(block.difficulty).toEqual(difficulty) ;
        expect(block.nonce).toEqual(nonce) ;
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


    describe('mineBlock()' , ()=>{

        const lastBlock = Block.genesis() ;    
        const data = 'mined-data' ;
        const mineBlock = Block.mineBlock({lastBlock , data }) ;

        it('returns the instance of the block' , ()=>{
            expect(mineBlock instanceof Block).toBe(true) ;
        });

        it('set the `lastHash` to be the `hash` of the last block' , ()=>{
            expect(mineBlock.lastHash).toEqual(lastBlock.hash) ;
        });

        it('set the `data`' , ()=>{
            expect(mineBlock.data).toEqual(data) ;
        });

        it('timestamp is not undefine' , ()=>{
            expect(mineBlock.timestamp).not.toEqual(undefined) ;
        });

        it('gives correct hash with timestamp data and last hash', ()=>{
            expect(mineBlock.hash).toEqual(cryptoHash(mineBlock.timestamp , lastBlock.hash , mineBlock.nonce , mineBlock.difficulty , data)) ;
        });

        it('set the hash on difficulty criteria' , () => {
            expect(hexToBinary(mineBlock.hash).substring(0 , mineBlock.difficulty)).toEqual('0'.repeat(mineBlock.difficulty)) ;
        });

        it('adjust the difficulty ' , () => {
            const possibleCase = [lastBlock.difficulty - 1 , lastBlock.difficulty + 1] ;
            expect(possibleCase.includes(mineBlock.difficulty)).toBe(true) ;
        });

    });

    describe('adjustDifficulty()' , () => {

        it('raised the difficulty when mine rate is slow' , () => {
            expect(Block.adjustDifficulty({orignalBlock : block , timestamp : block.timestamp + MINE_RATE - 100})).toEqual(block.difficulty - 1) ;
        });

        it('lower the difficulty when mine rate is fast' , () => {
            expect(Block.adjustDifficulty({orignalBlock : block , timestamp : block.timestamp + MINE_RATE + 100})).toEqual(block.difficulty + 1) ;
        }); 

        it('has a lower limit of 1' , () => {
            block.difficulty = -1 ;
            expect(Block.adjustDifficulty({orignalBlock : block})).toEqual(1) ;
        });
    });

});