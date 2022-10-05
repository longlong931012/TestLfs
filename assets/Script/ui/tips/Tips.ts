import { SOUNDSTYPE,SOUNDS } from "../../consts/sounds";
import { soundMgr } from "soundMgr";
import { initTipsMgr,ITipsMgr } from "./TipsMgr";
import DragTips from "./DragTips";

const { ccclass,property } = cc._decorator;


@ccclass
export default class Tips extends cc.Component implements ITipsMgr
{
    TipsDelayTime = 20;
    @property({ type: cc.Enum(SOUNDSTYPE),tooltip: "默认提示语音" }) tipsSound = SOUNDSTYPE.NULL;
    @property({ type: cc.Node }) DragTipsNode: cc.Node = null;
    @property({ type: cc.Node }) ClickTipsNode: cc.Node = null;
    @property({ type: cc.Node }) PressTipsNode: cc.Node = null;
    SoundCallback: Function = null;
    public isSuccess = false;
    constructor()
    {
        super();
        initTipsMgr(this);
    }
    onLoad()
    {
        this.DragTipsNode = cc.find("dragTip",this.node)
        this.ClickTipsNode = cc.find("clickTip",this.node)
        this.PressTipsNode = cc.find("pressTip",this.node)
    }
    // 操作成功
    touchSuccess()
    {
        this.isSuccess = true;
    }
    setSoundCallback(callback: Function)
    {
        this.SoundCallback = callback;
    }
    /**动态设置提示语音 */
    setTipsSound(_sounds: SOUNDSTYPE)
    {
        this.tipsSound = _sounds;
    }
    /**显示clickTips节点 */
    showClickTipsNode()
    {
        this.ClickTipsNode.active = true;
    }
    /**显示移动Tips节点 */
    showDragTipsNode()
    {
        if (this.isSuccess == false)
        {
            // cc.game.emit("shine","r");
            this.DragTipsNode.active = true;
        }
    }
    setTipsDelayTime(time: number)
    {
        this.TipsDelayTime = time;
    }
    setDragNodeStartPos(pos: cc.Vec2)
    {
        this.DragTipsNode.getComponent(DragTips).originPosition = pos;
        this.DragTipsNode.setPosition(pos);
    }
    setClickNodeStartPos(pos: cc.Vec2)
    {
        this.ClickTipsNode.setPosition(pos);
    }
    delyShowClickTips()
    {
        this.scheduleOnce(this.showClickTipsNode,this.TipsDelayTime)
    }
    delyShowDragTips()
    {
        this.scheduleOnce(this.showDragTipsNode,this.TipsDelayTime)
    }
    /**显示按下Tips节点 */
    showPressTipsNode()
    {
        if (this.isSuccess == false)
        {
            this.PressTipsNode.active = true;
        }
    }
    /**开启语音提示 */
    openTipsSound()
    {
        this.scheduleOnce(this.playSoundCallback,this.TipsDelayTime);
    }
    /**关闭提示和语音监听 */
    closeSoundAndTips()
    {
        if (this.DragTipsNode)
            this.DragTipsNode.active = false;
        if (this.ClickTipsNode)
            this.ClickTipsNode.active = false;
        this.unschedule(this.playSoundCallback);
        this.unschedule(this.showClickTipsNode);
        this.unschedule(this.showDragTipsNode);
    }
    // 播放声音回调
    playSoundCallback()
    {
        if (this.tipsSound != SOUNDSTYPE.NULL)
        {
            soundMgr.playSound(this.tipsSound,() =>
            {
                this.openTipsSound();
                if (this.SoundCallback != null)
                {
                    this.SoundCallback()
                }
            });
        } else
        {
            this.openTipsSound();
        }
    }
}