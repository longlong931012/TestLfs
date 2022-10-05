import DrawBoard from "./DrawBoard";

const { ccclass,property } = cc._decorator;
@ccclass
export default class DrawCircle extends DrawBoard
{
    /**是否顺时针移动 */
    @property({ type: false,displayName: "顺时针",tooltip: "开启后顺时针寻路" })
    private isCW = false;
    @property({ type: 0,displayName: "密度",tooltip: "数值越小渲染的点越密集 一般2.5-8左右",range: [1,10,0.1],slide: true })
    protected DrawDensity: number = 0;
    /**半径 */
    private circleRadius: number = 0;
    /**弧度 */
    protected radian = 0;
    protected _onLoad()
    {
        if (this.isCW == true)
        {
            // this.PathNode.setPosition(this.PathNode)
        }
        let pos = this.PathNode.getPosition();
        // Math.abs(pPos - tPos);
        this.circleRadius = Math.sqrt(Math.pow((pos.x),2) + Math.pow((pos.y),2));
        console.log("TCL: ---------");
        console.log("TCL: a",this.circleRadius);
        console.log("TCL: ---------");
    }
    protected _start()
    {

    }
    /**生成圆形路径 */
    protected initPath()
    {
        let tempNode = new cc.Node(String(this.drawNum));
        this.drawNum++;
        tempNode.setParent(this.node);
        let angle = 360 - 180 / Math.PI * this.radian;
        // this.PointerNode.angle = angle;
        // 弧度
        this.radian += this.DrawDensity / 100;
        let x: number;
        let y: number;
        if (this.isCW == true)
        {
            x = -this.circleRadius * Math.cos(this.radian);
            tempNode.rotation = -angle + this.node.children[0].children[0].rotation;
        }
        else
        {
            x = this.circleRadius * Math.cos(this.radian);
            tempNode.rotation = angle + this.node.children[0].children[0].rotation;
        }
        y = this.circleRadius * Math.sin(this.radian);
        let pos = cc.v2(x,y);
        if (angle <= 0)
        {
            console.log("回到初始位置 渲染次数",this.drawNum - 1,"渲染节点",this.nodeArr);
            this.unschedule(this.initPath);
            return;
        }
        this.PathNode.setPosition(pos);
        let nodePos = this.converToTargetPos(this.PathNode,this.node);
        tempNode.setPosition(Math.floor(nodePos.x),Math.floor(nodePos.y));
        tempNode.setContentSize(this.BoundingRange,this.BoundingRange);
        // 添加节点组
        this.nodeArr.push(tempNode);
        if (this.TestDraw == true)
        {
            this.drawCircle(nodePos,50);
        } else
        {
            this.initPath();
        }
    }
    _getDistance()
    {

    }
}