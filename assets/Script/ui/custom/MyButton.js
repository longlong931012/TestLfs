export default cc.Class({
    extends: cc.Component,

    properties: {
        eventId:'',
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    onClick(){
        if (!!this.eventId){
            eventsMgr.doEvent(this.eventId);
        }else{
            cc.warn('当前按钮未设置事件:',this.node.name);
        }
    }
    // update (dt) {},
});
