import Level from "Level"
let soundMgr = require('soundMgr');
let dragons = require('dragons');
var levelMgr = require('levelMgr');
// let sounds = require('sounds');
cc.Class({
    extends: Level,

    properties: {
        nextLevelId: 1,
    },
    ONLoad() { },
    // LIFE-CYCLE CALLBACKS:
    start() {

    },
    /**
     * 开始关卡
     */
    startLevel() {
        //从这里开始做小步的动画
        let self = this;
        cc.log('秒后开始播放声音');
        //跳入的小步节点
        this.xiaobujun = this.node.getChildByName("bg").getChildByName("xiaobujun1");
        //说话的小步节点
        this.xiaobujun2 = this.node.getChildByName("bg").getChildByName("xiaobujun2");
        //赋值黑板的节点
        this.blackboard = this.node.getChildByName("bg").getChildByName("blackboard");

        //加载下个场景
        soundMgr.playEffect("Common/shuxuekuangjia-03", () => {
            self.xiaobujun.getComponent(dragonBones.ArmatureDisplay).timeScale = 0.8;
            self.xiaobujun.active = true;
            self.xiaobujun2.active = false;
            soundMgr.playEffect("Common/jumpout");
            dragons.playAnimation(self.xiaobujun, "JumpOff", 1, function () {
                // 自己写的过场动画后进入
                let guochangNode = cc.find("Canvas/ui/cutscene/shuxue");
                guochangNode.active = true;
                soundMgr.playEffect("Common/shuxueguochang", () => { });
                dragons.playAnimation(guochangNode, "guochang", 1, () => {
                    levelMgr.loadLevel('prefabs/level1', (err) => { levelMgr.curLevel.startLevel() })
                    setTimeout(() => {
                        guochangNode.active = false;
                    }, 250);
                })
            });
        });
    },

    /**
     * 切换到下一关
     * @private
     */
    // _nextLevel() {
    //     let self = this;
    //     self.loadLevel(self.nextLevelId);
    // },
});
