const cryptoHash = require('./crypto-hash') ;

describe('cryptoHash()' , ()=>{
 
     it('return the correct hash using sha-256 generator' , ()=>{
        expect(cryptoHash('foo')).toEqual('b2213295d564916f89a6a42455567c87c3f480fcd7a1c15e220f17d7169a790b') ;
     });

     it('produces the same hash for different order of same inputs' , ()=>{
        expect(cryptoHash('one' , 'two' , 'three')).toEqual(cryptoHash('three' , 'one' , 'two')) ;
     });
});
