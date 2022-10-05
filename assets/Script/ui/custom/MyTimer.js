var eventsMgr = require('eventsMgr');
export default cc.Class({
    extends: cc.Component,

    properties: {
        delay:1,
        interval:1,
        repeat:1,
        timerType:0,
        eventId:'',
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    onDestroy(){
        var self = this;
        self.unschedule(self._doAction);
    },
    start () {
        var self = this;
        if (this.timerType === 0){
            self.scheduleOnce(self._doAction,self.delay);
        }else{
            self.runCount = 0;
            self.schedule(self._doAction,self.interval,self.repeat,self.delay);
        }
    },
    _doAction(){
        if (this.timerType === 0){
            eventsMgr.doEvent(this.eventId);
            cc.log('一次性定时器执行:',this.node.name);
            this.node.destroy();
        }else{
            self.runCount++;
            eventsMgr.doEvent(this.eventId);
            cc.log('重复性性定时器执行:'+(self.runCount+'/'+self.repeat),this.node.name);
            if (self.repeat>0 && self.runCount>self.repeat){
                this.node.destroy();
            }
        }
    },

    // update (dt) {},
});
