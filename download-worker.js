const download = require('download');
const fs = require('fs');


class DownloadWorker {

    constructor(param) {
        this.distDirectory = './save-directory/thread';
        this.startId = 1;
        this.endId = 10;
        this.sleepSecond = 2;
        Object.assign(this, param);
        console.log(this)
    }
    run() {
        (async () => {
            for (var id = this.startId; id <= this.endId; ++id) {
                await this.step(id);
            }
        })();
    }

    async step(id) {
        return (async () => {
            var job = new Job(id, this.distDirectory);
            try {
                await job.request();
                console.log('done', `id: ${id}`, job.getUrl())
                await job.sleepSecondPromise(this.sleepSecond);

            } catch (err) {
                console.error(err);
            }
        })();
    }

}
class Job {
    constructor(id, distDirectory) {
        this.id = id;
        this.distDirectory = distDirectory;
    }

    getUrl() {
        return `http://www.1point3acres.com/bbs/thread-${this.id}-1-1.html`;
    }
    async request() {
        //console.log('download',getUrl());
        //console.log('to',fs.realpathSync(distDirectory));
        return download(this.getUrl(), this.distDirectory)

    }
    async sleepSecondPromise(second) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve('resolved');
            }, second * 1000);
        });
    }
}


export default DownloadWorker;