const fs = require("fs-extra");

const threadScraper = require('./thread');

import DownloadWorker from './download-worker.js';

// Promise Usage
fs.readJson('./website-map.json')
    .then(websiteObj => {
        console.log(websiteObj);
        const downloadConfig = websiteObj.download
        console.log("抓取配置 ", websiteObj.download);
        const downloader = new DownloadWorker(downloadConfig);

        downloader.run()
    })
    .catch(err => {
        console.error(err)
    })