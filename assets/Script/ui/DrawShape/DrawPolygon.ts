import DrawBoard from "./DrawBoard";
import { XIAOBU } from "../../consts/bones";
import { dragons } from "dragons";
import { actions } from "actions";
import { soundMgr } from "soundMgr";
import { SOUNDS,TONGYONG } from "../../consts/sounds";
import { levelMgr } from "levelMgr";

const { ccclass,property } = cc._decorator;
@ccclass
export default class DrawPolyGgon extends DrawBoard
{
    // @property({ type: cc.Node }) PathNode: cc.Node = null;
    // @property({ type: cc.Node }) MaskNode: cc.Node = null;
    @property({ displayName: '系数',tooltip: '多边形计算下一个点需要单位化向量 单位化之后会乘以系数给定比例增长,系数越低点越密集一般8-10左右合适',range: [5,15,1],slide: true,visible() { return (this.isXiaoBu == false) } })
    private DrawScale: number = 1;
    // TODO 不会计算多边形的的角度 这条属性待优化
    @property({ type: [cc.Integer],displayName: "目标旋转",tooltip: "下一个节点的旋转角度",})
    protected rotationArr: Array<number> = [];

    private pointerPos: cc.Vec2 = null;
    private nor: cc.Vec2 = null;
    private subPos: cc.Vec2;
    private isNext = true;
    private rotationIndex = 0;
    private nextAngle = 0;
    protected _onLoad()
    {
        let node = cc.instantiate(this.PathNode.children[0])
        // let food=cc.instantiate(this.FoodPath[0])
        this.PathNode.children.push(node)
        this.curIndex = 1;
        this.PointerNode.rotation = -this.rotationArr[0];
    }
    protected _start()
    {
    }
    protected initPath()
    {
        let tempNode = new cc.Node(String(this.drawNum));
        this.drawNum++;
        tempNode.setParent(this.MaskNode);
        if (this.isNext == true)
        {
            this.isNext = false;
            this._upDateNextPointerData();
        }
        tempNode.angle = this.nextAngle;
        this.pointerPos = this.pointerPos.sub(cc.v2(this.nor.x * this.DrawScale,this.nor.y * this.DrawScale));
        this.PathNode.children[0].setPosition(this.pointerPos);
        let nodePos = this.converToTargetPos(this.PathNode.children[0],this.node);
        tempNode.setPosition(Math.floor(nodePos.x),Math.floor(nodePos.y));
        tempNode.setContentSize(this.BoundingRange,this.BoundingRange);
        this.nodeArr.push(tempNode);
        if (this.pointerPos.fuzzyEquals(this.PathNode.children[this.curIndex].getPosition(),10))
        {
            if (this.PathNode.children[this.curIndex + 1])
            {
                console.log("下一个节点",this.curIndex);
                this.isNext = true;
                this.curIndex++;
                this.initPath();
            } else
            {
                console.log("回到初始位置 渲染次数:",this.drawNum,"如果渲染节点太多请合理调整系数或密度",this.nodeArr);
                if (this.TestDraw == true)
                {
                    this.unschedule(this.initPath);
                } else
                {
                    return;
                }
            }
        } else
        {
            if (this.TestDraw == true)
            {
                this.drawCircle(nodePos,this.DrawRadius);
            } else
            {
                this.initPath();
            }
        }
    }
    /**更新下一个目标节点的基本向量 */
    private _upDateNextPointerData()
    {
        this.nextAngle = this.rotationArr[this.rotationIndex];
        this.rotationIndex++;
        this.pointerPos = this.PathNode.children[0].getPosition();
        this.subPos = this.pointerPos.sub(this.PathNode.children[this.curIndex].getPosition());
        // 单位化
        this.nor = this.subPos.normalize();
    }
}