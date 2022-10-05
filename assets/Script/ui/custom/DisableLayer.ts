import { TOUCH } from "../../consts/consts";
import { nodeMgr } from "nodeMgr";

const { ccclass,property } = cc._decorator;

@ccclass
export default class DisableLayer extends cc.Component
{
    onLoad()
    {
        cc.game.on("disableTouch",this.enableTouch,this);
        cc.game.on("enableTouch",this.disableTouch,this);
    }
    enableTouch(e)
    {
        this.node.active = false;
    }
    disableTouch(e)
    {
        this.node.active = true;
    }
}
