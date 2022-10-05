import Level from "./Level";
import { soundMgr } from "soundMgr";
import { TONGYONG } from "../consts/sounds";
import { levelMgr } from "levelMgr";

const { ccclass,property } = cc._decorator;

@ccclass
export default class Level0 extends Level
{
    protected ONLoad()
    {
    }
    protected StartLevel()
    {

    }
    private wenzixiaoketang(index)
    {
        let juanzhou = cc.find("Canvas/ui/cutscene/juanzhou");
        soundMgr.playEffect(TONGYONG.GUOCHANG_JUANZHOU);
        juanzhou.active = true;
        soundMgr.playSound(TONGYONG.WENZIXIAOKETANG,() =>
        {
            this.node.destroy();
            levelMgr.loadLevel('prefabs/level' + String(index),(err) =>
            {
                levelMgr.curLevel.startLevel();
            });
            juanzhou.active = false;
        });
    }
}