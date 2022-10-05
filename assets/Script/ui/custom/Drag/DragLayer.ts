import Container from "./Container";

const { ccclass,property } = cc._decorator;
@ccclass
export default class DragLayer extends cc.Component
{
    @property(Container)
    private containerArr: Array<Container> = [];
    public getContainer()
    {
        return this.containerArr;
    }
}