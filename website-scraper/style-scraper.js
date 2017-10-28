

const threadScraper = function(url, distDirectory){
    const scrape = require('website-scraper');
    const fse = require('fs-extra');
     
    const tmpDir = './tmp-'+random();

    var options = {
        urls: [url],
        prettifyUrls:true,
        directory: tmpDir
    };

    // with promise
    scrape(options).then((result) => {
        console.log(url);
        console.log('download!');
        fse.move(tmpDir, distDirectory,{ overwrite: false })
        .then(() => {
            console.log('move!',id);
        })
        .catch(err => console.error(err))

    }).catch((err) => {
        /* some code here */
    });
};


module.exports = threadScraper;

