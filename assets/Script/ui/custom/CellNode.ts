import { GROUPID } from "../../consts/bones";

const { ccclass,property } = cc._decorator;

@ccclass
export default class CellNode extends cc.Component
{
    @property({ tooltip: "物品标识" })
    public cellId = "";
    @property({ type: cc.Enum(GROUPID),tooltip: "物品组类型" })
    public groupId: GROUPID = GROUPID.NULL;
    onLoad()
    {
        if (this.node.width === 0 || this.node.height === 0)
        {
            cc.error('操作节点没有宽高',this.node.name);
        }
    }
}