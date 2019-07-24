const PubNub = require('pubnub') ;
const { PUBLISH_KEY , SUBSCRIBE_KEY , SECRET_KEY} = require('../config') ;

const credentials = {
    publishKey : PUBLISH_KEY ,
    subscribeKey : SUBSCRIBE_KEY ,
    secretKey : SECRET_KEY
};

const CHANNEL = {
    TEST : 'TEST',
    BLOCKCHAIN : 'BLOCKCHAIN'
};


class PubSub {
    constructor({ blockchain }){
        this.pubnub = new PubNub(credentials) ;
        this.blockchain = blockchain ;

        this.pubnub.subscribe({channels : Object.values(CHANNEL)}) ;

        this.pubnub.addListener(this.listener());
    }
    
    listener(){
        return {
            message : messageObject => {
                const {channel , message} = messageObject ;
                console.log(`Message Recieved. Channel : ${channel}. Message : ${message}`) ;

                const parsedMessage = JSON.parse(message) ;

                if(channel === CHANNEL.BLOCKCHAIN){

                    this.blockchain.replaceChain(parsedMessage) ;
                }
            }
        } ;
    }

    publish({channel , message}){
        this.pubnub.publish({channel : channel , message : message}) ;
    }

    broadcast(){
        const stringMessage = JSON.stringify(this.blockchain.chain) ;
        this.publish({channel : CHANNEL.BLOCKCHAIN , message : stringMessage}) ;
    }
}

module.exports = PubSub ;