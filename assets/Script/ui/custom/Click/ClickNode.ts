import CellNode from "../CellNode";
import { nodeMgr } from "nodeMgr";
import { TOUCH } from "../../../consts/consts";

const { ccclass,property } = cc._decorator;

@ccclass
export default class ClickNode extends CellNode
{
    onEnable()
    {
        this.ON();
    }
    /**外部用开启按钮的方法 */
    public ON()
    {
        this.node.on(cc.Node.EventType.TOUCH_START,this.touch_start,this);
        this.node.on(cc.Node.EventType.TOUCH_END,this.touch_end,this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.touch_cancel,this);
    }
    touch_start()
    {
        nodeMgr.disableTouch();
        cc.game.emit(TOUCH.START,this);
    }
    touch_end()
    {
        cc.game.emit(TOUCH.END,this);
    }
    touch_cancel()
    {
        nodeMgr.enableTouch();
    }
    /**外部用关闭按钮的方法 */
    public OFF()
    {
        this.node.off(cc.Node.EventType.TOUCH_START,this.touch_start,this);
        this.node.off(cc.Node.EventType.TOUCH_END,this.touch_end,this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL,this.touch_cancel,this);
    }
    onDisable()
    {
        this.OFF();
    }
}