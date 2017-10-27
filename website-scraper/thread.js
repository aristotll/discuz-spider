require('es6-shim');
let rangeArray = (start, end) => Array(end - start + 1).fill(0).map((v, i) => i + start);

module.exports = function Thread(configObj) {
    var fs = require('fs-extra');

    var defaultOpts = {
        maxOnlineId: 0,
        maxScrapedId: 0,
        maxDownloadedId: 0,
        downloadedIdList: [],
        uselessIdList: [],
        saveDirecory: './save-directory/thread/',
        downloader:{
            asyncMethod:require('./thread-scraper'),
            syncMethod:require('./downloader'),
            sleepSecond:5,
            maxWorkers:2,
            currentId:0,
            workerQueue:[],
            todoQueue:[]
        }
    }

    this.config = (configObj) => {
        Object.assign(this, defaultOpts, configObj);
    }
    this.config(configObj);

    //-----------------------------------//

    this.getFileNameFromId = (id) =>{
        return 'thread-'+id+'-1-1.html';
    }

    this.existIdList = () => {
        for(var i=0;i<=this.maxDownloadedId;i++){
            if(this.existId(i)){
                this.downloadedIdList.push(i);
            }
        }
        return this.downloadedIdList;
    }

    this.existId = (id)=>{
        return fs.pathExistsSync(
                        this.saveDirecory + this.getFileNameFromId(id)
                    );
    }

    this.downloadStart = () => {

        this.downloader.todoQueue = rangeArray(0, this.maxDownloadedId).filter((id)=>{return !this.existId(id)});
        
        this.taskId = setInterval( () => {

            this.downloadStep();
        },
            this.downloader.sleepSecond * 1000 // 睡眠一段时间
        )
        this.downloadStep();
    }


    this.downloadStep =  (id, filter) => {
        console.log(this.downloader.workerQueue)
        
        if(this.checkEnd()){
            this.downloadStop();
        }
        
        if(!this.workerQueueEmpty()){
            console.log('working');
            return ;
        }
        this.generateWorkerQueue();
        this.downloader.workerQueue.forEach((id)=>{
            
            if(typeof id == "number"){
                this.downloader.syncMethod(id);
                console.log("download thread, id:",id);
            }
        })
        
        
    }

    this.checkEnd = ()=>{
        return this.downloader.todoQueue.length < 1;
    }
    
    this.workerQueueEmpty = ()=>{
        this.downloader.workerQueue 
            = this.downloader.workerQueue
                                .filter((id)=>{
                                    return !this.existId(id);
                                })
        return this.downloader.workerQueue.length < 1;
    }

    this.generateWorkerQueue = ()=>{
        var workerQueue = this.downloader.workerQueue;
        var todoQueue = this.downloader.todoQueue;
        while(workerQueue.length < this.downloader.maxWorkers){
            workerQueue.push(todoQueue.shift());
        }
 
    }

    this.downloadStop = () =>{
        clearInterval(this.taskId);
        this.taskId = null;
        var downloadedIds = this.existIdList()
                                    .sort(function (a, b) {
                                        return a - b;
                                    });
        this.maxDownloadedId = downloadedIds.pop();// 返回末尾元素

        console.log('抓取结束', this.maxDownloadedId);
    }
}