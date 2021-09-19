const download = require('download');
const fs = require('fs');
const fsX = require('fs-extra');


class DownloadWorker {

    constructor(param) {
        this.distDirectory = './save-directory/thread';
        this.threaId = 1
        this.startId = 1;
        this.endId = 10;
        this.sleepSecond = 2;
        Object.assign(this, param);
    }

    run() {
        (async () => {
            for (var id = this.startId; id <= this.endId; ++id) {
                if (this.fileExist(id)) {
                    continue;
                }
                try {
                    await this.step(id);

                } catch (err) {
                    console.error(err);
                }
            }
        })();
    }

    fileExist(id) {
        return fsX.pathExistsSync(`${this.distDirectory}/thread-${this.threadId}-${id}-1.html`);
    }

    async step(id) {
        return (async () => {
            var job = new Job(this.threaId, id, this.distDirectory);
            try {
                await job.request();
                console.log('done', `id: ${id}`, job.getUrl())
                await job.sleepSecondPromise(this.sleepSecond);

            } catch (err) {
                console.error(err);
                console.log("休眠10分钟");
                await job.sleepSecondPromise(60 * 10);
                await this.step(id);
            }
        })();
    }

}

class Job {

    constructor(threadId, id, distDirectory) {
        this.threadId = threadId;
        this.id = id;
        this.distDirectory = distDirectory;
    }

    getUrl() {
        return `https://club.sanguosha.com/thread-${this.threadId}-${this.id}-1.html`;
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