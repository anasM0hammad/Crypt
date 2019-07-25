const Transaction = require('./transaction') ;
const Wallet = require('./index') ;

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

}) ;