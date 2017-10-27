const fs = require("fs-extra");

const threadScraper = require('./thread');

// Promise Usage
fs.readJson('./website-map.json')
.then(websiteObj => {
    console.log(websiteObj);
    console.log("抓取帖子数：", websiteObj.summary.maxThreadId);
    const maxThreadId = 5;websiteObj.summary.maxThreadId;
    var threadId = 0;
    const taskId = setInterval(()=>{
        if(threadId>maxThreadId){
            clearInterval(taskId);
            return ;
        }

        try{
            threadScraper(threadId);
            console.log('scraping ', threadId);
        }
        catch(err){
            console.log(err);
        }
        finally{
            threadId++;
        }

    },5*1000);
})
.catch(err => {
  console.error(err)
})
