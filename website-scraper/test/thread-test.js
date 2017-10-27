var Test = require('../thread');

var test = new Test({a:1});
test.config({maxDownloadedId:1569,maxOnlineId:300344});
// test.existIds();
test.downloadStart();    
