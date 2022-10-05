var eventsMgr = require('eventsMgr');
var consts = require('consts');
/**
 * 移动组件
 */
cc.Class({
    extends: cc.Component,
    properties: {
        moveEnable: {
            // ATTRIBUTES:
            default:true,        // The default value will be used only when the component attaching
            serializable: true,   // optional, default is true
            tooltip:'是否禁止移动',
        },
        moveSpeed:{
            // ATTRIBUTES:
            default:200,        // The default value will be used only when the component attaching
            serializable: true,   // optional, default is true
            tooltip:'移动速度',
        },
        direction:{
            // ATTRIBUTES:
            default:cc.v2(1,0),        // The default value will be used only when the component attaching
            serializable: true,   // optional, default is true
            tooltip:'移动方向',
        },
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        let self = this;
    },
    onDestroy(){
    },
    start () {

    },
    update(dt){
        let self = this;
        if (self.moveSpeed){
            let moveDistance = self.moveSpeed * dt;
            let moveX = self.direction.x * moveDistance;
            let moveY = self.direction.y * moveDistance;
            let newX = self.node.x + moveX;
            let newY = self.node.y + moveY;
            self.node.setPosition(newX,newY);
        }
    }
});
