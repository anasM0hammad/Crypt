const Transaction = require('./transaction') ;
const Wallet = require('./index') ;
const { verifySignature } = require('../util') ;

describe('Transaction' , () => {

let transaction , senderWallet , amount , recipient ;

beforeEach(() => {
    recipient = 'some-recipient' ;
    amount = 50 ;
    senderWallet = new Wallet() ;
    transaction = new Transaction({senderWallet , amount , recipient}) ;

});

it('has an `id` field' , () => {
    expect(transaction).toHaveProperty('id') ;
}) ;


 describe('outputMap' , () => {

     it('has an `outputMap` ' , () => {
        expect(transaction).toHaveProperty('outputMap') ;
     }) ;

     it('output the amount of `recipient` ', () => {
        expect(transaction.outputMap[recipient]).toEqual(amount) ; 
     });

     it('output the remaining amount of sender' , () => {
        expect(transaction.outputMap[senderWallet.publicKey]).toEqual(senderWallet.balance - amount) ;
     });

 }) ;

 describe('input' , () => {

    it('has a input' , () => {
        expect(transaction).toHaveProperty('input') ;
    });

    it('has a timestamp', () => {
        expect(transaction.input).toHaveProperty('timestamp') ;
    });

    it('has an amount equal to senders balance' , () => {
        expect(transaction.input.amount).toEqual(senderWallet.balance) ;
    });

    it('sets the senders address to public key' , () => {
        expect(transaction.input.address).toEqual(senderWallet.publicKey) ;
    }) ;

    it('sign the signature' , () => {
        expect(verifySignature({
            publicKey : senderWallet.publicKey ,
            data : transaction.outputMap ,
            signature : transaction.input.signature
        })).toBe(true) ;
    });

 }) ;


 describe('validTransaction()', () => {

    let errorMock ;
    beforeEach(() => {
        errorMock = jest.fn() ;
        global.console.error = errorMock ;
    });


    describe('when the transaction is valid' , () => {
       it('returns true' , () => {
        expect(Transaction.validTransaction(transaction)).toBe(true) ;
       });
    });

    describe('when the transaction is invalid' , () => {
        describe('and the outputMap is invalid', () => {
            it('returns false and log the error' , () => {
                transaction.outputMap[senderWallet.publicKey] = 999999 ;
                expect(Transaction.validTransaction(transaction)).toBe(false) ;
                expect(errorMock).toHaveBeenCalled()  ;
            });
        });

        describe('and the input signature is invalid' , () => {
            it('returns false and log the error' , () => {
                transaction.input.signature = new Wallet().sign('data') ;
                expect(Transaction.validTransaction(transaction)).toBe(false) ;
                expect(errorMock).toHaveBeenCalled() ;
            });
        });
    });
 });

}) ;