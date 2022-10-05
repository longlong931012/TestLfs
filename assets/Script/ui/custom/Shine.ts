import { BONES,SHINETYPE } from "../../consts/bones";
import { dragons } from "dragons";

const { ccclass,property } = cc._decorator;

@ccclass
export default class Shine extends cc.Component
{
    @property({ type: cc.Enum(SHINETYPE) }) ShineType = SHINETYPE.NULL;
    @property IdleAnimation = ""
    @property ShineAnimation = ""
    onEnable()
    {
        this.ON();
    }
    nodeShine()
    {
        dragons.playAnimation(this.node,this.ShineAnimation,2,() =>
        {
            dragons.playAnimation(this.node,this.IdleAnimation,0);
        });
    }
    unShine()
    {
        dragons.playAnimation(this.node,this.IdleAnimation,0);
    }
    ON()
    {
        this.node.on(BONES.SHINE,this.nodeShine,this);
        this.node.on(BONES.SHINE,this.unShine,this);
    }
    OFF()
    {
        this.node.off(BONES.SHINE,this.nodeShine,this);
        this.node.off(BONES.SHINE,this.unShine,this);
    }
}