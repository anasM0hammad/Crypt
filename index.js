const express = require('express') ;
const Blockchain = require('./blockchain') ;

const blockchain = new Blockchain() ;

const app = express() ;

app.get('/api/blocks' , (req , res) => {
    res.json(blockchain.chain) ;
});


const PORT = 3000 ;
app.listen(PORT , () => {
    console.log(`Server is running on localhost:${PORT}`) ;
});