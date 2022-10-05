const { ccclass,property } = cc._decorator;
@ccclass
export default class ScreenShotNode extends cc.Component
{
    @property({ displayName: "截图时隐藏",tooltip: "挂载此脚本开启后在截图时会隐藏勾选了UI的节点 显示普通节点" }) isUI: boolean = false;
    private sp: cc.Sprite = null;
    onLoad()
    {
        this.sp = this.node.getComponent(cc.Sprite);
        cc.game.on("showNode",this.showNode,this);
        cc.game.on("hideNode",this.hideNode,this);
    }
    showNode()
    {
        console.log("show Node",this.node.name);
        if (this.isUI == true)
        {
            this.sp.enabled = false;
        } else
        {
            this.sp.enabled = true;
        }
    }
    hideNode()
    {
        console.log("hide Node",this.node.name);
        if (this.isUI == true)
        {
            this.sp.enabled = true;
        } else
        {
            this.sp.enabled = false;
        }
    }
    onDestroy()
    {
        cc.game.off("showNode",this.showNode);
        cc.game.off("hideNode",this.hideNode);
    }
}