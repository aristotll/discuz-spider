var Test = require('../thread');
var test = new Test();
var pkg = require('../website-map.json');
console.log(pkg)
test.config(pkg.summary);

test.downloadStart();    
