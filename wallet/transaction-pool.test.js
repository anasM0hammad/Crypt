const TransactionPool = require('./transaction-pool') ;
const Transaction = require('./transaction') ;
const Wallet = require('./index') ;
const Blockchain = require('../blockchain') ;

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

  describe('clear()' , () => {
    it('clears the transaction pool' , () => {
      transactionPool.clear() ;
      expect(transactionPool.transactionMap).toEqual({}) ;
    });
  });

  describe('clearBlockchainTransaction() ' , () => {
    it('clears the transactions existing in blockchain ' , () => {
        const blockchain = new Blockchain() ;
        const expectedTransactionMap = {} ;

        for(let i=0 ; i<6 ; i++){
          const transaction = new Wallet().createTransaction({amount : 20 , recipient : "foo"}) ;
          transactionPool.setTransaction(transaction) ;

          if(i % 2 === 0){
            blockchain.addBlock({data : [transaction]}) ;
          }
          else{
            expectedTransactionMap[transaction.id] = transaction ;
          }
        }
        transactionPool.clearBlockchainTransaction({chain : blockchain.chain}) ;
        expect(transactionPool.transactionMap).toEqual(expectedTransactionMap) ;

    }) ;
  });

});