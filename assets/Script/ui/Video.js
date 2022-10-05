var eventsMgr = require('eventsMgr');
const OFFSET_X = 10000000;
const SKIP_BUTTON = 'Skip_button';

// var levelMgr = require('levelMgr');
cc.Class({
    extends: cc.Component,

    properties: {
        player:cc.VideoPlayer,
        buttonShowFlag:false,
    },

    onLoad () {
        let self = this;
        this.buttonShowFlag = false;
        self.player.node.on('meta-loaded', self._onMetaLoad, self);
        self.player.node.on('clicked', self._onClicked, self);
        self.player.node.on('playing', self._onPlaying, self);
        self.player.node.on('read-to-play', self._onReadyToPlay, self);
        self.player.node.on('paused', self._onPaused, self);
        self.player.node.on('stopped', self._onStopped, self);
        self.player.node.on('completed', self._onCompleted, self);
        eventsMgr.on('videoPlayer',self._onEvent, self);
        self.player.node.x = OFFSET_X;
    },
    onDestroy(){
        let self = this;
        eventsMgr.off('videoPlayer',self._onEvent);
    },
    start () {

    },
    _initSkipButton(){
        //找到装Canvas的图层
        let cocos2dContainer = document.getElementById("Cocos2dGameContainer");
        //创建一个button按钮
        let button = document.createElement("button");
        //设置按钮的ID方面后续的操作
        button.setAttribute("id",SKIP_BUTTON);
        //设置按钮的定位模式和距离
        button.style.position = "absolute";
        button.style.right = "1.5%";
        button.style.top = "3%";
        //设置按钮的宽高
        button.style.border = "0px";
        button.style.backgroundColor = "transparent";
        button.style.width = "39px";
        button.style.height = "18px";
        button.style.outline = "none";
        var pemUrl = cc.url.raw("resources/myTexture.png");
        if (cc.loader.md5Pipe){
            pemUrl = cc.loader.md5Pipe.transformURL(pemUrl);
        }
        button.style.backgroundImage = "url(" +pemUrl+ ")";//返回按钮图片路径

        var self = this;
        button.onclick = function () {
            self._onSkipClick();
        };
        //设置按钮的层级，必须为最高
        button.style.zIndex = 99999999999999999999999999999;
        button.style.display = 'block';
        //将按钮加入顶级图层
        cocos2dContainer.appendChild(button);
    },
    _onMetaLoad(event){
        cc.log('_onMetaLoad',event);
    },
    _onClicked(event){
        cc.log('_onClicked',event);
    },
    _onPlaying(event){
        cc.log('_onPlaying',event);
    },
    _onReadyToPlay(event){
        cc.log('_onPlaying',event);
    },
    _onPaused(event){
        cc.log('_onPaused',event);
        // alert("暂停");
    },
    _onStopped(event){
        cc.log('_onStopped',event);
    },
    _onCompleted(event){
        cc.log('_onCompleted',event);
        let self = this;
        self._removeVideo();
        if (self.onComplete){
            self.onComplete();
        }
    },
    _onEvent(data){
        let self = this;
        if (data.act === 'play'){
            self.onComplete = data.onComplete;
            self.onSkip = data.onSkip;
            self._playVideo(data.url);
        }else if (data.act === 'destroy'){
            self._destroyVideo();
        }else if (data.act === 'remove'){
            self._removeVideo();
        }
    },
    _onSkipClick(){
        let self = this;
        self.onSkip();
    },
    _removeVideo(){
        document.getElementsByClassName("cocosVideo")[0].style.zIndex = -1;
        let self = this;
        self.player.node.active = false;
        self.player.node.x = OFFSET_X;
    },
    _destroyVideo(){
        this.node.destroy();
    },
    /**
     * 开始播放视频
     * @param url
     * @private
     */
    _playVideo(url){
        let self = this;
        self.player.node.active = true;
        self.player.node.x = 0;
        self.player.resourceType = cc.VideoPlayer.ResourceType.REMOTE;
        self.player.remoteURL = url;
        self.player.play();
    },
    update (dt) {
        // self.player.
        let self = this;
        //如果播放时间为总时间的三分之一则开启跳过按钮
        if(this.player.currentTime.toFixed(2) > this.player.getDuration().toFixed(2) / 2){
            if(!this.buttonShowFlag){
                this.buttonShowFlag = true;
                self._initSkipButton();
            }
        }
    },

});
