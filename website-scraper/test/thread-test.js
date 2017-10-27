var Test = require('../thread');

var test = new Test({a:1});
test.config({maxDownloadedId:400713});
// test.existIds();
test.downloadStart();    
