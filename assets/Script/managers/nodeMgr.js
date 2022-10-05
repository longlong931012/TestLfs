var eventsMgr = require('eventsMgr');
var consts = require('consts');
var actions = require('actions');
var dragons = require('dragons');
import bones from "../consts/bones";
let soundMgr = require('soundMgr');
var NodeMgr = function () {
    this.game = undefined;
    this.canvas = undefined;
    this.bgImg = undefined;
}
var pro = NodeMgr.prototype;

/**
 * @param node
 */
pro.initNode = function (node) {
    this.canvas = node;
    this.game = node.getChildByName('game');
}
pro.addNode = function (node) {
    node.parent = this.game;
}
pro.findNode = function (path) {
    var node = cc.find("Canvas/" + path);
    if (node)
    {
        return node;
    } else
    {
        cc.warn('节点未找到:path =', path)
        return null;
    }
}
pro.showCutscene = function (index, sounds, animationStr, bool, callback) {
    let node;
    if (typeof (index) == "number")
    {
        node = this.findNode('ui/cutscene').children[index];
    } else if (typeof (index) == "string")
    {
        node = this.findNode('ui/cutscene').getChildByName(index);
    }
    node.active = true;
    if (sounds)
    {
        cc.loader.loadRes("sounds/" + sounds, cc.AudioClip, (err, res) => {
            cc.audioEngine.play(res, false, 1);
        })
    }
    if (node.getComponent(dragonBones.ArmatureDisplay))
    {
        dragons.playAnimation(node, animationStr, 1, () => {
            if (node.name == "shuxue")
            {
                actions.fadeOut(node, 0.5, () => { node.active = bool; })
            }
            if (callback)
                callback();
        })
    } else
    {
        console.warn("此节点没有动画");
    }
}

// pro.showChangeSceneOdl = function (callback) {
//     var node = this.findNode('ui/cutscene/maxituan');
//     node.active = true;
//     soundMgr.playSound("Common/shuxueguochang");
//     dragons.playAnimation(node, bones.ZC_XIAOBU_CLOSE, 1, callback);
// }
pro.showChangeScene = function (callback) {
    var node = this.findNode('ui/cutscene/shuxueguochang');
    node.active = true;
    soundMgr.playSound("Common/shuxueguochang");
    dragons.playAnimation(node, "guochang", 1, () => {
        node.active = false;
        callback();
    });
}
pro.hideChangeScene = function (callback) {
    var node = this.findNode('ui/cutscene/maxituan');
    node.active = true;
    dragons.playAnimation(node, "open_big", 1, () => {
        if (callback)
            callback();
    });
}
/**
 * 禁止点击事件
 */
pro.disableTouch = function () {
    var node = this.findNode('disableLayer');
    console.log("禁用点击事件");
    if (node)
    {
        node.active = true;
    } else
    {
        cc.warn('未找到:disableLayer');
    }
}
/**
 * 开放点击事件
 */
pro.enableTouch = function () {
    console.log("开放点击事件");
    var node = this.findNode('disableLayer');
    if (node)
    {
        node.active = false;
    }
}
pro.nodeMgr = new NodeMgr();
module.exports = pro.nodeMgr;