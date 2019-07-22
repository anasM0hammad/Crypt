const bodyParser = require('body-parser') ;
const express = require('express') ;
const Blockchain = require('./blockchain') ;

const blockchain = new Blockchain() ;

const app = express() ;

app.use(bodyParser.json()) ;

app.get('/api/blocks' , (req , res) => {
    res.json(blockchain.chain) ;
});

app.post('/api/mine' , (req , res) => {
    const { data } = req.body ;
    blockchain.addBlock(data) ;

    res.redirect('/api/blocks') ;
});


const PORT = 3000 ;
app.listen(PORT , () => {
    console.log(`Server is running on localhost:${PORT}`) ;
});