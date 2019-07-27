const Wallet = require('./index') ;
const { verifySignature } = require('../util') ;
const Transaction = require('./transaction') ;

describe('Wallet' , () => {
    let wallet ;

    beforeEach(() => {
        wallet = new Wallet() ;
    });

    it('has a `balance` ' , () =>{
        expect(wallet).toHaveProperty('balance') ;
    }) ;

    it('has a `publicKey` ', () => {
        // console.log(wallet.publicKey) ;
        expect(wallet).toHaveProperty('publicKey') ;
    });
   
   
    describe('signing data ' , () => {
        
        const data = 'foobar' ;

        it('verify the signature' , () => {
            expect(verifySignature({
                publicKey : wallet.publicKey ,
                data ,
                signature : wallet.sign(data) 
            })).toBe(true) ;
        });


        it('does not verify the invalid signature' , () => {
            expect(verifySignature({
                publicKey : wallet.publicKey ,
                data ,
                signature : new Wallet().sign(data) 
            })).toBe(false) ;
        });

    });


    describe('createTransaction()' , () => {

        describe('and amount exceeds the balance' , () => {
            it('throws an error' , () => {
                expect(() => {
                    wallet.createTransaction({amount : 99999 , recipient : 'foo-bar'}) ;
                }).toThrow('Amount exceed balance') ;
            });
        }) ;


        describe('and amount does not exceed the balance' , () => {

            let amount , recipient , transaction ;
            beforeEach(() => {
                amount = 50 ;
                recipient = 'foo-bar' ;
                transaction = wallet.createTransaction({amount , recipient}) ;
            });


            it('has the instance of transaction' , () => {
                expect(transaction instanceof Transaction).toBe(true) ;
            });

            it('matches the transaction input in wallet' , () => {
                expect(transaction.input.address).toEqual(wallet.publicKey) ;
            });

            it('outputs the amount to recipient' , () => {
                expect(transaction.outputMap[recipient]).toEqual(amount) ;
            });
        }) ;
    }) ;

}) ;
