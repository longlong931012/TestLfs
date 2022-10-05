
const {ccclass, property} = cc._decorator;

@ccclass
export default class Pannel_Result extends cc.Component {
    @property(cc.Node)
    private m_Context:cc.Node = null;//内容节点

    @property(cc.Node)
    private m_GoldShowLayer:cc.Node = null;// 金币动画层
    
    @property([cc.ParticleSystem])
    private m_ParticleSystemArr:Array<cc.ParticleSystem> = [];// 粒子系统
    @property(cc.Prefab)
    private m_GoldPre:cc.Prefab = null;// 金币
    @property(cc.Node)
    private m_PlayerGoldIcon:cc.Node = null;// 用户金币图标
    @property(cc.Node)
    private m_PlayerGoldBg:cc.Node = null;// 玻璃条
    @property(cc.Label)
    private m_PlayerGoldNumLabel:cc.Label = null;// 用户金币数量
    @property(cc.Node)
    private m_Role:cc.Node = null;//  角色
    @property(sp.Skeleton)
    private m_RoleAni:sp.Skeleton = null;//  角色动画
    @property(sp.Skeleton)
    private m_LightAni:sp.Skeleton = null;//  亮光
    @property(cc.Node)
    private m_Land:cc.Node = null;// 地面

    private _goldDisX:number = 100;
    private _goldTargetY:number = 185;
    private m_RewardGoldArr:Array<cc.Node> = [];//奖励金币节点总数
    private m_CloseCallback:Function = null;

    public m_RewardGoldNum:number = 0;//奖励金币数
    public m_PlayerGoldCount:number = 0;//用户金币总数

    onLoad(){
        this.m_LightAni.clearTracks();
    }

    show(rewardGoldNum:number, playerGoldCount:number, closeCallback:Function = null, showAni:boolean = false){
        this.m_RewardGoldNum = rewardGoldNum;
        this.m_PlayerGoldCount = playerGoldCount;
        cc.log('金币总数:',(playerGoldCount+rewardGoldNum));
        if (playerGoldCount+rewardGoldNum > 0){
            cc.log('------------------有金币');
            this.m_PlayerGoldNumLabel.string = playerGoldCount+"";
        }else{
            cc.log('------------------无金币');
            this.node.getChildByName("圆按钮底").active = false;
            this.node.getChildByName("玻璃条").active = false;
        }
        this.m_CloseCallback = closeCallback;

        this.OnPrepareOpen();
        if(showAni){
            let self = this;
            this.m_Context.scale = 0.4;
            let _moveAction = cc.scaleTo(0.4, 1);
            let _moveDone = cc.callFunc(()=>{
                self.OnOpened();
            })
            _moveAction.easing(cc.easeBackOut());
            var _action = cc.speed(
                cc.sequence(
                    _moveAction,
                    _moveDone,
                ), 
            1);
            this.m_Context.runAction(_action);
        }else{
            this.OnOpened();
        }
       
        cc.director.getScene().addChild(this.node);
    }

    /**
     * 目前游戏逻辑用不到
     */
    public hide(){
        for(let i =0;i<this.m_ParticleSystemArr.length;i++){
            let particleSystem = this.m_ParticleSystemArr[i];
            particleSystem.stopSystem();
        }
        this.node.removeFromParent();
        this.m_CloseCallback&&this.m_CloseCallback();
    }

    private OnPrepareOpen(){
       
        
        for(let i =0;i<this.m_RewardGoldNum;i++){
            let goldNode =cc.instantiate(this.m_GoldPre);
            this.m_RewardGoldArr.push(goldNode);
        }
        
    }

    showBgAni(){

        for(let i =0;i<this.m_ParticleSystemArr.length;i++){
            let particleSystem = this.m_ParticleSystemArr[i];
            particleSystem.resetSystem();
        }
    }
    private OnOpened(){
        let self = this;

        this.m_Land.runAction(cc.sequence(
            cc.moveTo(0.35, 0, -7).easing(cc.easeBackOut()),
            cc.callFunc(()=>{
                self.m_Role.runAction(cc.sequence(
                    cc.moveTo(0.15, 0, 23),
                    cc.callFunc(()=>{
                        self.showBgAni();
                        let time = 0.3;
                        self.m_Land.runAction(cc.sequence(cc.moveBy(0.1, 0, -40), cc.moveBy(time, 0, 40).easing(cc.easeBackOut())));
                        self.m_Role.runAction(cc.sequence(cc.moveBy(0.1, 0, -40), cc.moveBy(time, 0, 40).easing(cc.easeBackOut()), cc.callFunc(()=>{
                            self.showGold();
                        })));
                        self.m_RoleAni.setAnimation(0, "xiaobu_jiesuan", true);
                        self.m_LightAni.setAnimation(0, "jiangli_jiesuan", true);
                    })
                ));
            })
        ))

    }
    private showAni(node:cc.Node,scale:number){
        let self = this;
        let orgScale = node.scale;
        node.runAction(cc.sequence(cc.scaleTo(0.03, scale, scale), cc.scaleTo(0.03, orgScale, orgScale),cc.callFunc(()=>{
            self.m_PlayerGoldIcon.scale = 1;
            self.m_PlayerGoldBg.scale = 1;
            self.m_PlayerGoldIcon.stopAllActions();
            self.m_PlayerGoldBg.stopAllActions();
        })));
    }

    private showGold(){

        let self = this;
        let oldGoldNum = this.m_PlayerGoldCount;
        let goldNum = this.m_RewardGoldArr.length;
        cc.log('播放金币动画数:',goldNum);

        let radius = 375;
        for(let i = 0;i<goldNum;i++){
            let gold = this.m_RewardGoldArr[i];
            gold.position = new cc.Vec2(0,-100);

            let index = i;
            if(goldNum%2 == 0){
                index += 0.5;
            }
            let angle = (Math.floor(goldNum/2) - index )*0.4 - Math.PI;
            let rx = radius * Math.sin(angle);
            let ry = -radius * Math.cos(angle)-130;

            gold.runAction(cc.sequence(cc.delayTime(0.1*i),
                cc.moveTo(0.175, rx, ry).easing(cc.easeBackOut()), cc.delayTime(goldNum*0.2),
                cc.moveTo(0.15, this.m_PlayerGoldIcon.position), cc.callFunc(()=>{
                    self.m_PlayerGoldNumLabel.string = (++oldGoldNum)+"";
                    gold.removeFromParent();
                    self.showAni(this.m_PlayerGoldIcon,1.2);
                    self.showAni(this.m_PlayerGoldBg,1.2);
                })));
            this.m_GoldShowLayer.addChild(gold);
        }


        if (goldNum >= 3){
            self.scheduleOnce(function () {
                self.hide();
            },goldNum*0.9);
        }else{
            self.scheduleOnce(function () {
                self.hide();
            },3);
        }

    }
}
