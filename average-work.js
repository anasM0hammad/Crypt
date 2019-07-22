const Blockchain = require('./blockchain') ;

const blockchain = new Blockchain() ;
blockchain.addBlock({data : 'initial-data'}) ;

let nextTimestamp , prevTimestamp , average , nextBlock , difference ;

let times = [] ;
average = 0 ;

for(let i=0 ; i<=10000 ; i++){
    prevTimestamp = blockchain.chain[blockchain.chain.length - 1].timestamp ;
    blockchain.addBlock({data : `new-data${i}`}) ;
    nextTimestamp = blockchain.chain[blockchain.chain.length - 1].timestamp ;

    difference = nextTimestamp - prevTimestamp ;
    times.push(difference) ;

    nextBlock = blockchain.chain[blockchain.chain.length - 1] ;

    average = times.reduce((total , num) => (total + num))/times.length ;

    console.log(`Time to mine block ${difference} ms. Difficulty ${nextBlock.difficulty} . takes averge time is ${average}`) ;
}