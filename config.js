const INITIAL_DIFFICULTY = 3 ;
const MINE_RATE = 1000 ;

const PUBLISH_KEY  = 'pub-c-780ed0e9-e609-4dbb-b161-b41d6a230404' ;
const SUBSCRIBE_KEY = 'sub-c-28c6ccfa-ad1f-11e9-b39e-aa7241355c4e' ;
const SECRET_KEY = 'sub-c-28c6ccfa-ad1f-11e9-b39e-aa7241355c4e' ;

const GENESIS_DATA = {
    timestamp : '1',
    data : '',
    lastHash : '-----',
    hash : 'one',
    difficulty : INITIAL_DIFFICULTY ,
    nonce : 0 
};

module.exports = { GENESIS_DATA , MINE_RATE , PUBLISH_KEY , SUBSCRIBE_KEY , SECRET_KEY } ;