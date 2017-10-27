var request = require('request');
const download = require('download');


Promise.all([
    'http://www.1point3acres.com/bbs/thread-16-1-1.html',
].map(x => download(x, './save-directory/thread'))).then( () => {
    console.log('files downloaded!');
});

module.exports = function (id){
    var url = 'http://www.1point3acres.com/bbs/thread-'+id+'-1-1.html'
    Promise.all(
        [url].forEach(url=>{
            download(url, './save-directory/thread')
        })
    )
    .then( ()=>{

    })
    .catch(err=>{
        //console.log(err);
    })
}
