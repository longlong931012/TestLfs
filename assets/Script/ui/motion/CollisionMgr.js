var eventsMgr = require('eventsMgr');
var consts = require('consts');
let NodeCollider = require('NodeCollider');
/**
 * 移动组件
 */
cc.Class({
    extends: cc.Component,
    properties: {
        isCollisionWithEdge: {
            // ATTRIBUTES:
            default:true,        // The default value will be used only when the component attaching
            serializable: true,   // optional, default is true
            tooltip:'是否跟边框碰撞',
        },
        isCollisionWithEachOther:{
            // ATTRIBUTES:
            default:true,     // The default value will be used only when the component attaching
            serializable: true,   // optional, default is true
            tooltip:'是否每个元素相互碰撞',
        },
        colliders:[NodeCollider],
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
        let colliderTmps = [];
        for (let i=0;i<self.colliders.length;i++){
            let collider = self.colliders[i];
            if (self.isCollisionWithEdge){//检测与边框碰撞
                //处理碰撞.直接反弹

            }
            if (self.isCollisionWithEachOther){
                colliderTmps.push(collider);
            }
        }
        let colliderTmp = colliderTmps.pop();
        while (colliderTmps.length > 1 && colliderTmp.collisionEnable){
            for (let i=0;i<colliderTmps.length;i++){
                let collider = colliderTmps[i];
                if (collider.collisionEnable){
                    if (collider.state === consts.COLLISION_STATE.IDLE){

                    }else{

                    }
                }
            }
            colliderTmp = colliderTmps.pop();
        }

    }
});