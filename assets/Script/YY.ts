import { TONGYONG,SOUNDSTYPE,SOUNDS } from "./consts/sounds";

/**
 * 工具类
 * @class YY
 */
class YY
{
    /**
     * 坐标转换到最高节点下
     * @param {cc.Vec2} pos
     * @returns {cc.Vec2}
     * @memberof YY
     */
    converCanvasPos(pos: cc.Vec2): cc.Vec2
    {
        return cc.Canvas.instance.node.convertToNodeSpaceAR(pos);
    }
    /**
     * 数组打乱
     * @param {Array<T>} arr 数组
     * @returns 返回打乱后的数组
     */
    public reSortArr<T>(arr: Array<T>)
    {
        return arr.sort(() => { return 0.5 - Math.random(); });
    }
    /**
     * 获得范围内的随机数
     * @param {number} min 最小值
     * @param {number} max 最大值
     * @returns {number} 随机数
     */
    public getRandom(min: number,max: number): number
    {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    /**
     * 换图
     * @param {cc.Node} node 换图的节点
     * @param {cc.SpriteFrame} spf 图片
     */
    public setSpriteFrame(node: cc.Node,spf: cc.SpriteFrame)
    {
        node.getComponent(cc.Sprite).spriteFrame = spf;
    }
    public instance(url: string,parentNode: cc.Node)
    {
        cc.loader.loadRes(url,cc.Prefab,(err,res: cc.Prefab) =>
        {
            let node = cc.instantiate(res);
            node.setParent(parentNode);
            return node;
        })
    }
    public setOutside(node: cc.Node,location: string)
    {
        let w = cc.winSize.width;
        switch (location)
        {
            case "left":
                node.setPosition(-w + ((w - node.width) / 2),node.y);
                break;
            case "right":
                node.setPosition(w - ((w - node.width) / 2),node.y);
                break;
        }
    }
    /**
     * 获得changeNode在targetNode节点下的坐标
     * @param {cc.Node} changeNode 要转换的节点
     * @param {cc.Node} targetNode 目标节点  坐标将转换到这个节点下
     */
    public converToTarget(changeNode: cc.Node,targetNode: cc.Node): cc.Vec2
    {
        return targetNode.convertToNodeSpaceAR(changeNode.convertToWorldSpaceAR(cc.v2(0,0)));
    }
}
export default new YY();