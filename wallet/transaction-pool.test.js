const TransactionPool = require('./transaction-pool') ;
const Transaction = require('./transaction') ;
const Wallet = require('./index') ;

describe('TransactionPool' , () => {

let transactionPool , transaction ;
beforeEach(() => {
    transaction = new Transaction({
        senderWallet : new Wallet() ,
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
});