import { nodeMgr } from "nodeMgr";
import { soundMgr } from "soundMgr";
import { TONGYONG,SOUNDS } from "../../consts/sounds";
import { dragons } from "dragons";
import { actions } from "actions";
import { XIAOBU } from "../../consts/bones";
import DrawBoard from "./DrawBoard";

const { ccclass,property } = cc._decorator;
export enum SHUIGUO
{
    boluo1,
    boluo3,
    boluo4,
    caomei1,
    caomei3,
    caomei5,
    xigua11,
    xigua13,
    xigua15,
    yumi1,
    yumi3,
    yumi5,
}
@ccclass
export default class MoveXiaobu extends cc.Component
{
    @property({ type: cc.Integer }) private Speed = 0;
    @property({ type: cc.Node }) private FoodPath: cc.Node = null;
    @property({ type: [cc.Enum(SHUIGUO)] }) ShuiGuoType: Array<SHUIGUO> = [];
    @property({ tooltip: "小布拿起的动作名" }) private collectAnim = "";
    @property(DrawBoard) DrawBoard: DrawBoard = null;
    private index = 0;
    private slot: dragonBones.Slot = null;
    private oPos: cc.Vec2 = new cc.Vec2();
    private moveIndex = 0;
    private _nodeArr: Array<cc.Node> = null;
    private get nodeArr()
    {
        if (this._nodeArr == null)
        {
            this._nodeArr = this.DrawBoard.getNodeArr();
        }
        return this._nodeArr;
    }
    onLoad()
    {
        cc.game.on("drag_success",this.xiaobuSuccess,this);
        this.oPos = this.node.getPosition();
        this.slot = this.node.children[0].getComponent(dragonBones.ArmatureDisplay).armature().getSlot("shuiguo");
    }
    private xiaobuSuccess()
    {
        console.log("MoveXiaobuSuccess");
        nodeMgr.disableTouch();
        soundMgr.playBackgroundMusic(TONGYONG.RIGHT)
        soundMgr.playSoundEffectByName(SOUNDS.PB_05,() => { });
        this._move(this.FoodPath.children,0);
    }
    _move(pathArr: Array<cc.Node>,index)
    {
        if (index < this.FoodPath.childrenCount - 1)
        {
            let target = pathArr[index];
            let food = this.FoodPath.children[this.moveIndex];
            this.schedule(this._xiaobuDraw,this.Speed / 100);
            dragons.playAnimation(this.node.children[0],XIAOBU.Ren_walk,0,() => { });
            actions.moveTo(this.node,1,target.x,target.y,() =>
            {
                // if (index == 0)
                // {
                //     this.slot.displayIndex = this.foodTypeArr[index];
                // }
                food.active = false;
                this.unschedule(this._xiaobuDraw);
                dragons.playAnimation(this.node.children[0],this.collectAnim,1,() =>
                {
                    soundMgr.playBackgroundMusic(SOUNDS.PB_43);
                    switch (index)
                    {
                        case 0:
                            this.slot.displayIndex = this.ShuiGuoType[0]
                            break;
                        case 2:
                            this.slot.displayIndex = this.ShuiGuoType[1]
                            break;
                        case 4:
                            this.slot.displayIndex = this.ShuiGuoType[2]
                            break;
                    }
                    index++;
                    this.moveIndex++;
                    this._move(pathArr,index);
                })
            })
        } else
        {
            this.schedule(this._xiaobuDraw,this.Speed / 100);
            dragons.playAnimation(this.node.children[0],XIAOBU.Ren_walk,0,() => { });
            actions.moveTo(this.node,1,this.oPos.x,this.oPos.y,() =>
            {
                console.log("end");
                soundMgr.playSoundEffectByName(TONGYONG.BIG_RIGHT,() => { });
                this.DrawBoard.fillAll();
                dragons.playAnimation(this.node.children[0],XIAOBU.Ren_happy,3,() =>
                {
                    cc.game.emit("moveEnd")
                });
                return;
            })
        }
    }
    _xiaobuDraw()
    {
        this.DrawBoard.drawCircle(this.node.getPosition(),this.DrawBoard.DrawRadius);
    }
    onDestroy()
    {
        cc.game.off("drag_success",this.xiaobuSuccess,this);
    }
}