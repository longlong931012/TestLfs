import CellNode from "../CellNode";
import DragNode from "./DragNode";
import DragLayer from "./DragLayer";
import { actions } from "actions";

// export enum 
const { ccclass,property } = cc._decorator;
@ccclass
export default class Container extends CellNode
{
    private chilName = 0;
    @property({ type: cc.Integer,visible() { return this.undateChilNode() },range: [0,20,1],tooltip: "容量,设置以后会自动生成子节点,默认数量最大容量20个 需要20个以上自行到到代码里该" })
    private _capacity = 0;
    // 参数变化的时候更新子节点数量
    private undateChilNode()
    {
        if (this._capacity <= 0 || this.node.childrenCount > this._capacity)
        {
            this.chilName = 0;
            this.node.removeAllChildren();
            return true;
        } else if (this.node.childrenCount < this._capacity)
        {
            ++this.chilName;
            let node = new cc.Node(String(this.chilName));
            node.parent = this.node;
            node.addComponent(cc.Sprite);
            return false;
        } else 
        {
            return true;
        }
    }
    public getCapacity()
    {
        return this._capacity;
    }
    // 存放当前容器内的节点
    private nodeArr: Array<cc.Node> = new Array();
    public getNodeArr(): Array<cc.Node>
    {
        return this.nodeArr;
    }
    // 当前放入的数量
    private curNodeNum = 0;
    public get ID()
    {
        return this.cellId;
    }
    public setID(v: string)
    {
        this.cellId = v;
    }
    /**
     * 添加节点到目标下
     * @param {cc.Node} node 当前拖拽节点
     * @param {number} [index] 下表第几个 默认-1会按顺序加入
     */
    public addNode(node: cc.Node,index: number,canPutIn: boolean)
    {
        // 容量足够还能放
        if (this.nodeArr.length < this._capacity)
        {
            return this.put(node,index,canPutIn);
        } else
        {
            console.warn("当前容器已满");
            return false;
        }
    }
    /**
     * 放入节点
     * @param {cc.Node} node 当前拖拽的节点
     * @param {number} index 是否传入下表重载
     * @param {boolean} isPutIn 放入显示节点还是归位
     * @returns 放置成功与否
     */
    private put(node: cc.Node,index: number,isPutIn: boolean)
    {
        if (index > 0)
        {
            return this.targetPutIn(node,index - 1,isPutIn);
        } else
        {
            return this.orderPutIn(node,-1,isPutIn);
        }
    }
    /** 放入*/
    private putIn(node: cc.Node,index,isPut)
    {
        if (isPut == true)
        {
            this.nodeArr.push(node);
            node.parent = this.node.children[index];
            node.setPosition(0,0);
        } else
        {
            this.nodeArr.push(node);
            node.parent = this.node.children[index];
            node.setPosition(0,0);
            node.active = false;
        }
    }
    // 传递了下标就按照下下标放入
    private targetPutIn(node: cc.Node,index: number,isPut)
    {
        // 从1开始传递方便看
        if (this.canPut(index) == true)
        {
            console.log("target put");
            this.putIn(node,index,isPut);
            return true;
        } else
        {
            console.error("有重复放置 检查下标设置")
            return false;
        }
    }
    // 没有传递下标就从0开始遍历空节点放入
    private orderPutIn(node: cc.Node,index,isPut)
    {
        ++index;
        if (index < this.node.childrenCount)
        {
            if (this.canPut(index) == true)
            {
                this.putIn(node,this.curNodeNum,isPut);
                ++this.curNodeNum;
                console.log("节点:",index + 1,"找到空插槽放入目标");
            } else
            {
                console.log("节点:",index + 1,"已有物品,查询下一个");
                this.orderPutIn(node,index,isPut);
            }
            return true;
        } else
        {
            console.warn("当前容器已满")
            return false;
        }
    }
    // 检查这个子节点能不能放入
    private canPut(index: number)
    {
        // >0表示有物品了
        if (this.node.children[index].childrenCount > 0)
        {
            return false;
        } else
        {
            return true;
        }
    }
}