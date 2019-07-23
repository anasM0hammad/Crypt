const PubNub = require('pubnub') ;
const { PUBLISH_KEY , SUBSCRIBE_KEY , SECRET_KEY} = require('./config') ;

const credentials = {
    publishKey : PUBLISH_KEY ,
    subscribeKey : SUBSCRIBE_KEY ,
    secretKey : SECRET_KEY
};

const CHANNEL = {
    TEST : 'TEST'
};

class PubSub {
    constructor(){
        this.pubnub = new PubNub(credentials) ;

        this.pubnub.subscribe({channels : Object.values(CHANNEL)}) ;

        this.pubnub.addListener(this.listener());
    }
    
    listener(){
        return {
            message : messageObject => {
                const {channel , message} = messageObject ;

                console.log(`Message Recieved. Channel : ${channel}. Message : ${message}`) ;
            }
        } ;
    }

    publish({channel , message}){
        this.pubnub.publish({channel , message}) ;
    }
}

const testPubsub = new PubSub() ;

testPubsub.publish({channel : CHANNEL.TEST ,  message : 'Hello World'}) ;

module.export = PubSub ;