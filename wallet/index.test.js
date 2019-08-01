const Wallet = require('./index') ;
const { verifySignature } = require('../util') ;
const Transaction = require('./transaction') ;
const Blockchain = require('../blockchain') ;
const { STARTING_BALANCE } = require('../config') ;

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

        describe('and the chain is passed' , () => {
            it('calls the `Wallet.calculateBalance()` ' , () => {
                const calculateBalanceMock  = jest.fn() ;
                const orignnalCalculateBalance = Wallet.calculateBalance ;
                Wallet.calculateBalance = calculateBalanceMock ;
                
                wallet.createTransaction({
                    recipient : 'foo' ,
                    amount : 10 ,
                    chain : new Blockchain().chain
                }) ;

                expect(calculateBalanceMock).toHaveBeenCalled() ;

                Wallet.calculateBalance = orignnalCalculateBalance ;
            });
        });
    }) ;

    describe('calculateBalance()' , () =>{

        let blockchain ;

        beforeEach(() => {
            blockchain = new Blockchain() ;
        });

        describe('when there is no output for the wallet' , () => {
            it('returns the `STARTING_BALANCE` ' , () => {
                expect(Wallet.calculateBalance({
                    chain : blockchain.chain ,
                    address : wallet.publicKey
                })).toEqual(STARTING_BALANCE) ;
            }) ;
        });

        describe('when there is output for the wallet' , () => {

            let transaction1 , transaction2 ;
            beforeEach(() => {
                transaction1 = new Wallet().createTransaction({
                    recipient : wallet.publicKey ,
                    amount : 50 
                });
                transaction2 = new Wallet().createTransaction({
                    recipient : wallet.publicKey ,
                    amount : 60 
                });

                blockchain.addBlock({data : [transaction1 , transaction2]}) ;
            }); 

            it('add the sum of all output to the wallet ' , () => {
                expect(Wallet.calculateBalance({
                    chain : blockchain.chain ,
                    address : wallet.publicKey
                }))
                .toEqual(STARTING_BALANCE + transaction1.outputMap[wallet.publicKey] + transaction2.outputMap[wallet.publicKey]) ;
            });

        }) ;
    });
}) ;
