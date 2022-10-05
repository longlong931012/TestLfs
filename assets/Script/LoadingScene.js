cc.Class({
    extends: cc.Component,
    properties: {
        progressBar: cc.ProgressBar,
        loading: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // TODO 我玩的时候不想看
        cc.debug.setDisplayStats(false);
    },

    start() {
        var self = this;
        self._startLoad();
    },
    /**
     * 加载游戏资源
     * @private
     */
    _startLoad() {
        var self = this;
        self.curProgress = 0;
        self.progressBar.progress = 0;
        self._loadSoundDir('sounds', '加载声音以及音效文件...', 0.2, function () {
            self._loadDir('Texture', '加载纹理资源...', 0.1, function () {
                self._loadDir('prefabs', '加载界面配置文件...', 0.3, function () {
                    self._loadMetaData('', '加载界面配置文件...', 0.1, function () {
                        self._loadMainScene('mainScene', '加载主场景...', 0.3);
                    });
                });
            });
        });
    },
    _loadMetaData(url, info, progressWeight, completeCallback) {
        var self = this;
        self.curProgress += progressWeight;
        self.progressBar.progress = self.curProgress;
        completeCallback();
    },
    _loadSoundDir(url, info, progressWeight, completeCallback) {
        var self = this;
        cc.loader.loadResDir(url, function (completedCount, totalCount, item) {
            var progress = completedCount / totalCount * progressWeight;
            self.progressBar.progress = self.curProgress + progress;
            // self._updateTagPos();
        }, function (error, assets) {
            self.curProgress += progressWeight;
            // self._updateTagPos();
            completeCallback();
        });
    },
    /**
     *
     * @param url
     * @param info
     * @param progressWeight 进度的权重，总和为1
     * @param completeCallback
     * @private
     */
    _loadDir(url, info, progressWeight, completeCallback) {
        var self = this;
        cc.loader.loadResDir(url, function (completedCount, totalCount, item) {
            var progress = completedCount / totalCount * progressWeight;
            var newProgress = self.curProgress + progress;
            var curProgress = self.progressBar.progress
            // cc.log('progress:',self.curProgress + progress);
            if (curProgress < newProgress)
            {
                self.progressBar.progress = newProgress;
            }
        }, function (error, assets) {
            self.curProgress += progressWeight;
            completeCallback();
        });
    },
    _loadCode(url, info, progressWeight, completeCallback) {
        var self = this;
        cc.loader.downloader.loadSubpackage(url, function (err) {
            self.curProgress += progressWeight;
            completeCallback();
        });
    },
    _loadMainScene(mainScene, info, progressWeight) {
        var self = this;
        cc.director.preloadScene(mainScene, function (completedCount, totalCount, item) {
            var progress = completedCount / totalCount * progressWeight;
            self.progressBar.progress = self.curProgress + progress;
            // cc.log('progress:',self.curProgress + progress);
        }, function (error, asset) {
            self.curProgress += progressWeight;
            // self.progressBar.node.active = false;
            // self.loading.active = false;
            self.startGame();
        });
    },
    startGame() {
        cc.director.loadScene('mainScene', function () {
        });
    },
    // update (dt) {},
});
