require('es6-shim');
let rangeArray = (start, end) => Array(end - start + 1).fill(0).map((v, i) => i + start);
var websiteMap = require('./website-map.json');

module.exports = function Thread(configObj) {
    var fs = require('fs-extra');

    var defaultOpts = {
        maxOnlineId: 0,
        maxDownloadedId: 0,
        downloadedIdList: [],
        uselessIdList: [],
        saveDirecory: './save-directory/thread/',
        downloader:require('./download-worker'),
        sleepSecond : 5
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

    this.toPOJO = ()=>{
        return {
            summary:{
                maxDownloadedId :this.maxDownloadedId,
                maxOnlineId:this.maxOnlineId
            }
        }
    }

    this.store = ()=>{
        Object.assign(websiteMap ,this.toPOJO())
        fs.writeJson('./website-map.json', websiteMap);
    }

    this.downloadStart = () => {

        var todoIdList = rangeArray( this.maxDownloadedId, this.maxOnlineId).filter((id)=>{return !this.existId(id)});

        console.log("抓取", todoIdList.length, '个页面');

        todoIdList.forEach((id)=>{
            this.downloader.todoPush(id);
        })

        this.downloader.myEmitter.on('ok',(id)=>{
            console.log("-------",id,"---------")
            if(this.maxDownloadedId<id){
                this.maxDownloadedId = id;
            }
            this.store();
        })
        
        this.downloader.log()
        
        this.taskId = setInterval( () => {
            if(this.downloader.checkEnd()){
                clearInterval( this.taskId );
                this.downloadStop();
                return ;
            }
            this.downloader.step();
            this.downloader.log();
        },
            this.sleepSecond * 1000 // 睡眠一段时间
        )
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