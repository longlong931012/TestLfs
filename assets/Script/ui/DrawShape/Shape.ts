const { ccclass,property } = cc._decorator;

@ccclass
export default class Shape extends cc.Component
{
    onLoad()
    {
        this.node.name = "Shape";
    }
}
// TODO 考虑把抽象类改成接口 js不知道能不能实现接口 待定
export interface IShape
{
    initPath();
}
class Polygon implements IShape
{
    initPath()
    {

    }
}
class Circle implements IShape
{
    initPath()
    {

    }
}