// let Level = require('Level');
import Level from "Level"
let soundMgr = require('soundMgr');
let dragons = require('dragons');
let nodeMgr = require('nodeMgr');
import { SOUNDS, SOUNDSTYPE } from "../consts/sounds";
let eventsMgr = require('eventsMgr');
let actions = require('actions');
var levelMgr = require('levelMgr');
cc.Class({
    extends: Level,

    properties: {

    },
    // LIFE-CYCLE CALLBACKS:
    // start () {
    //
    // },
    /**
     * 开始关卡
     */
    startLevel() {
        //从这里开始做小步的动画
        let self = this;
        //跳入的小步节点
        this.xiaobujun = this.node.getChildByName("bg").getChildByName("xiaobujun1");
        //说话的小步节点
        this.xiaobujun2 = this.node.getChildByName("bg").getChildByName("xiaobujun2");
        //赋值黑板的节点
        this.blackboard = this.node.getChildByName("bg").getChildByName("blackboard");

        this.scheduleOnce(function () {
            self.xiaobujun.active = true;
        }, 0.1);

        //开启跳入动画
        console.log("TCL: ---------------------------------");
        console.log("TCL: startLevel -> sounds", SOUNDS);
        console.log("TCL: ---------------------------------");
        soundMgr.playSoundEffectByName("Common/jumpIN");
        dragons.playAnimation(this.xiaobujun, "Debut", 1, function () {
            self.xiaobujun.active = false;
            self.xiaobujun2.active = true;
            //结束后播放晃动动画
            dragons.playAnimation(self.xiaobujun, "Idle", 0);
        });
        soundMgr.playSoundEffectByName("Common/shuxuekuangjia-01", function () {
            actions.moveTo(self.blackboard, 1, 0, 0);
            actions.scaleTo(self.blackboard, 1, 1.8, 1.5, () => {
                self._checkVideoType();
                self._playVideo();
            });
        });
    },
    /**
     * 播放视频
     * @private
     */
    _playVideo() {
        var u = navigator.userAgent;
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        if (isiOS)
        {
            this.node.getChildByName("video").scaleX = 1;
            this.node.getChildByName("video").scaleY = 1;
            this.node.getChildByName("video").getChildByName("videoplayer").scaleX = 1;
            this.node.getChildByName("video").getChildByName("videoplayer").scaleY = 1;
        } else if (isAndroid)
        {
            this.node.getChildByName("video").scaleX = 1.4;
            this.node.getChildByName("video").scaleY = 1.4;
            this.node.getChildByName("video").getChildByName("videoplayer").scaleX = 0.585;
            this.node.getChildByName("video").getChildByName("videoplayer").scaleY = 1;
            if (nodeMgr.findNode("ui/maskbg"))
            {
                nodeMgr.findNode("ui/maskbg").active = true;
            }
        } else
        {
            this.node.getChildByName("video").scaleX = 1;
            this.node.getChildByName("video").scaleY = 1;
            this.node.getChildByName("video").getChildByName("videoplayer").scaleX = 1;
            this.node.getChildByName("video").getChildByName("videoplayer").scaleY = 1;
        }
        var self = this;
        eventsMgr.emit('videoPlayer', {
            act: 'play',
            url: 'http://xbvideo-10076982.file.myqcloud.com/96405330186274932992.mp4',
            onComplete: function () {
                self._nextLevel();
            },
            onSkip: function () {
                self._nextLevel();
            },
        });
    },
    /**
     * 切换到下一关
     * @private
     */
    _checkVideoType() {
        this.scheduleOnce(function () {
            var players = this.node.getChildByName("video").getChildByName("videoplayer").getComponent(cc.VideoPlayer);
            var flag = players.isPlaying();
            if (flag == false || players.currentTime == 0)
            {
                if (nodeMgr.findNode("ui/maskbg"))
                {
                    nodeMgr.findNode("ui/maskbg").active = false;
                }
                levelMgr.passLevel();
                levelMgr.loadLevel('prefabs/levelVideoEnd', function (err) {
                    levelMgr.curLevel.startLevel();
                })
            } else
            {
                // console.log("视频正在播放中");
            }
        }, 5);
    },
    ONLoad() { },
    ONDestroy() { },
    _nextLevel() {
        if (nodeMgr.findNode("ui/maskbg"))
        {
            nodeMgr.findNode("ui/maskbg").active = false;
        }
        //将跳过按钮隐藏
        levelMgr.passLevel();
        if (document.getElementById("Skip_button"))
        {
            document.getElementById("Skip_button").style.display = "none";
            levelMgr.passLevel();
            levelMgr.loadLevel('prefabs/levelVideoEnd', function (err) {
                levelMgr.curLevel.startLevel();
            })
        }
    },
});
