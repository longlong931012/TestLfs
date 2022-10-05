import { dragons } from "dragons";
import { actions } from "actions";
import DrawBoard from "./DrawBoard";

const { ccclass,property } = cc._decorator;
const enum TIPS
{
    DIAN = "dian",
    IDLE = "Idle",
    AN = "an",
    SONG = "song",
}
@ccclass
export default class moveTips extends cc.Component
{
    @property(cc.Node) Tips: cc.Node = null;
    @property({ type: 0,displayName: "移动系数",tooltip: "越大越慢",range: [1,30,1] })
    @property moveScale: number = 0;
    private _drawBoard: DrawBoard = null;
    private _gra: cc.Graphics = null;
    private orginPos: cc.Vec2 = null;
    private orginAngl = 0;

    public get DrawBoard()
    {
        if (this._drawBoard == null)
        {
            this._drawBoard = this.node.parent.getComponent(DrawBoard);
        }
        return this._drawBoard;
    }
    private get pointer()
    {
        return this.DrawBoard.PointerNode;
    }
    public get gra(): cc.Graphics
    {
        if (this._gra == null)
        {
            this._gra = this.node.parent.getComponentInChildren(cc.Mask)._graphics;
        }
        return this._gra;
    }
    onLoad()
    {
        this.Tips.rotation = -this.node.parent.rotation;
    }
    start()
    {
        this.orginPos = this.DrawBoard.getNodeArr()[0].getPosition();
        this.orginAngl = this.DrawBoard.getNodeArr()[0].angle;
    }
    onEnable()
    {
        this._startMove();
    }
    _startMove()
    {
        this.Tips.setPosition(this.DrawBoard.getNodeArr()[0].getPosition())
        dragons.playAnimation(this.Tips.children[0],TIPS.AN,1,() =>
        {
            // this.drawCircle(this.DrawBoard.getNodeArr()[0].getPosition(),this.DrawBoard);
            this._move(this.DrawBoard.getNodeArr(),0);
            // dragons.playAnimation(this.Tips.children[0],TIPS.IDLE,1,() => { });
        });
    }
    _move(path: Array<cc.Node>,index: number)
    {
        this.drawCircle(path[index].getPosition(),this.DrawBoard.DrawRadius);
        this.pointer.angle = this.DrawBoard.getNodeArr()[index].angle;
        this.pointer.setPosition(path[index].getPosition())
        actions.moveTo(this.Tips,this.moveScale / 100,path[index].x,path[index].y,() =>
        {
            if (index >= path.length - 1)
            {
                this.Tips.setPosition(this.DrawBoard.getNodeArr()[0].getPosition())
                dragons.playAnimation(this.Tips.children[0],TIPS.IDLE,1,() => { });
                this.pointer.setPosition(this.orginPos);
                this.pointer.angle = this.orginAngl;
                this.node.active = false;
                this.gra.clear();
            } else
            {
                // console.log("Tips Move");
                index++;
                this._move(path,index);
            }
        });
    }
    protected drawCircle(pos: cc.Vec2,radius: number)
    {
        this.gra.circle(pos.x,pos.y,radius);
        this.gra.fill();
    }
    onDisable()
    {
    }
    //跟着轨迹旋转的角度
    // private _getAngle(x1,y1,x2,y2)
    // {
    //     // 直角的边长
    //     let x = Math.abs(x1 - x2);
    //     let y = Math.abs(y1 - y2);
    //     let z = Math.sqrt(x * x + y * y);
    //     let angle = Math.floor((Math.asin(y / z) / Math.PI * 180));
    //     if (y2 > y1 && x2 < x1)
    //     {
    //         angle = 180 - angle
    //     } else if (y2 < y1 && x2 < x1)
    //     {
    //         angle = 180 + angle
    //     } else if (y2 < y1 && x2 > x1)
    //     {
    //         angle = 360 - angle
    //     }
    //     return angle;
    // }

}