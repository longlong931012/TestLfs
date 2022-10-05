import { actions } from "actions";
import { nodeMgr } from "nodeMgr";
import { soundMgr } from "soundMgr";
import consts,{ DRAG,TOUCH } from "../consts/consts";
// import { tipsMgr } from "tipsMgr";
import LevelManager from "../managers/LevelManager";
import { TONGYONG,SOUNDS,SOUNDSTYPE } from "../consts/sounds";
import { tipsMgr } from "./tips/TipsMgr";
const { ccclass,property } = cc._decorator;
@ccclass
export default abstract class Level extends cc.Component
{
    @property({ displayName: "拖拽监听",tooltip: "是否监听拖拽事件" }) enableDragEvent = false;
    @property({ displayName: "点击监听",tooltip: "是否监听点击事件" }) enableClickEvent = false;
    @property({ type: cc.Node,tooltip: "一个常规角色 在需要多的额外创建" }) PlayerNode: cc.Node = null;
    @property({ type: cc.Enum(SOUNDSTYPE) }) inToSounds: SOUNDSTYPE = SOUNDSTYPE.NULL;
    onLoad()
    {
        LevelManager.initLevel(this);
        this.ONLoad();
        this._onEvent();
    }

    public startLevel()
    {
        console.log("过场完毕进入课程:",this.node.name);
        this.StartLevel();
    }
    // 按下
    private _touch_start(e: cc.Event.EventTouch)
    {
        tipsMgr.closeSoundAndTips();
        cc.audioEngine.stopAllEffects();
        this.Touch_Start(e);
    }
    // 抬起
    private _touch_end(e: cc.Event.EventTouch)
    {
        this.Touch_End(e);
    }
    // 拖拽开始
    private _drag_start(e: cc.Event.EventTouch)
    {
        cc.audioEngine.stopMusic();
        tipsMgr.closeSoundAndTips();
        this.Drag_Start(e);
    }
    // 拖拽成功
    private _drag_success(e: cc.Event.EventTouch)
    {
        soundMgr.playEffect(TONGYONG.RIGHT);
        tipsMgr.closeSoundAndTips();
        tipsMgr.touchSuccess();
        this.Drag_Success(e);
    }
    // 拖拽错误
    private _drag_wrong(e: cc.Event.EventTouch)
    {
        soundMgr.playEffect(TONGYONG.WRONG)
        tipsMgr.openTipsSound();
        this.Drag_Wrong(e);
    }
    // 拖拽为空
    private _drag_fail(e: cc.Event.EventTouch)
    {
        tipsMgr.openTipsSound();
        this.Drag_Fail(e);
    }
    // 游戏结束
    public game_over()
    {
        soundMgr.playEffect(TONGYONG.CONGRATULATIONS);
        cc.game.emit("game_over");
        // this.node.active = false;
    }
    onDestroy()
    {
        this._offEvent();
    }
    private _onEvent()
    {
        if (this.enableDragEvent)
        {
            console.log('注册 拖拽 事件');
            cc.game.on(DRAG.START,this._drag_start,this);
            cc.game.on(DRAG.SUCCESS,this._drag_success,this);
            cc.game.on(DRAG.WRONG,this._drag_wrong,this);
            cc.game.on(DRAG.FAIL,this._drag_fail,this);
        }
        if (this.enableClickEvent == true)
        {
            console.log('注册 点击 事件');
            cc.game.on(TOUCH.START,this._touch_start,this);
            cc.game.on(TOUCH.END,this._touch_end,this);
        }
    }

    private _offEvent()
    {
        if (this.enableDragEvent)
        {
            console.log('注销 拖拽 事件');
            cc.game.off(DRAG.START,this._drag_start,this);
            cc.game.off(DRAG.SUCCESS,this._drag_success,this);
            cc.game.off(DRAG.WRONG,this._drag_wrong,this);
            cc.game.off(DRAG.FAIL,this._drag_fail,this);
        }
        if (this.enableClickEvent == true)
        {
            console.log('注销 点击 事件');
            cc.game.off(TOUCH.START,this._touch_start,this);
            cc.game.off(TOUCH.END,this._touch_end,this);
        }

    }
    /**避免子类覆盖 */
    protected abstract ONLoad();
    protected abstract StartLevel();
    protected ONDestroy() { }
    /**子类按下 */
    protected Touch_Start(e) { }
    /**子类抬起 */
    protected Touch_End(e) { }
    // 子类拖拽 按下
    protected Drag_Start(e) { }
    // 子类拖拽 成功
    protected Drag_Success(e) { }
    // 子类拖拽 错误
    protected Drag_Wrong(e) { }
    // 子类拖拽 失败
    protected Drag_Fail(e) { }
    //#region -----------------旧提示方法保留几个版本 稳定后删除-----------------
    // protected clickTipsNode: cc.Node;
    // protected moveTipsNode: cc.Node;
    // protected isPointerSuccess = false;
    // /**显示移动提示 */
    // public openMoveTips()
    // {
    //     if (this.isPointerSuccess == false)
    //     {
    //         this.scheduleOnce(this.showMoveTipsNode,this.tipsDelayTime);
    //     }
    // }
    // /**显示点击提示 */
    // public openClickTips()
    // {
    //     if (this.isPointerSuccess == false)
    //     {
    //         this.scheduleOnce(this.showClickTipsNode,this.tipsDelayTime);
    //     }
    // }
    // /**开启语音提示 */
    // public openTipsSound()
    // {
    //     this.scheduleOnce(this._playSoundCallback,this.tipsDelayTime);
    // }
    // /**关闭提示和语音监听 */
    // public closeSoundAndTips()
    // {
    //     if (this.moveTipsNode)
    //         this.moveTipsNode.active = false;
    //     if (this.clickTipsNode)
    //         this.clickTipsNode.active = false;
    //     this.unscheduleAllCallbacks()
    //     this.unschedule(this._playSoundCallback);
    //     this.unschedule(this.showMoveTipsNode);
    //     this.unschedule(this.showClickTipsNode);
    // }
    // public showMoveTipsNode()
    // {
    //     this.moveTipsNode.active = true;
    // }
    // public showClickTipsNode()
    // {
    //     this.clickTipsNode.active = true;
    // }
    // private _playSoundCallback()
    // {
    //     soundMgr.playSound(this.getSoundsType(this.tipsSoundType),() => { this.openTipsSound(); });
    // }
    //#endregion
}