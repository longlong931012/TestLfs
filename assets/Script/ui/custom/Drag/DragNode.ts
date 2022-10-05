import Container from "./Container";
import { actions } from "actions";
import { nodeMgr } from "nodeMgr";
import { DRAG } from "../../../consts/consts";
import CellNode from "../CellNode";
import DragLayer from "./DragLayer";

const { ccclass,property } = cc._decorator;
@ccclass
export default class DragNode extends CellNode
{
    @property({ displayName: "放错抖动",tooltip: "开启后放错节点自身抖动然后移动回去",}) IsShake = true;
    @property({ displayName: "需要放入",tooltip: "成功后是否放入",}) IsPutIn = true;
    @property({ type: cc.Integer,tooltip: "指定下标放入" }) TargetIndex = 0;
    /**初始位置 */
    private originPos: cc.Vec2 = new cc.Vec2();
    public setOriginPos(v: cc.Vec2) { this.originPos = v; }
    public getOriginPos() { return this.originPos; }
    private nearestContainer: Container = null;
    private containerArr: Array<Container> = null;
    // 获取父节点保存的容器用于自身遍历
    public getContainerArr()
    {
        if (this.containerArr == null)
        {
            this.containerArr = this.node.parent.getComponent(DragLayer).getContainer();
        }
        return this.containerArr;
    }
    start()
    {
        this.originPos = this.node.getPosition();
    }
    onEnable()
    {
        this.ON();
    }

    /**按下 */
    touch_start(e: cc.Event.EventTouch)
    {
        nodeMgr.disableTouch();
        cc.game.emit(DRAG.START,this);
    }
    /**移动 */
    touch_move(e: cc.Event.EventTouch)
    {
        this.node.setPosition(this.node.x + e.getDelta().x,this.node.y + e.getDelta().y);
    }
    /**出界 */
    touch_cancel(e)
    {
        console.warn("出界了");
        this._fail();
    }
    /**结束 */
    touch_end(e: cc.Event.EventTouch)
    {
        this.getNearestContainer();
        if (this.nearestContainer && this.nearestContainer.node)
        {
            if (this.nearestContainer.node.getBoundingBox().contains(this.node.getPosition()))
            {// 拖拽点在目标节点内 success
                if (this.groupId == this.nearestContainer.groupId && this.nearestContainer.getCapacity() > this.nearestContainer.getNodeArr().length)
                {
                    this._success();
                } else
                {
                    this._wrong();
                }
            } else
            {// fail 啥也没碰着
                this._fail();
            }
        } else
        {
            console.error("没有节点可以匹配,请添加container");
            // this._goBack();
        }
    }
    _success()
    {
        let pusState = this.nearestContainer.addNode(this.node,this.TargetIndex,this.IsPutIn);
        // 成功放入关闭自身拖拽效果
        if (pusState == true)
        {
            this.OFF();
            this.node.removeComponent(this);
        } else
        {
            this._goBack();
        }
        cc.game.emit(DRAG.SUCCESS,this);
    }
    _wrong()
    {
        if (this.IsShake)
        {
            actions.shake(this.node,0.35,() =>
            {
                this._goBack();
                cc.game.emit(DRAG.WRONG,this);
            })
        } else
        {
            this._goBack();
            cc.game.emit(DRAG.WRONG,this);
        }
    }
    _fail()
    {
        this._goBack();
        cc.game.emit(DRAG.FAIL,this);
    }
    // 如果范围内有正确节点返回正确节点 如果没有返回最近的节点
    public getNearestContainer()
    {
        let distance = 99999;
        // let nearestContainer: Container = null;
        for (let i = 0; i < this.getContainerArr().length; i++)
        {
            let curContainer = this.getContainerArr()[i];
            this.node.getPosition().sub(curContainer.node.getPosition());
            let tempDis = this.node.getPosition().sub(curContainer.node.getPosition()).mag();
            if (tempDis < distance)
            {
                distance = tempDis;
                this.nearestContainer = curContainer;
            }
        }
        for (let i = 0; i < this.getContainerArr().length; i++)
        {
            let curContainer = this.getContainerArr()[i];
            if (curContainer.groupId == this.groupId)
            {
                let maxDist
                if (this.node.width < this.node.height)
                {
                    maxDist = this.node.height;
                } else
                {
                    maxDist = this.node.width;
                }
                this.node.getPosition().sub(curContainer.node.getPosition());
                let tempDis = this.node.getPosition().sub(curContainer.node.getPosition()).mag();
                if (tempDis < maxDist * 0.6)
                {
                    distance = tempDis;
                    this.nearestContainer = curContainer;
                }
            }
        }
        return this.nearestContainer;
    }
    // 归位
    private _goBack()
    {
        actions.moveTo(this.node,0.15,this.originPos.x,this.originPos.y,() => { nodeMgr.enableTouch() });
    }
    public ON()
    {
        this.node.on(cc.Node.EventType.TOUCH_START,this.touch_start,this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE,this.touch_move,this);
        this.node.on(cc.Node.EventType.TOUCH_END,this.touch_end,this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.touch_cancel,this);
    }
    public OFF()
    {
        this.node.off(cc.Node.EventType.TOUCH_START,this.touch_start,this)
        this.node.off(cc.Node.EventType.TOUCH_MOVE,this.touch_move,this)
        this.node.off(cc.Node.EventType.TOUCH_END,this.touch_end,this)
        this.node.off(cc.Node.EventType.TOUCH_CANCEL,this.touch_cancel,this)
    }
    onDisable()
    {
        this.OFF();
    }
}