const PubNub = require('pubnub') ;
const { PUBLISH_KEY , SUBSCRIBE_KEY , SECRET_KEY} = require('../config') ;

const credentials = {
    publishKey : PUBLISH_KEY ,
    subscribeKey : SUBSCRIBE_KEY ,
    secretKey : SECRET_KEY
};

const CHANNEL = {
    TEST : 'TEST',
    BLOCKCHAIN : 'BLOCKCHAIN',
    TRANSACTION : 'TRANSACTION'
};


class PubSub {
    constructor({ blockchain , transactionPool , wallet}){
        this.pubnub = new PubNub(credentials) ;
        this.blockchain = blockchain ;
        this.wallet = wallet ;
        this.transactionPool = transactionPool ;

        this.pubnub.subscribe({channels : Object.values(CHANNEL)}) ;

        this.pubnub.addListener(this.listener());
    }
    
    listener(){
        return {
            message : messageObject => {
                const {channel , message} = messageObject ;
                console.log(`Message Recieved. Channel : ${channel}. Message : ${message}`) ;

                const parsedMessage = JSON.parse(message) ;

                switch(channel){
                    case CHANNEL.BLOCKCHAIN : 
                      this.blockchain.replaceChain(parsedMessage) ;
                      break ;

                    case CHANNEL.TRANSACTION :
                      if(!this.transactionPool.existingTransaction({ inputAddress : this.wallet.publicKey }))
                       this.transactionPool.setTransaction(parsedMessage) ;
                       break ;
                     
                    default : 
                      return ;
                }
            }
        };
    }

    publish({channel , message}){
        this.pubnub.publish({channel : channel , message : message}) ;
    }

    broadcast(){
        const stringMessage = JSON.stringify(this.blockchain.chain) ;
        this.publish({channel : CHANNEL.BLOCKCHAIN , message : stringMessage}) ;
    }

    broadcastTransaction(transaction){
        const stringMessage = JSON.stringify(transaction) ;
        this.publish({channel : CHANNEL.TRANSACTION , message : stringMessage}) ;
    }
}

module.exports = PubSub ;