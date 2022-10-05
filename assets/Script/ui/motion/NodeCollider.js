var eventsMgr = require('eventsMgr');
var consts = require('consts');

/**
 * 移动组件
 */
cc.Class({
    extends: cc.Component,
    properties: {
        collisionEnable:true,
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        let self = this;
        self.state = consts.COLLISION_STATE.IDLE;
    },
    onDestroy(){
    },
    start () {

    },
    update(dt){

    },
    onCollisionEnter(other,self){

    },
    onCollisionStay(other,self){

    },
    onCollisionExit(other, self) {
        console.log('on collision exit');
    }
});
