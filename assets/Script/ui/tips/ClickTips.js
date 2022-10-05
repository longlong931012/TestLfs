let dragons = require('dragons');
cc.Class({
    extends: cc.Component,

    properties: {
        clickAnimation:'dian',
        animation:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },
    start () {
        this._tipsStart();
    },
    _tipsStart(){
        if (self.clickAnimation){
            dragons.playAnimation(self.animation,self.clickAnimation,0);
        }
    },
    // update (dt) {},
});
