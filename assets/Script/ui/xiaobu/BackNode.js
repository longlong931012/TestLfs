var eventsMgr = require('eventsMgr');
cc.Class({
    extends: cc.Component,

    properties: {
        btnBack:cc.Node,
        gamePause:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        cc.game.on('game_over',this._onGameOver,this);
        // this.btnBack.x = -cc.winSize.width/2+70;
    },
    start(){

        this.btnBack.x = -cc.winSize.width/2+70;
        this.btnBack.y = cc.winSize.height/2-70;
    },
    onDestroy(){
        cc.game.off('game_over',this._onGameOver);
    },
    backClick(){
        let self = this;
        if (self.gamePause){
            self.gamePause.active = true;
        }
    },
    onContinue(){
        let self = this;
        let fadeOut = cc.fadeOut(0.3);
        let callFun = cc.callFunc(function () {
            self.gamePause.opacity = 255;
            self.gamePause.active = false;
        })
        self.gamePause.runAction(cc.sequence(fadeOut,callFun))
    },
    onReload(){
        window.location.reload();
    },
    onExit(){
        if (window.xiaobuJs){
            cc.log('支持小步游戏Api，返回');
            window.xiaobuJs.back();
        }else{
            cc.log('不支持小步游戏Api');
        }
    },
    _onGameOver(){
        this.node.active = false;
    }
});
