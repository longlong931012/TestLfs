var eventsMgr = require('eventsMgr');
let HashMap = require('HashMap');
var consts = require('consts');
import { SOUNDS, SOUNDSTYPE } from "sounds";
var SoundsMgr = function () {
    // this.audioMusicID = -1;
    this.curMusicName = '';//当前目标音乐
    this.sounds = new HashMap();//循环音效
    this.loopSounds = new HashMap();//循环音效
    this.curSoundId = -1;//当前播放语音Id
}
var pro = SoundsMgr.prototype;
pro.initSounds = function () {
    // eventsMgr.on(consts.EVENTS.PLAY_SOUND,this._playSound,this);
    // eventsMgr.on(consts.EVENTS.PLAY_MUSIC,this._playMusic,this);
}
pro.stopBackgroundMusic = function () {
    cc.log("音乐播放状态:" + cc.audioEngine.isMusicPlaying());
    if (cc.audioEngine.isMusicPlaying())
    {
        cc.audioEngine.stopMusic();
    }
}
/**
 *
 * @param fileName
 */
pro.playBackgroundMusic = function (fileName) {
    var self = this;//.audioMusicID;
    fileName = "sounds/" + fileName;
    self.stopBackgroundMusic();
    self.curMusicName = fileName;

    cc.loader.loadRes(fileName, cc.AudioClip, function (err, res) {
        cc.audioEngine.setMusicVolume(1);
        cc.audioEngine.playMusic(res, false);
    });
}
/**
 * 播放音效
 * @param fileName
 */
pro.playSoundEffectByName = function (fileName, callback) {
    this.playSound(fileName, callback);
}
/**
 * 播放音效 主要用于循环音效
 * @param fileName
 */
pro.playEffectSound = function (fileName, isLoop) {
    this.playEffect(fileName, isLoop);
}
/**
 * 停止播放循环音效
 * @param fileName
 */
pro.stopEffectSound = function (fileName) {
    let self = this;
    self.stopEffect(fileName);
}
/****************************旧版本API**************************/

/****************************新版本API**************************/
/**
 * 播放声音
 * @param fileName
 */
pro.playSound = function (fileName, callback) {
    if (typeof (fileName) == "string")
    {
        var filePath = 'sounds/' + fileName;
        console.log("当前播放语音:", fileName);
    } else if (typeof (fileName) == 'number')
    {
        var filePath = 'sounds/' + this._getSoundsType(fileName);
        console.log("当前播放语音:", this._getSoundsType(fileName));
    } else
    {
        console.error("类型错误");
    }
    this._playSound(filePath, callback);
}
/**
 * 停止声音播放，只是表面停止了，实际是声音降低为0，因为声音真的停止，会影响绑定的事件调用
 * @param fileName
 */
pro.stopSound = function (fileName) {
    let self = this;
    var filePath = 'sounds/' + fileName;
    if (self.sounds.hasKey(filePath))
    {
        let audioId = self.sounds.get(filePath);
        self._stopSound(audioId);
    }
}

/**
 * 停止声音播放 不要调用
 * @param audioId
 * @private
 */
pro._stopSound = function (audioId) {
    let state = cc.audioEngine.getState(audioId);
    if (state === cc.audioEngine.AudioState.PLAYING)
    {
        // 目前就是需要停止以后不调用
        // cc.audioEngine.setVolume(audioId, 0);
        cc.audioEngine.stopEffect(audioId);
    }
}
/**
 * 判断是否有语音正在播放
 * @returns {boolean}
 */
pro.isSoundPlaying = function () {
    let self = this;
    if (self.curSoundId > -1)
    {//已经播放过语音，需要先停止掉语音
        let state = cc.audioEngine.getState(self.curSoundId);
        if (state === cc.audioEngine.AudioState.PLAYING)
        {
            return true;
        }
    }
    return false;
}
/**
 * 播放播放声音
 * @param pathName
 */
pro._playSound = function (pathName, callback) {
    let self = this;
    if (self.curSoundId > -1)
    {//已经播放过语音，需要先停止掉语音
        self._stopSound(self.curSoundId);
    }
    self._loadSound(pathName, function (err, clip) {
        if (!!err)
        {
            cc.log(err);
            if (callback)
            {
                callback();
            }
        } else
        {
            let audioId = cc.audioEngine.playEffect(clip, false);
            self.curSoundId = audioId;
            self.sounds.put(pathName, audioId);
            cc.audioEngine.setFinishCallback(audioId, function () {
                self.sounds.remove(pathName);
                if (callback)
                {
                    callback();
                }
            })
        }
    });
}

/**
 * 载入
 * @param pathName
 * @param callback
 * @private
 */
pro._loadSound = function (pathName, callback) {
    // var clip = cc.loader.getRes(pathName, cc.AudioClip);
    // if (!!clip)
    // {
    //     callback(null, clip);
    // } else
    // {
    cc.loader.loadRes(pathName, cc.AudioClip, function (err, res) {
        if (!!err)
        {
            callback(err, res);
        } else
        {
            callback(null, res);
        }
    });
    // }
}
/**
 * 播放音效（循环音效)
 * @param fileName
 * @param param1
 * 1、传入bool值，表示是否循环
 * 2、传入方法，表示单次播放需要回调
 * 3、什么都不传，表示播放一次并且不需要回调方法
 */
pro.playEffect = function (fileName, param1) {
    var filePath = 'sounds/' + fileName;
    console.log("当前播放音频:", fileName);
    this._playEffect(filePath, param1);
}
/**
 * 停止播放循环音效
 * @param fileName
 */
pro.stopEffect = function (fileName) {
    let self = this;
    let filePath = 'sounds/' + fileName;
    if (self.loopSounds.hasKey(filePath))
    {
        let audioId = self.loopSounds.get(filePath);
        cc.audioEngine.stop(audioId);
    }
}
/**
 * 播放音效
 * @param pathName
 * @param param1
 * @private
 */
pro._playEffect = function (pathName, param1) {
    let self = this;
    let isLoop = false;
    let callback = undefined;
    if (typeof param1 === 'boolean')
    {//判断是不是循环
        isLoop = param1;
    } else
    {
        callback = param1;
    }
    self._loadSound(pathName, function (err, clip) {
        if (!!err)
        {
            cc.log(err);
            if (callback)
            {
                callback();
            }
        } else
        {
            let audioId = cc.audioEngine.playEffect(clip, isLoop);
            if (isLoop)
            {
                self.loopSounds.put(pathName, audioId);
            } else
            {
                cc.audioEngine.setFinishCallback(audioId, function () {
                    if (callback)
                    {
                        callback();
                    }
                })
            }
        }
    });
}
pro._getSoundsType = function (type) {
    switch (type)
    {
        case SOUNDSTYPE.PB_01: return SOUNDS.PB_01;
        case SOUNDSTYPE.PB_02: return SOUNDS.PB_02;
        case SOUNDSTYPE.PB_03: return SOUNDS.PB_03;
        case SOUNDSTYPE.PB_04: return SOUNDS.PB_04;
        case SOUNDSTYPE.PB_05: return SOUNDS.PB_05;
        case SOUNDSTYPE.PB_06: return SOUNDS.PB_06;
        case SOUNDSTYPE.PB_07: return SOUNDS.PB_07;
        case SOUNDSTYPE.PB_08: return SOUNDS.PB_08;
        case SOUNDSTYPE.PB_09: return SOUNDS.PB_09;
        case SOUNDSTYPE.PB_10: return SOUNDS.PB_10;
        case SOUNDSTYPE.PB_11: return SOUNDS.PB_11;
        case SOUNDSTYPE.PB_12: return SOUNDS.PB_12;
        case SOUNDSTYPE.PB_13: return SOUNDS.PB_13;
        case SOUNDSTYPE.PB_14: return SOUNDS.PB_14;
        case SOUNDSTYPE.PB_15: return SOUNDS.PB_15;
        case SOUNDSTYPE.PB_16: return SOUNDS.PB_16;
        case SOUNDSTYPE.PB_17: return SOUNDS.PB_17;
        case SOUNDSTYPE.PB_18: return SOUNDS.PB_18;
        case SOUNDSTYPE.PB_19: return SOUNDS.PB_19;
        case SOUNDSTYPE.PB_20: return SOUNDS.PB_20;
        case SOUNDSTYPE.PB_21: return SOUNDS.PB_21;
        case SOUNDSTYPE.PB_22: return SOUNDS.PB_22;
        case SOUNDSTYPE.PB_23: return SOUNDS.PB_23;
        case SOUNDSTYPE.PB_24: return SOUNDS.PB_24;
        case SOUNDSTYPE.PB_25: return SOUNDS.PB_25;
        case SOUNDSTYPE.PB_26: return SOUNDS.PB_26;
        case SOUNDSTYPE.PB_27: return SOUNDS.PB_27;
        case SOUNDSTYPE.PB_28: return SOUNDS.PB_28;
        case SOUNDSTYPE.PB_29: return SOUNDS.PB_29;
        case SOUNDSTYPE.PB_30: return SOUNDS.PB_30;
        case SOUNDSTYPE.PB_31: return SOUNDS.PB_31;
        case SOUNDSTYPE.PB_32: return SOUNDS.PB_32;
        case SOUNDSTYPE.PB_33: return SOUNDS.PB_33;
        case SOUNDSTYPE.PB_34: return SOUNDS.PB_34;
        case SOUNDSTYPE.PB_35: return SOUNDS.PB_35;
        case SOUNDSTYPE.PB_36: return SOUNDS.PB_36;
        case SOUNDSTYPE.PB_37: return SOUNDS.PB_37;
        case SOUNDSTYPE.PB_38: return SOUNDS.PB_38;
        case SOUNDSTYPE.PB_39: return SOUNDS.PB_39;
        case SOUNDSTYPE.PB_39: return SOUNDS.PB_39;
        case SOUNDSTYPE.PB_40: return SOUNDS.PB_40;
    }
}
pro.soundMgr = new SoundsMgr();
module.exports = pro.soundMgr;