// var eventsMgr = require('eventsMgr');
// var consts = require('consts');
// var Level = require('Level');
import Level from "Level";
// var metaCfg = require('metaCfg');
var nodeMgr = require('nodeMgr');
// var HashMap = require('HashMap');
var LevelMgr = function () {
    this.curLevel;
    this.preLevelNode;
    this.curLevelNode;
    this.curLevelData;
}
var pro = LevelMgr.prototype;

pro.initLevel = function () {
    var self = this;
}
/**
 * 载入关卡
 * @param data
 * @private
 */
pro._loadNewLevel = function (data) {
    // 10	载入关卡1	1000	1													载入关卡事件
    var self = this;
    self.curLevel = data.target;
    if (self.hasLevel(self.curLevel))
    {
        var levelData = self.getLevelData(self.curLevel);
        self.curLevelData = levelData;
        if (!!levelData.pass)
        {
            self.shareDatas.put(levelData.pass, 0);//载入关卡初始数值
        }
        cc.log('载入关卡:', levelData);
        cc.loader.loadRes(levelData.res, cc.Prefab, function (err, res) {
            if (!err && res)
            {
                self._addLevel(res);
            } else
            {
                cc.warn('关卡预制体加载失败:', levelData.res);
            }
        })
    } else
    {
        cc.warn('关卡数据不存在:id=', self.curLevel);
    }
}
pro.loadLevel = function (levelPath, callback) {
    var self = this;
    cc.loader.loadRes(levelPath, cc.Prefab, function (err, res) {
        if (!err && res)
        {
            self._addLevel(res);
            callback(null);
        } else
        {
            cc.warn('关卡预制体加载失败:', levelPath);
            callback({ msg: '加载失败' });
        }
    })
}
/**
 * 加入到场景
 * @param res
 * @private
 */
pro._addLevel = function (res) {
    var self = this;
    console.log(res, "加入新课件");
    var levelNode = cc.instantiate(res);
    self.curLevel = levelNode.getComponent(Level);
    // level.setLevelData(self.curLevelData);
    self.preLevelNode = self.curLevelNode;
    self.curLevelNode = levelNode;
    if (self.preLevelNode)
    {
        self.preLevelNode.destroy();
    }
    nodeMgr.addNode(levelNode);
}
/**废弃 */
pro.passLevel = function () {
    var self = this;
    if (!!self.curLevelNode)
    {
        self.curLevelNode.destroy();
    }
}
/**
 * 传入去下一关卡的时候传入当前关卡用于清理
 * @param node 当前level节点
 */
pro.goToNextLevel = function (node) {
    let levelStr = node.name.substring(5);
    let levelIndex = parseInt(levelStr);
    ++levelIndex;
    let nextStr = "prefabs/level" + String(levelIndex);
    console.log("下节课Level:", levelIndex);
    this.loadLevel(nextStr, () => {
        nodeMgr.showChangeScene(() => { this.curLevel.startLevel(); })
        node.destroy();
        node.active = false;
    })
    // TODO 老过场
    // nodeMgr.showChangeScene(() => {
    //     this.loadLevel(nextStr, () => {
    //         node.destroy();
    //         node.active = false;
    //         nodeMgr.hideChangeScene(() => {
    //             this.curLevel.startLevel();
    //         });
    //         // setTimeout(() => {
    //         // }, 50000);
    //     })
    // })
}
pro.goToNextLevelNoChange = function (node) {
    // let levelStr = node.name.substring(5,6);
    let levelStr = node.name.substring(5);
    let levelIndex = parseInt(levelStr);
    ++levelIndex;
    let nextStr = "prefabs/level" + String(levelIndex);
    console.log("下节课Level:", levelIndex);
    this.loadLevel(nextStr, () => {
        node.destroy();
        node.active = false;
        this.curLevel.startLevel();
    })
}
pro.switchQuestion = function (node, index) {
    let oName = node.name;
    let nextNode = node.parent.getChildByName(node.name + String(index));
    nextNode.active = true;
    node.destroy();
    nextNode.name = oName;
    return nextNode;
}
pro.levelMgr = new LevelMgr();
module.exports = pro.levelMgr;