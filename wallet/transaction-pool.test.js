const TransactionPool = require('./transaction-pool') ;
const Transaction = require('./transaction') ;
const Wallet = require('./index') ;

describe('TransactionPool' , () => {

let transactionPool , transaction , senderWallet ;
beforeEach(() => {
   senderWallet = new Wallet() ;
    transaction = new Transaction({
        senderWallet ,
        amount : 50 ,
        recipient : 'foo-recipient'
    });
    transactionPool = new TransactionPool()
});
  
  describe('setTransaction()' , () =>{
    
    it('set the transaction in transaction Pool' , () => {
        transactionPool.setTransaction(transaction) ;
        expect(transactionPool.transactionMap[transaction.id]).toBe(transaction) ;
    });
  });

  describe('existingTransaction()' , () => {
    it('returns an existing transaction given input address' , () => {
      transactionPool.setTransaction(transaction) ;
      expect(transactionPool.existingTransaction({inputAddress : senderWallet.publicKey})).toBe(transaction) ;
    });
  });

});