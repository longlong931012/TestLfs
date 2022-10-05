let dragons = require('dragons');
cc.Class({
    extends: cc.Component,

    properties: {
        animation:cc.Node,
        pressAnimation:'an',
        unPressAnimation:'song',
        pressTime:3,
        isAutoUnPress:false,
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad () {

    },
    start () {
        let self = this;
        self.scheduleOnce(self.press,0.3);
    },
    /**
     * 按下
     */
    press(){
        let self = this;
        if (self.pressAnimation){
            dragons.playAnimation(self.animation,self.pressAnimation,1,function () {
                if (self.isAutoUnPress){
                    self.scheduleOnce(self.unPress,self.pressTime)
                }
            });
        }
    },
    /**
     * 松开
     */
    unPress(){
        let self = this;
        if (self.unPressAnimation){
            dragons.playAnimation(self.animation,self.unPressAnimation,1,function () {
                self.press();
            });
        }
    },
    // update (dt) {},
});
