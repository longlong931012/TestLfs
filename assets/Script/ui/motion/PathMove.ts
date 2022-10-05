import { actions } from "actions";
import { dragons } from "dragons";

const { ccclass,property } = cc._decorator;
export enum MOVETYPE
{
    /**移动一步 */
    RUNMOVESTEP = "move_one_step",
    /**走了一步的回调消息 监听操作在发送移动消息 达到执行不同的动作队列 */
    STEPCALLBACK = "step_end",
    /**中间不需要停下做操作 直接走到终点 */
    RUNMOVETOEND = "run_move_to_end",
    /**终点回调 始终都是这一个 */
    END = "move_end",
}
class MoveNode
{
    public scaleX: number = -1;
    public index: number = -1;
    public steepScale = 4;
    public speedTime = 2;
    public moveNode: cc.Node = null;
    private pathNode: cc.Node = null;
    private normalize: cc.Vec2 = null;
    private nextNodePos: cc.Vec2 = null;
    private curNodePos: cc.Vec2 = null;
    constructor(pathNode: cc.Node,moveNode: cc.Node,index: number)
    {
        this.moveNode = moveNode;
        this.pathNode = pathNode;
        this.index = index;
        this.scaleX = moveNode.scaleX;
    }
    public moveToEnd()
    {
        this._updateData();
        actions.moveBy(this.moveNode,this.speedTime / 1000,this.normalize.neg().x * this.steepScale,this.normalize.neg().y * this.steepScale,() =>
        {
            this._moveCallback(MOVETYPE.RUNMOVESTEP);
        });
    }
    public moveStep()
    {
        // console.log("move");
        this._updateData();
        actions.moveBy(this.moveNode,this.speedTime / 1000,this.normalize.neg().x * this.steepScale,this.normalize.neg().y * this.steepScale,() =>
        {
            this._moveCallback(MOVETYPE.RUNMOVESTEP);
        });
    }
    private _moveCallback(type: MOVETYPE)
    {
        switch (type)
        {
            case MOVETYPE.RUNMOVESTEP:
                if (this.curNodePos.fuzzyEquals(cc.v2(this.nextNodePos.x,this.nextNodePos.y),this._getMaxRange() + 1))
                {
                    switch (this.index)
                    {
                        case this.pathNode.childrenCount - 1:
                            console.log("移动完毕",this.index);
                            cc.game.emit(MOVETYPE.END,this.moveNode);
                            return;
                        default:
                            this.index++;
                            console.log(this.moveNode.name,":到达点",this.index,"路径总计",this.pathNode.childrenCount,"个点，发送MOVETYPE.CONTINUE 继续移动到下一个点");
                            cc.game.emit(MOVETYPE.STEPCALLBACK,this.moveNode);
                            // this._move();
                            break;
                    }
                } else
                {
                    this.moveStep();
                }
                break;
            // case MOVETYPE.END:
            //     break;
        }
        // 移动校验
    }
    /**每次移动更新数据 */
    private _updateData()
    {
        this.curNodePos = this.pathNode.convertToNodeSpaceAR(this.moveNode.convertToWorldSpaceAR(cc.v2(0,0)));
        this.nextNodePos = this.pathNode.children[this.index].getPosition();
        this.normalize = this.curNodePos.sub(this.nextNodePos).normalize();
        if (this.normalize.neg().x < 0)
        {// 向左
            this.moveNode.setScale(-this.scaleX,1);
        } else 
        {// 向右
            this.moveNode.setScale(this.scaleX,1);
        }
    }
    private _getMaxRange()
    {
        if (Math.abs(this.normalize.x) > Math.abs(this.normalize.y))
            return Math.abs(this.normalize.x * this.steepScale);
        else
            return Math.abs(this.normalize.y * this.steepScale);
    }
}
@ccclass
export default class PathMove extends cc.Component
{
    private nodeMap: Map<string,MoveNode> = new Map();
    onLoad()
    {

    }
    onEnable()
    {
        cc.game.on(MOVETYPE.RUNMOVESTEP,this.onStep,this);
        cc.game.on(MOVETYPE.RUNMOVETOEND,this.onToEnd,this);
    }
    onToEnd(node: cc.Node,index?: number)
    {
        console.log("移动到终点位置");

    }
    /**
     * 移动一步 为了方便调用事件 完成后回调继续发送本消息可继续移动
     * @param {number} node 要移动的节点
     * @param {number} index 要移动的
     */
    public onStep(node: cc.Node,index?: number)
    {
        console.log("移动一个节点");
        let moveNode: MoveNode = null;
        if (node)
        {
            if (this.nodeMap.has(node.uuid) == false)
            {
                if (index)
                {
                    moveNode = new MoveNode(this.node,node,index);
                } else
                {
                    moveNode = new MoveNode(this.node,node,0);
                }
                this.nodeMap.set(node.uuid,moveNode);
                moveNode.moveStep();
            } else
            {
                moveNode = this.nodeMap.get(node.uuid);
                moveNode.moveStep();
            }
        } else
        {
            console.error("RUNMOVESTEP消息异常 必须发送一个要移动的节点过来")
        }
    }
    onDisable()
    {
        cc.game.off(MOVETYPE.RUNMOVESTEP,this.onStep,this);
        // cc.game.off(MOVETYPE.CONTINUE,this.continueMove,this);
    }
}