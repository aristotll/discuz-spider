const scrape = require('website-scraper');
const fse = require('fs-extra');

const threadScraper = function(id){

     
    const tmpDir = './tmp-'+id;
    const targetDir = './save-directory/thread/';
    const url = 'http://www.1point3acres.com/bbs/thread-'+id+'-1-1.html';
    const fileName = 'thread-'+id+'-1-1.html'

    var options = {
        urls: [url],
        defaultFilename: fileName,
        prettifyUrls:true,
        directory: tmpDir
    };

    // with promise
    scrape(options).then((result) => {
        console.log(url);
        console.log('download!');
        fse.move(tmpDir, targetDir,{ overwrite: false })
        .then(() => {
            console.log('move!',id);
        })
        .catch(err => console.error(err))

    }).catch((err) => {
        /* some code here */
    });
};


module.exports = threadScraper;

