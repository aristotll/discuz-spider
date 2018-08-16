import chai from 'chai'
const expect = chai.expect;

import Downloader from '../download-worker.js';


describe('下载文件测试', () => {
    it('检查文件是否存在', () => {
        var downloader = new Downloader({
            startId:1,
            endId :2
        });
        expect(downloader.fileExist(1)).to.equal(true);
    })
})
