 // var eventsMgr = require('eventsMgr');
var nodeMgr = require('nodeMgr');
let soundMgr = require('soundMgr');
let levelMgr = require("levelMgr")
import LevelManager from "LevelManager";
// let sounds = require('sounds');
// var consts = require('consts');
cc.Class({
    extends: cc.Component,

    properties: {
        startTime: cc.Node,
    },
    onLoad() {
        levelMgr.initLevel();
        let self = this;
        levelMgr.initLevel();//初始化关卡
        nodeMgr.initNode(self.node);
        soundMgr.initSounds();      
    },
    start() {
        // ----------------打包前改变状态-------------------
        this.switchLevelState();
    },
    switchLevelState(index) {
        switch (index)
        {
            // 正课蓝色企鹅打开 过场动画后进入
            case 1:
                nodeMgr.showCutscene("shuxue", "Common/shuxueguochang", "guochang", false, () => {
                    levelMgr.loadLevel('prefabs/level1', (err) => {
                        levelMgr.curLevel.startLevel();
                    });
                })
                break;
            // 正课紫色企鹅过场 过场动画后进入
            case 2:
                nodeMgr.showCutscene("zise", "Common/ziseguochang", "close", true, () => {
                    levelMgr.loadLevel('prefabs/level1', (err) => {
                        nodeMgr.showCutscene(1, null, "open", false, () => {
                            levelMgr.curLevel.startLevel();
                        })
                    });
                })
                break;
            // 复习课 直接去看视频
            case 3:
                levelMgr.loadLevel('prefabs/levelVideo', (err) => {
                    levelMgr.curLevel.startLevel();
                });
                break;
            // 开发中
            default:
                levelMgr.loadLevel('prefabs/level1', (err) => {
                    levelMgr.curLevel.startLevel();
                });
                this.ONKey();
                console.error("开发模式 记得切换状态");
                break;
        }
    },
    ONKey() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.keyUp, this);
        console.log("TCL: -------------------------------------------------------------------------------------------------------------------------------------------------");
        console.log("TCL: -------------------------------------------------------------------------------------------------------------------------------------------------");
        console.log("TCL: -------------------------------------------------------------------------------------------------------------------------------------------------");
        console.log("TCL: ---------------------------------------------手动开启调试切场  正式包记得去掉此功能---------------------------------------------------------------------");
        console.log("TCL: -------------------------------------------------------------------------------------------------------------------------------------------------");
        console.log("TCL: -------------------------------------------------------------------------------------------------------------------------------------------------");
        console.log("TCL: -------------------------------------------------------------------------------------------------------------------------------------------------");
    },
    keyUp(e) {
        switch (e.keyCode)
        {
            case cc.macro.KEY.q:
                console.log("手动 下一关  -------------------------------正式包记得去掉此功能-------------------------------");
                LevelManager.goToPreLevel();
                break;
            case cc.macro.KEY.w:
                console.log("手动开启点击  -------------------------------正式包记得去掉此功能-------------------------------");
                nodeMgr.enableTouch();
                break;
            case cc.macro.KEY.e:
                console.log("手动 前一关  -------------------------------正式包记得去掉此功能-------------------------------");
                LevelManager.goToNextLevel();
                break;
            case 49:
                console.log("手动执行方法  -------------------------------正式包记得去掉此功能-------------------------------");
                LevelManager.changeLevel(1);
                break;
            case 50:
                console.log("手动执行方法  -------------------------------正式包记得去掉此功能-------------------------------");
                LevelManager.changeLevel(2);
                break;
            case 51:
                console.log("手动执行方法  -------------------------------正式包记得去掉此功能-------------------------------");
                LevelManager.changeLevel(3);
                break;
            case 52:
                console.log("手动执行方法  -------------------------------正式包记得去掉此功能-------------------------------");
                LevelManager.changeLevel(4);
                break;
            case 53:
                console.log("手动执行方法  -------------------------------正式包记得去掉此功能-------------------------------");
                LevelManager.changeLevel(5);
                break;
            case 54:
                console.log("手动执行方法  -------------------------------正式包记得去掉此功能-------------------------------");
                LevelManager.changeLevel(6);
                break;
            case 55:
                console.log("手动执行方法  -------------------------------正式包记得去掉此功能-------------------------------");
                LevelManager.changeLevel(7);
                break;
            case 56:
                console.log("手动执行方法  -------------------------------正式包记得去掉此功能-------------------------------");
                LevelManager.changeLevel(8);
                break;
            case 57:
                console.log("手动执行方法  -------------------------------正式包记得去掉此功能-------------------------------");
                LevelManager.changeLevel(9);
                break;
        }
    },
    replay() {
        window.location.reload();
    },
    fun() { }
});