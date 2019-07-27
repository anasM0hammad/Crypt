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


 describe('update()' , () => {

    let orignalSignature , orignalSenderOutput , nextRecipient , nextAmount ;

    describe('when amount is invalid' , () => {
        it('throws an error' , () => {
            expect(() => transaction.update({senderWallet , amount : 999999 , recipient : 'foo'})).toThrow('Amount exceed balance') ;
        });
    });

    describe('when amount is valid' , () => {
        beforeEach(() => {
            orignalSignature = transaction.input.signature ;
            orignalSenderOutput = transaction.outputMap[senderWallet.publicKey]  ;
            nextRecipient = 'next-recipient' ;
            nextAmount = 100 ;
    
            transaction.update({senderWallet , amount: nextAmount , recipient : nextRecipient}) ;
        });
    
    
        it('outputs the amount of next recipient' , () => {
            expect(transaction.outputMap[nextRecipient]).toEqual(nextAmount) ;
        });
    
        it('substract the amount from sender wallet' , () => {
            expect(transaction.outputMap[senderWallet.publicKey]).toEqual(orignalSenderOutput - nextAmount) ;
        });
    
        it('maintains the total output that matches the input amount' , () =>{
            expect(Object.values(transaction.outputMap).reduce((total , outputAmount) => total + outputAmount)).toEqual(transaction.input.amount) ;
        });
    
        it('re-sign the sender input signature' , () => {
            expect(transaction.input.signature).not.toEqual(orignalSignature) ;
        });
    });
 });

}) ;