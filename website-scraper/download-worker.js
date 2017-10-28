var request = require('request');
const download = require('download');
const fs = require('fs');



var DownloadWorker = (function () {

      
    var todoQueue = [];
    var workerQueue = [];
    const statusEnum = {
        'init': 'init',
        "ok": "ok",
        "err": "err",
        "request": "request",
        "timeout": "timeout"
    }
    const EventEmitter = require('events');
    class MyEmitter extends EventEmitter {}
    
    const myEmitter = new MyEmitter();
    myEmitter.on(statusEnum.request, (id, opt) => {
        //console.log('页面', id,'下载开始', opt);
        
        
    });   
    myEmitter.on(statusEnum.ok, (id) => {
        //console.log('页面', id,'下载成功');
        workerQueue = workerQueue.filter((worker)=>{
                                        return worker.id != id
                                    })
    });
    myEmitter.on(statusEnum.timeout, (id)=>{
        //console.log('页面', id,'请求超时');
        workerQueue = workerQueue.filter((worker)=>{
                                        return worker.id != id
                                    })        
    })
    myEmitter.on(statusEnum.err, (id, _err)=>{
        //console.log('页面', id,'请求错误');
        //console.log(_err);
        workerQueue = workerQueue.filter((worker)=>{
                                        return worker.id != id
                                    })        
    })
    // TODO 其他时间监听


    var distDirectory = './save-directory/thread';
    var timeoutSecond = 10;
    var maxWorkerCount = 3;

    var todoPush = (id) => {
        todoQueue.push( _DownloadWorker(id));
    }

    var todo2worker = () => {
        if(checkTodoQueueEmpty()){
            return;
        }
        while (workerQueue.length < maxWorkerCount
                && !checkTodoQueueEmpty()
            ) {
            workerQueue.push(
                todoQueue.shift()
            )
        }
    }

    var checkWorkerQueueEmpty = () => {
        var undoQueue = workerQueue.filter((worker) => {
            var undo = worker.status != statusEnum.ok;
            return undo;
        })
        workerQueue = undoQueue;
        return undoQueue.length < 1;
    }

    var checkTodoQueueEmpty = () => {
        return todoQueue.length < 1;
    }

    var checkEnd = () => {
        return checkTodoQueueEmpty() && checkWorkerQueueEmpty();
    }

    var step = () => {
        todo2worker();
        if (!checkWorkerQueueEmpty()) {
            console.log('----------step---------');
            workerQueue.forEach((worker) => {
                worker.request();
            })
        }
    }

    //------------------------//    
    var _DownloadWorker = function (_id) {
        var id = _id;
        var status = statusEnum.init;
        var getUrl = () => {
            return 'http://www.1point3acres.com/bbs/thread-' + id + '-1-1.html';
        }

        var getStatus = ()=>{
            return status;
        }
        var setStatus = (_status)=>{
            status = _status
        }
        var request = () => {
            //console.log('download',getUrl());
            //console.log('to',fs.realpathSync(distDirectory));
            myEmitter.emit(statusEnum.request , id,{"source":getUrl(), "dist":fs.realpathSync(distDirectory)})

            download(getUrl(), distDirectory)
                .then(() => {
                    myEmitter.emit(statusEnum.ok, id)
                })
                .catch(_err => {
                    myEmitter.emit(statusEnum.err, id, _err)
                    //console.log(err);
                })

            status = statusEnum.request;
            setTimeout(() => {
                    myEmitter.emit(statusEnum.timeout, id)
                },
                timeoutSecond * 1000
            )
        }
        return {
            id,
            status,
            getUrl,
            request
        }
    }
    //-----_DownloaderWorker End ----//



    var log = () => {
        console.log(todoQueue.length, '个页面待抓取');
    }

    return {
        todoPush,
        step,
        checkEnd,
        log,
        myEmitter
    }
})();
module.exports = DownloadWorker