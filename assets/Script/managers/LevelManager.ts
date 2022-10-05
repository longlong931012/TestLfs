import Level from "../ui/Level";
import { dragons } from "dragons";
import { soundMgr } from "soundMgr";
const levelStr = "level";
enum INDEXTYPE
{
    PRE = -1,
    NEXT = 1,
}
class LevelManager
{
    private page: number = 1;
    private levelIndex: number = 0;
    private gameNode: cc.Node;
    private preLevelNode: cc.Node = null;
    private curLevel: Level = null;
    public initLevel(level: Level)
    {
        this.curLevel = level;
        this.levelIndex = parseInt(level.name.substring(5));
        this.gameNode = level.node.getParent();
    }
    public loadLevel(levelPath: string,callback?: Function)
    {
        cc.loader.loadRes("prefabs/" + levelPath,cc.Prefab,(err,res) =>
        {
            if (err)
            {
                cc.warn('关卡预制体加载失败:',err);
            } else
            {
                this.preLevelNode = this.curLevel.node;
                console.log("当前加载课程:",levelPath);
                let node: cc.Node = cc.instantiate(res);
                this.addLevel(node);
                // 新课加载之后删除上一课
                this.preLevelNode.destroy();
                if (callback)
                {
                    callback();
                } else
                {
                    this.curLevel.startLevel();
                }
            }
        })
    }
    private addLevel(node: cc.Node)
    {
        node.setParent(this.gameNode);
    }
    private getLevelStr(index)
    {
        return levelStr + String(index);
    }
    private get PreStr()
    {
        return levelStr + String(--this.levelIndex);
    }
    private get NextStr()
    {
        return levelStr + String(++this.levelIndex);
    }

    /**
     * 带动画的切场
     * @param {number} index cutscene的子节点序号
     * @param {string} sounds 播放对应sounds文件夹内的音频文件
     * @param {string} enterAnimation 进入动画名
     * @param {string} [exitAnimtaion] 退出动画名 根据重载不传代表没有进入动画
     */
    public playAnimationGoToNextLevel(index: number,sounds: string,enterAnimation: string,exitAnimtaion?: string)
    {
        let node: cc.Node = cc.find("Canvas/ui/cutscene").children[index];
        node.active = true;
        if (sounds != null)
        {
            // TODO 防止耦合暂时用系统的播放
            cc.loader.loadRes("sounds/" + sounds,cc.AudioClip,(err,res) =>
            {
                cc.audioEngine.play(res,false,1);
            })
        }
        dragons.playAnimation(node,enterAnimation,1,() =>
        {
            // 带结束动画就等load之后播放结束动画,然后在执行startLevel
            if (exitAnimtaion)
            {
                this.loadLevel(this.NextStr,() =>
                {
                    dragons.playAnimation(node,exitAnimtaion,1,() =>
                    {
                        this.curLevel.startLevel();
                        node.active = false;
                    })
                });
            } else
            {
                this.loadLevel(this.NextStr,() =>
                {
                    node.active = false;
                });
            }
        })
    }
    public goToNextLevel(callback?: Function)
    {
        if (callback)
        {
            this.loadLevel(this.NextStr,callback);
        } else
        {
            this.loadLevel(this.NextStr);
        }
    }
    public goToPreLevel(callback?: Function)
    {
        if (callback)
        {
            this.loadLevel(this.PreStr,callback);
        } else
        {
            this.loadLevel(this.PreStr);
        }
    }
    public changeLevel(index: number,callback?: Function)
    {
        this.levelIndex = index;
        if (callback)
        {
            this.loadLevel(this.getLevelStr(index),callback);
        } else
        {
            this.loadLevel(this.getLevelStr(index));
        }
    }
    public switchQuestion(node,index)
    {
        let oName = node.name;
        let nextNode = node.parent.getChildByName(node.name + String(index));
        nextNode.active = true;
        node.destroy();
        nextNode.name = oName;
        return nextNode;
    }
}
export default new LevelManager();