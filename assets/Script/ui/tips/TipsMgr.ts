import { SOUNDSTYPE } from "../../consts/sounds";

export interface ITipsMgr
{
    TipsDelayTime: number;
    DragTipsNode: cc.Node;
    ClickTipsNode: cc.Node;
    PressTipsNode: cc.Node;
    /**播放语音时的回调 扩充 */
    SoundCallback: Function;
    /**播放语音时的回调 扩充 */
    setSoundCallback: Function;
    /**有效操作成功调用 就不会在显示提示手了 */
    touchSuccess();
    /**动态设置提示语音 */
    setTipsSound(sounds: SOUNDSTYPE);
    /**显示clickTips节点 */
    showClickTipsNode()
    /**显示移动Tips节点 */
    showDragTipsNode()
    /**设置提示时间 */
    setTipsDelayTime(time: number)
    /**设置初始位置 */
    setClickNodeStartPos(pos: cc.Vec2)
    /**设置初始位置 */
    setDragNodeStartPos(pos: cc.Vec2)
    /**延时显示提示 */
    delyShowDragTips()
    /**延时显示提示 */
    delyShowClickTips()
    /**显示按下Tips节点 */
    showPressTipsNode()
    /**开启语音提示 */
    openTipsSound()
    /**关闭提示和语音监听 */
    closeSoundAndTips()
    // 播放声音回调
    playSoundCallback()
}
export var tipsMgr: ITipsMgr = null;
// 初始化接口
export function initTipsMgr(v: ITipsMgr)
{
    tipsMgr = v;
}