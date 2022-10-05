import Level from "./Level";
import LevelManager from "../managers/LevelManager";
import { nodeMgr } from "nodeMgr";
import { actions } from "actions";
import { dragons } from "dragons";
import { MOVETYPE } from "./motion/PathMove";
import { tipsMgr } from "./tips/TipsMgr";
import { SOUNDS,SOUNDSTYPE } from "../consts/sounds";
import { soundMgr } from "soundMgr";
import SoundMgrTS from "../managers/SoundMgrTS";
import AnimMgr from "../managers/AnimMgr";
import DragNode from "./custom/Drag/DragNode";

const { ccclass,property } = cc._decorator;
@ccclass
export default class Level1 extends Level
{

    protected ONLoad()
    {
    }

    protected StartLevel()
    {
        // nodeMgr.disableTouch();
        nodeMgr.enableTouch();
        soundMgr.playSound("");
  
        
    }
    Drag_Start(e:DragNode)
    {
        console.log("drag start",e.node)

    }
    Drag_Success(e:DragNode)
    {
        console.log("draga success",e.node)

    }
    Drag_Wrong(e:DragNode)
    {
        console.log("drag wrong",e.node)
    }
    Drag_Fail(e:DragNode)
    {
        console.log("drag fail",e.node)
    }
}