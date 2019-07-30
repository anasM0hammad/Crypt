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


  describe('validTransaction()' , () => {

    let validTransactions , errorMock ;
    errorMock = jest.fn() ;
    global.console.error = errorMock ;

    beforeEach(() => {
      validTransactions = [] ;

      for(let i = 0 ; i<10 ; i++){

        transaction = new Transaction({
          senderWallet , 
          recipient : 'any-recipient' ,
          amount : 20 
        }) ;

        if(i%3 === 0){
          transaction.input.amount = 99999 ;
        }
        else if(i%3 === 1){
          transaction.input.signature = new Wallet().sign('foo') ;
        }
        else{
          validTransactions.push(transaction) ;
        }

        transactionPool.setTransaction(transaction) ;
      }

    });

    it('returns valid transactions' , () => {
      expect(transactionPool.validTransaction()).toEqual(validTransactions) ;
    });

    it('logs the error' , () => {
      transactionPool.validTransaction() ;
      expect(errorMock).toHaveBeenCalled() ;
    });

  });

});