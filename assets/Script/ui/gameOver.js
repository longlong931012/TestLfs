let eventsMgr = require('eventsMgr');
cc.Class({
    extends: cc.Component,

    properties: {
        resultPanePrefab:cc.Prefab,
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let self = this;
        if (window.xiaobuJs){
            cc.log('支持小步游戏Api');
        }else{
            cc.log('不支持小步游戏Api');
        }
        self.resultPane = cc.instantiate(self.resultPanePrefab);
        // self.resultPane.parent = this.node;
        // self.resultPane.active = false;
        cc.game.on('game_over',self._onGameOver,self);
    },
    start () {
        // this._onGameOver();
        //eventsMgr.emit('game_over', {}, false);
    },
    onDestroy(){
        cc.game.off('game_over',self._onGameOver);
    },
    _onGameOver(value1, isCallGetCoin=true){
        let self = this;
        if (window.xiaobuJs && isCallGetCoin){
            cc.log('支持小步游戏Api');
            window.result_callback = function (result) {
                if (typeof(result) == 'string'){
                    result = JSON.parse(result)
                }
                let allCoinCount = result.user_coin_count;
                cc.log('allCoinCount=',allCoinCount);
                if (!allCoinCount){
                    allCoinCount = 0;
                    cc.log('初始化 allCoinCount=',allCoinCount);
                }
                let coinCount = result.coin_count;
                cc.log('coinCount=',coinCount);
                if (!coinCount){
                    coinCount = 0;
                    cc.log('初始化 coinCount=',coinCount);
                }
                cc.log('最终数据:','coinCount:'+coinCount+',allCoinCount='+allCoinCount);
                self._showGameOver(coinCount,allCoinCount);
            }

            xiaobuJs.getCoin('result_callback');
            
        }else{
            cc.log('不支持小步游戏Api');
            self._showGameOver(0,0);
        }
    },
    _showGameOver(coin,allCoin){
        let self = this;
        let resultPaneScript = self.resultPane.getComponent(cc.Component);
        resultPaneScript.show(coin,allCoin, ()=>{
            if (window.xiaobuJs){
                cc.log('支持小步游戏Api');
                window.xiaobuJs.back();
            }else{
                cc.log('不支持小步游戏Api');
                cc.director.loadScene('loadingScene');
            }
        });
    }
    // update (dt) {},
});
