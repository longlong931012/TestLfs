import { dragons } from "dragons";
import { actions } from "actions";

const { ccclass,property } = cc._decorator;

@ccclass
export default class DragTips extends cc.Component
{
    @property dragStartAnimation: string = 'dian';
    @property dragIdleAnimation: string = 'Idle';
    @property moveTime = 3;
    @property(cc.Node) TargetNode: cc.Node = null;
    @property(cc.Node) AnimationNode: cc.Node = null;
    public originPosition: cc.Vec2 = null;
    private isOnce = false;
    private act: cc.Action;
    onLoad()
    {
        this.originPosition = this.node.getPosition();
    }
    onEnable()
    {
        this.tipsMove();
    }
    tipsMove()
    {
        this.node.setPosition(this.originPosition);
        this.node.opacity = 255;
        if (this.isOnce == false)
        {
            this.isOnce = true;
            cc.game.emit("shine","r")
        }
        if (this.act != null)
        {
            this.node.stopAction(this.act);
        }
        dragons.playAnimation(this.AnimationNode,this.dragStartAnimation,1,() =>
        {
            this.act = actions.moveTo(this.node,this.moveTime,this.TargetNode.x,this.TargetNode.y,() =>
            {
                this.node.opacity = 0;
                this.scheduleOnce(() =>
                {
                    this.tipsMove();
                },0.3)
            });
        });
    }
    onDisable()
    {
        this.node.opacity = 255;
        this.node.setPosition(this.originPosition);
        this.node.stopAllActions();
        this.isOnce = false;
    }
}