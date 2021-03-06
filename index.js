const bodyParser = require('body-parser') ;
const express = require('express') ;
const request = require('request') ;
const Blockchain = require('./blockchain') ;
const PubSub = require('./app/pubsub') ;
const TransactionPool = require('./wallet/transaction-pool') ;
const Wallet = require('./wallet') ;
const TransactionMiner = require('./app/transactionMiner') ;

const app = express() ;

const blockchain = new Blockchain() ;
const transactionPool = new TransactionPool() ;
const wallet = new Wallet() ;
const pubsub = new PubSub({ blockchain, transactionPool , wallet }) ;
const transactionMiner = new TransactionMiner({wallet , blockchain , pubsub , transactionPool }) ; 
const DEFAULT_PORT = 3000 ;

const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}` ;

app.use(bodyParser.json()) ;

app.get('/api/blocks' , (req , res) => {
    res.json(blockchain.chain) ;
});

app.post('/api/mine' , (req , res) => {
    const { data } = req.body ;
    blockchain.addBlock({data}) ;

    pubsub.broadcast() ;
    res.redirect('/api/blocks') ;
});


app.post('/api/transaction' , (req , res) => {
    const { recipient , amount } = req.body ;
    
    let transaction = transactionPool.existingTransaction({inputAddress : wallet.publicKey }) ;

   try { 
     if(!transaction) 
       transaction = wallet.createTransaction({amount , recipient , chain : blockchain.chain }) ;

     else
       transaction.update({senderWallet : wallet , recipient , amount}) ;  
   }
   catch (error){
    return res.status(400).json({type : 'error' , message : error.message}) ;
   }

    transactionPool.setTransaction(transaction) ;
     pubsub.broadcastTransaction(transaction) ;

    res.json({ transaction }) ;
});


app.get('/api/transaction-pool-map' , (req , res) => {
    res.json(transactionPool.transactionMap) ;
});

app.get('/api/mine-transaction' , (req , res) => {
    transactionMiner.mineTransaction() ;

    res.redirect('/api/blocks') ;
});


const syncWithRootNode = () => {

    request({ url : `${ROOT_NODE_ADDRESS}/api/blocks`} , (error , response , body) => {
          if(!error && response.statusCode === 200){
              const rootChain = JSON.parse(body) ;
              console.log(`replace chain with ${body}`) ;
              blockchain.replaceChain(rootChain) ;
          }  
    }) ;


    request({ url : `${ROOT_NODE_ADDRESS}/api/transaction-pool-map`} , (error , response , body) => {
        if(!error && response.statusCode === 200){
            const rootTransactionPool = JSON.parse(body) ;
            console.log(`set the transaction pool ${body}`) ;
            transactionPool.setMap(rootTransactionPool) ;     
        }
    });
}



let PEER_PORT ;

if(process.env.GENERATE_PEER_PORT === 'true'){
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000) ;
}

const PORT = PEER_PORT || DEFAULT_PORT ;
app.listen(PORT , () => {
    console.log(`Server is running on localhost:${PORT}`) ;
    
    if(PORT !== DEFAULT_PORT)
     syncWithRootNode() ;
});