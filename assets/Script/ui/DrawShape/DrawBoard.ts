import Shape from "./Shape";

const { ccclass,property } = cc._decorator;

@ccclass
export default abstract class DrawBoard extends cc.Component
{
    @property({ displayName: "脚本说明",readonly: true,multiline: true })
    private BaseStr = "Fill放填充图形,empty放空图形,不要移动任何子节点的初始位置。需要改变位置和旋转都在子节点的Circle | Polygon上调整,初始化会生成大量的点，决定绘图是否流畅，圆和多边形要合理设置系数，根据图片大小大概80 120个点大概就够。"
    @property({ displayName: "小布遮罩",tooltip: "开启此节点只有成功后的移动功能" })
    protected isXiaoBu: boolean = false;
    @property(cc.Node)
    protected PathNode: cc.Node = null;
    @property(cc.Node)
    protected MaskNode: cc.Node = null;
    @property({ type: cc.Node })
    public PointerNode: cc.Node = null;
    @property({ type: 0,displayName: "笔刷",tooltip: "设置笔刷半径" })
    public DrawRadius: number = 0;
    @property({ type: 0,displayName: "矩形检测范围",tooltip: "每个填充点的检测范围,根据需求随意调节,越大越开心" })
    protected BoundingRange: number = 0;
    @property({ type: false,displayName: "测试绘制路径",tooltip: "开启后填充路径用于测试" })
    public TestDraw = false;
    protected touchPos: cc.Vec2 = null;
    protected gra: cc.Graphics = null;
    /**画笔渲染的路径节点 */
    protected nodeArr: Array<cc.Node> = new Array();
    public getNodeArr() { return this.nodeArr }
    protected isSuccess = false;
    protected isEmit = false;
    protected curIndex = 0;
    protected drawNum = 0;
    protected fillNode: cc.Node = null
    protected emptyNode: cc.Node = null
    private isTouchStart = false;
    private step = 3;
    /**检测最大值 */
    private range;
    /**最近的节点和标号 */
    public nearestIndex = 0;
    private nearestNode: cc.Node;
    private isMake = true;
    private isDraw = true;
    private isEnd = false;
    private isMove = true;
    private isGet = true;
    protected converPos(pos)
    {
        return cc.Canvas.instance.node.convertToNodeSpaceAR(pos);
    }
    onLoad()
    {
        this._transfrom();
        this._onLoad();
        if (this.TestDraw == true)
        {
            this.schedule(this.initPath,0.03);
        } else
        {
            this.initPath();
        }
    }
    /**为了方便在调整坐标和旋转 把子节点和父节点对转属性 */
    _transfrom()
    {
        let node = this.node.getComponentInChildren(Shape).node;
        this.fillNode = node.getChildByName("Fill")
        this.fillNode.rotation = node.rotation;
        this.fillNode.setPosition(node.getPosition());
        this.fillNode.setScale(node.scale);
        this.emptyNode = node.getChildByName("mask").getChildByName("empty");
        this.emptyNode.rotation = node.rotation;
        this.emptyNode.setPosition(node.getPosition());
        this.emptyNode.setScale(node.scale);
        node.scale = 1;
        node.rotation = 0;
        node.setPosition(0,0);
    }
    start()
    {
        this.gra = this.MaskNode.getComponent(cc.Mask)._graphics;
        if (!this.isXiaoBu)
        {
            if (this.TestDraw == true)
            {
                if (this.PathNode.childrenCount != 0)
                {
                    this.PathNode.children.forEach(item =>
                    {
                        item.getComponent(cc.Sprite).enabled = true;
                    })
                } else
                {
                    this.PathNode.getComponent(cc.Sprite).enabled = true;
                }
            } else
            {
                if (this.PathNode.childrenCount != 0)
                {
                    this.PathNode.children.forEach(item =>
                    {
                        item.getComponent(cc.Sprite).enabled = false;
                    })
                } else
                {
                    this.PathNode.getComponent(cc.Sprite).enabled = false;
                }
            }
            this.PointerNode.setPosition(this.nodeArr[0].getPosition());
        }
        this._start();
    }
    protected touch_start(e: cc.Event.EventTouch)
    {
        this.touchPos = this.converPos(e.getLocation());
        console.log("Draw Start",this.touchPos)
        if (this.isTouchStart == false)
        {
            // if (this.nodeArr[this.index].getBoundingBox().contains(this.touchPos))
            if (this.nodeArr[0].getBoundingBox().contains(this.touchPos))
            {
                this.PointerNode.rotation = this.nodeArr[this.curIndex].rotation;
                this.PointerNode.setPosition(this.nodeArr[this.curIndex].getPosition())
                this.gra.clear();
                this.drawCircle(this.nodeArr[0].getPosition(),this.DrawRadius);
                this.drawCircle(this.nodeArr[1].getPosition(),this.DrawRadius);
                this.drawCircle(this.nodeArr[2].getPosition(),this.DrawRadius);
                // this.curIndex++;
                // this._Draw();
                this.drawCircle(this.touchPos,this.DrawRadius);
                this.isTouchStart = true;
                console.log("点击起始点");
                // this.index++;
                cc.game.emit("drag_start")
            } else
            {
                console.log("必须点到起始位置开始画画",this.touchPos);
            }
        }
        // this.collision.Touch_star(this._pos);
    }
    updateNeatestIndex()
    {
        if (this.isDraw == true)
        {
            if (this.isMake == true)
            {
                this.isMake = false;
                this.isDraw = false;
                this.isMove = false;
                // 获取一次步长 用于计算 等待走到目标位置后再次获取
                this.range = this.curIndex + this.step;
            }
            if (this.nodeArr[this.range] && this.isGet == true)
            {
                this.isMove = true;
                for (let i = this.curIndex; i <= this.range; i++)
                {
                    this.nearestNode = this.nodeArr[i];
                    if (this.touchPos && this.nearestNode.getPosition())
                    {
                        if (this.touchPos.fuzzyEquals(this.nearestNode.getPosition(),this.BoundingRange))
                        {
                            // if(this.touchPos.fuzzyEquals())
                            this.nearestIndex = i;
                        }
                    }
                }
                this.isGet = false;
            } else
            {
                this.range--;
                this.updateNeatestIndex();
            }
        }
    }
    _move()
    {
        if (this.isMove)
        {
            if (this.curIndex < this.nodeArr.length - 1)
            {
                console.log("TCL: getNodeArr -> this.index",this.curIndex,"nearest=",this.nearestIndex,"num==",this.drawNum,"jinsizhi",this.nearestIndex - this.step,"chazhi",this.curIndex - this.nearestIndex);
                if (this.curIndex == this.nearestIndex - this.step)
                {
                    this._Draw();
                    if (this.curIndex >= this.drawNum - this.step)
                    {
                        for (this.curIndex; this.curIndex < this.drawNum - 1; this.curIndex++)
                        {
                            this.PointerNode.rotation = this.nodeArr[this.curIndex].rotation;
                            this.PointerNode.setPosition(this.nodeArr[this.curIndex].getPosition())
                            this.drawCircle(this.nodeArr[this.curIndex].getPosition(),this.DrawRadius);
                        }
                        this.isEnd = true;
                    }
                    //提前的判断范围 
                } else
                {
                    if (this.isEnd == false)
                    {
                        this.isDraw = true;
                        // this.isMake = true;
                    }
                    this.range = this.curIndex + this.step;
                }
            } else
            {
                if (this.isSuccess == false)
                {
                    console.log("绘画结束");
                    this.isSuccess = true;
                }
            }
        }
    }
    protected touch_move(e: cc.Event.EventTouch)
    {
        // this.touchPos = this.converPos(e.getLocation());
        if (this.isTouchStart == true)
        {
            let d = e.getDelta();
            this.touchPos.x += d.x;
            this.touchPos.y += d.y;
            this.updateNeatestIndex();
            this._move();
            this.isGet = true;
        }
    }
    _Draw()
    {
        if (this.curIndex < this.nearestIndex)
        {
            this.PointerNode.rotation = this.nodeArr[this.curIndex].rotation;
            this.PointerNode.setPosition(this.nodeArr[this.curIndex].getPosition())
            this.drawCircle(this.nodeArr[this.curIndex].getPosition(),this.DrawRadius);
            this.curIndex++;
            this._Draw();
        }
        if (this.curIndex == this.nearestIndex)
        {
            return;
        }
    }
    protected touch_end(e: cc.Event.EventTouch)
    {
        this.touchPos = this.converPos(e.getLocation());
        if (this.isSuccess == true && this.isEmit == false)
        {
            this.isEmit = true;
            console.log("success");
            this.fillAll();
            cc.game.emit("drag_success");
        } else
        {
            cc.game.emit("drag_fail");
        }
    }
    public drawCircle(pos: cc.Vec2,radius: number)
    {
        this.gra.circle(pos.x,pos.y,radius);
        this.gra.fill();
    }
    protected ON()
    {
        this.node.on(cc.Node.EventType.TOUCH_START,this.touch_start,this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE,this.touch_move,this);
        this.node.on(cc.Node.EventType.TOUCH_END,this.touch_end,this);
    }

    protected OFF()
    {
        this.node.on(cc.Node.EventType.TOUCH_START,this.touch_start,this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE,this.touch_move,this);
        this.node.on(cc.Node.EventType.TOUCH_END,this.touch_end,this);
    }
    protected abstract _onLoad();
    protected abstract _start();
    onEnable()
    {
        this.ON();
    }
    onDisable()
    {
        this.OFF();
    }
    onDestroy()
    {
        this.OFF();
        this.node.off(cc.Node.EventType.TOUCH_START,this.touch_start,this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE,this.touch_move,this);
        this.node.off(cc.Node.EventType.TOUCH_END,this.touch_end,this);
    }
    protected abstract initPath();

    public fillAll()
    {
        for (let i = this.curIndex; i <= this.nodeArr.length; i++)
        {
            if (this.nodeArr[this.curIndex])
            {
                this.drawCircle(this.nodeArr[this.curIndex].getPosition(),this.DrawRadius + 20);
            }
        }
        this.drawCircle(this.nodeArr[0].getPosition(),this.DrawRadius + 50);
    }
    /**把当前节点坐标转换到目标节点坐标下 */
    public converToTargetPos(changeNode: cc.Node,targetNode: cc.Node): cc.Vec2
    {
        return targetNode.convertToNodeSpaceAR(changeNode.convertToWorldSpaceAR(cc.v2(0,0)));
    }
    // protected abstract touch_start(e);
    // protected abstract touch_move(e);
    // protected abstract touch_end(e);
}
