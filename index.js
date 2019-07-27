const bodyParser = require('body-parser') ;
const express = require('express') ;
const request = require('request') ;
const Blockchain = require('./blockchain') ;
const PubSub = require('./app/pubsub') ;
const TransactionPool = require('./wallet/transaction-pool') ;
const Wallet = require('./wallet') ;

const app = express() ;

const blockchain = new Blockchain() ;
const pubsub = new PubSub({ blockchain }) ;
const transactionPool = new TransactionPool() ;
const wallet = new Wallet() ;
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
       transaction = wallet.createTransaction({amount , recipient}) ;

     else
       transaction.update({senderWallet : wallet , recipient , amount}) ;  
   }
   catch (error){
    return res.status(400).json({type : 'error' , message : error.message}) ;
   }

    transactionPool.setTransaction(transaction) ;

    res.json({ transaction }) ;
});

const syncChains = () => {

    request({ url : `${ROOT_NODE_ADDRESS}/api/blocks`} , (error , response , body) => {
          if(!error && response.statusCode === 200){
              const rootChain = JSON.parse(body) ;
              console.log(`replace chain with ${body}`) ;
              blockchain.replaceChain(rootChain) ;
          }  
    }) ;
}


let PEER_PORT ;

if(process.env.GENERATE_PEER_PORT === 'true'){
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000) ;
}

const PORT = PEER_PORT || DEFAULT_PORT ;
app.listen(PORT , () => {
    console.log(`Server is running on localhost:${PORT}`) ;
    
    if(PORT !== DEFAULT_PORT)
     syncChains() ;
});