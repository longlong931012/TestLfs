/**
 * YaoYe 常用功能API 主要用于给TS脚本提示索引
 */
declare namespace yaoye
{
    interface INodeMgr
    {
        // setBG(curBG: cc.Node);
        // setAnimBG(bgAnim: cc.Node);
        /**开发模式开关 开启时免疫鼠标禁用效果  */
        showCutscene(index: number,sounds: string,animationStr: string,isActive: boolean,callback: Function);
        initNode(node: cc.Node);
        /**将传入节点添加到game节点下 */
        addNode(node: cc.Node);
        /**查找Canvas内的节点 */
        findNode(path: string): cc.Node;
        doShake(node: cc.Node,duration: number);
        /**播放 关闭画面 */
        showChangeScene(callback?: Function);
        /**播放 开启画面 */
        hideChangeScene(callback?: Function);
        juanzhouChangeScene(callback?: Function);
        /**禁用点击事件 */
        disableTouch();
        /**开放点击事件 */
        enableTouch();
        addBGImgChild(node: cc.Node);
        addBGImgChild(node: cc.Node);
        /**
         * @param arr 把传入数组打乱
         */
        reSortArr<T>(arr: Array<T>)
    }
    interface IActions
    {
        /**延迟 */
        delayTime(node: cc.Node,delayTime: number,callback?: Function)
        /**渐显 */
        fadeIn(node: cc.Node,delayTime: number,callback?: Function)
        /**渐隐 */
        fadeOut(node: cc.Node,delayTime: number,callback?: Function)
        /**到指定透明度 */
        fadeTo(node: cc.Node,delayTime: number,opacity: number,callback?: Function);
        /**贝塞尔曲线移动 */
        bezierTo(node,delayTime,nodes,callback);
        /**按路径移动 */
        catmullRomTo(node,delayTime,nodes,callback);
        /**翻转 */
        flipX(node,bool,callback);
        /** 移动*/
        moveTo(node: cc.Node,delayTime: number,x: number,y: number,callback?: Function)
        /**移动指定距离 */
        moveBy(node: cc.Node,delayTime: number,x: number,y: number,callback?: Function)
        /**匀速移动 speed 建议2-5*/
        moveToBy(moveNode: cc.Node,speed: number,x: number,y: number,callback?: Function)
        /**按路径匀速移动 */
        movePath(moveNode: cc.Node,speed: number,pathArr: Array<cc.Node>,callback?: Function)
        /** 缩放*/
        scaleTo(node: cc.Node,delayTime: number,sx,sy,callback?: Function)
        /** 旋转*/
        rotateTo(node: cc.Node,delayTime: number,dstAngle,callback?: Function)
        /** 震动*/
        shake(node: cc.Node,duration: number,callback?: Function);
        /**跳跃到目标位置 */
        jumpTo(node: cc.Node,duration: number,pos: cc.Vec2,h: number,jumps: number,callback?: Function);
        /**跳跃到指定距离 */
        jumpBy(node: cc.Node,duration: number,x: number,y: number,h: number,jumps: number,callback?: Function);
        /**
         * 递归移动
         * @param {cc.Node} moveNode 要移动的节点
         * @param {cc.Node} target 目标节点 用于移动到目标位置
         * @param {number} xOffset 目标x偏移
         * @param {number} yOffset 目标y偏移
         * @param {number} speed 速度 越小越快 推荐10
         * @param {number} steepScale 步长 越大越快 推荐50
         * @param {number} rangeOffset 目标偏移 大概移动到的目标位置就停止
         * @param {boolean} orien 方向
         * @param {Function} [callback] 回调函数
         */
        moveByTo(moveNode: cc.Node,target: cc.Node,xOffset: number,yOffset: number,speed: number,steepScale: number,rangeOffset: number,orien: boolean,callback?: Function)
    }
    interface IDragons
    {
        /**
         * 设置插槽
         * @param {cc.Node} node 龙骨节点
         * @param {string} slotName 插槽名 找动画要
         * @param {number} index 要显示的
         * @memberof IDragons
         */
        setSlot(node: cc.Node,slotName: string,index: number)
        /**
         * 获取指定名称的插槽
         * @param {cc.Node} 带龙骨组件的节点
         * @param {string} slotName 插槽名 找动画要
         */
        getSlot(node: cc.Node,slotName: string): dragonBones.Slot
        /**
         * 播放龙骨动画,不需要循环回调的
         * @param node 龙骨节点
         * @param name 动画名
         * @param playNum 播放次数
         * @param complete
         */
        playAnimation(node: cc.Node,name,playNum: number,complete?: Function)
        /**
         * 播放带循环回调的动画
         * @param node
         * @param name
         * @param playNum
         * @param loopCallback
         * @param complete
         */
        playAnimationLoopCallback(node,name,playNum,loopCallback,complete)
        /**
         * 显示节点所有动画名称
         * @param node 带骨骼的节点或者子节点包含骨骼的节点
         * @param name 可选参数 填写默认为Armature
         */
        showAllAnimation(node: cc.Node,ArmatureName?: string);
        /**获取节点上的Arm */
        getArm(node: cc.Node): dragonBones.Armature;
        getBone(node: cc.Node,name: string): dragonBones.Bone;
    }
    interface ISoundMgr
    {
        // /**
        //  * @param  fileName 文件名
        //  * @param  callback 只传两个参数第二个可以是回调函数 或者 bool 是否播完语音开启操作功能;
        //  * @param  isEnable 传true可以在这条语音播放完成后开启操作权限
        //  * @memberof soundMgr 最常用的播放声音 三个参数 两种重载
        //  */
        // playSoundEffectByName(fileName: any,callback?: Function | boolean,isEnable?: boolean);
        // playTipsSound(fileName: any,callback?: Function);
        // playSoundEffectByName(fileName: any,callback?: Function,isEnable?: boolean);
        // playBackgroundMusic(fileName,callback?: Function);
        // stopBackgroundMusic();
        /*** 播放声音 会打断 */
        playSound(fileName: string | number,callback?: Function);
        /*** 停止声音播放，只是表面停止了，实际是声音降低为0，因为声音真的停止，会影响绑定的事件调用*/
        stopSound(fileName);
        /*** 判断是否有语音正在播放 */
        isSoundPlaying()
        /**
         * 播放音效（循环音效)  不会打断
         * @param fileName 
         * @param param1 * 1、传入bool值，表示是否循环
         * 2、传入方法，表示单次播放需要回调
         * 3、什么都不传，表示播放一次并且不需要回调方法
         */
        playEffect(fileName,param1?: boolean | Function);
        /**
        * 停止播放循环音效
        * @param fileName 文件名
        */
        stopEffect(fileName: string)
    }
    interface ILevelMgr
    {
        curLevel;
        preLevelNode;
        curLevelNode;
        curLevelData;
        // loadLevel(levelPath: string,callback?: Function);
        /**
        * 传入去下一关卡的时候传入当前关卡用于清理
        * @param node 当前level节点
        */
        goToNextLevel(node: cc.Node);
        goToNextLevelNoChange(node: cc.Node);
        switchQuestion(node: cc.Node,index: number): cc.Node;
        loadLevel(str: string,callback: Function);
        // JuanzhouGuochang(node);
    }
    interface IClickCellNode
    {
        clickEnable: boolean;
    }
    interface IClickEvent
    {
        target: cc.Node;
        name: string;
    }
    interface ITipsMgr
    {
        /**提示已经操作成功过*/
        tipsSuccess(id)
        /** 尝试操作，小手立即消失，但是过了指定时间，再次显示*/
        tryTouch(id)
        /** 重置计时器 */
        resetTipsTime(id)
        /**重置提示*/
        resetTips(id)
        /**开始定时*/
        startTips(id)
        /**立即显示小手动画*/
        immediatelyTips(id)
        /**移除提示*/
        removeTips(id)
        /**
         * 开启点击提示
         * @param id  提示Id
         * @param duration 提示时间
         * @param sound 点击提示声音
         * @param position 初始位置
         */
        createClickTips(id,duration,sound)
        /**
         * 开启拖拽提示
         * @param id
         * @param duration
         * @param sound
         * @param position
         * @param targetNode 拖拽目标
         */
        createDragTips(id,duration,sound)
        /**
         * 开启长按提示
         * @param id
         * @param duration
         * @param sound
         * @param position
         */
        createPressTips(id,duration,sound)
        /**更新提示初始位置*/
        setPosition(id,position)
        /**新目标位置，仅仅拖拽提示有效*/
        setDragTarget(id,targetNode)
    }
    interface IDragNode
    {
        groupId: string;
        cellId: string;
        shakeEnable: boolean;
        index: number;
        isMoveEnable: boolean;
        getOrginpos: cc.Vec2;
        onDragStart(point);
        onDragMove(point);
        onDragEnd(containers);
    }
}

//#region module
declare module "nodeMgr"
{
    const nodeMgr: yaoye.INodeMgr;
}
declare module "actions"
{
    const actions: yaoye.IActions;
}
declare module "dragons"
{
    const dragons: yaoye.IDragons;
}
declare module "soundMgr"
{
    const soundMgr: yaoye.ISoundMgr;
}
declare module "levelMgr"
{
    const levelMgr: yaoye.ILevelMgr;
}
//#endregion