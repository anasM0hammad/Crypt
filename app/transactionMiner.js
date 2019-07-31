const Transaction = require('../wallet/transaction');

class TransactionMiner{

    constructor({wallet , transactionPool , pubsub , blockchain }){
        this.blockchain = blockchain ;
        this.transactionPool = transactionPool ;
        this.wallet = wallet ;
        this.pubsub = pubsub ;
    }

    mineTransaction(){

        // GRAB THE VALID TRANSACTIONS
        const validTransaction = this.transactionPool.validTransaction() ;

        // GENERATE THE TRANSACTION REWARD
        validTransaction.push(
            Transaction.rewardTransaction({ minerWallet : this.wallet}) 
        ) ;

        // DO THE CPU COMPUTATION
            this.blockchain.addBlock({data : validTransaction}) ;

        // BROADCAST THE BLOCKCHAIN
            this.pubsub.broadcast() ;

        //CLEAR THE POOL 
            this.transactionPool.clear() ;
    }

}

module.exports = TransactionMiner ;