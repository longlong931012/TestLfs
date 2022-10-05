
var eventsMgr = require('eventsMgr');
var Dragons = function () {

}
var pro = Dragons.prototype;
/**
 * 播放龙骨动画,不需要循环回调的
 * @param node 龙骨节点
 * @param name 动画名
 * @param playTime 播放次数
 * @param complete
 */
pro.playAnimation = function (node, name, playTime, complete, startFun) {
    if (node)
    {
        var ad;
        if (node.getComponent(dragonBones.ArmatureDisplay))
            ad = node.getComponent(dragonBones.ArmatureDisplay);
        else if (node.getComponent(sp.Skeleton))
            ad = node.getComponent(sp.Skeleton);
        else if (node.getComponentInChildren(dragonBones.ArmatureDisplay))
            ad = node.getComponentInChildren(dragonBones.ArmatureDisplay);
        else if (node.getComponentInChildren(sp.Skeleton))
            ad = node.getComponentInChildren(sp.Skeleton);
        if (ad instanceof dragonBones.ArmatureDisplay)
        {
            // console.log("龙骨组件");
            if (complete)
            {
                ad.once(dragonBones.EventObject.COMPLETE, () => { complete() }, this);
            }
            if (!!name && !isNaN(playTime))
            {
                ad.scheduleOnce(() => { ad.playAnimation(name, playTime) }, 0.016)
            } else
            {
                cc.log('播放龙骨动画失败:', name);
            }
        } else if (ad instanceof sp.Skeleton)
        {
            // console.log("Spine组件");
            if (playTime <= 0)
            {
                // TODO 一直循环的动画暂时不在这里添加回调
                ad.setAnimation(0, name, true);
            } else
            {
                ad.setAnimation(0, name, false);
                let num = 0;
                ad.setCompleteListener(() => {
                    ++num;
                    if (num == playTime - 1)
                    {
                        ad.setAnimation(0, name, false);
                    } else if (num == playTime)
                    {
                        if (complete)
                        {
                            complete();
                        }
                    }
                })
            }
        } else
        {
            console.error("没有找到任何动画组件 检查节点和子节点配置");
        }
    } else
    {
        console.error("没有找到节点");
    }
}
/**
 * 播放带循环回调的动画
 * @param node
 * @param name
 * @param playTime
 * @param loopCallback
 * @param complete
 */
pro.playAnimationLoopCallback = function (node, name, playTime, loopCallback, complete) {
    var ad = node.getComponent(dragonBones.ArmatureDisplay);
    let self = this;
    if (!!ad)
    {
        if (!!name && !isNaN(playTime))
        {
            ad.scheduleOnce(function () {
                if (!!loopCallback)
                {
                    ad._loopCallback = function () {
                        loopCallback();
                    };
                    ad.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, ad._loopCallback, self);
                } else
                {
                    ad.removeEventListener(dragonBones.EventObject.LOOP_COMPLETE, ad._loopCallback, self);
                }
                ad.once(dragonBones.EventObject.COMPLETE, function () {
                    ad.removeEventListener(dragonBones.EventObject.LOOP_COMPLETE, ad._loopCallback, self);
                    if (complete)
                    {
                        complete();
                    }
                }, this);
                ad.playAnimation(name, playTime);
            }, 0.016)
        } else
        {
            cc.log('播放龙骨动画失败:', name);
        }
    } else
    {
        cc.log('节点:' + node.name + '没有找到龙骨动画组件');
    }
}
pro.setSlot = function (node, slotName, index) {
    var armature = null;
    if (node.getComponent(dragonBones.ArmatureDisplay))
    {
        console.log("在此节点上找到骨骼");
        armature = node.getComponent(dragonBones.ArmatureDisplay).armature();
    } else if (node.getComponentInChildren(dragonBones.ArmatureDisplay))
    {
        armature = node.getComponentInChildren(dragonBones.ArmatureDisplay).armature();
        console.log("在子节点上找到骨骼");
    } else
    {
        cc.error("没有找到骨骼")
        return;
    }
    if (armature.getSlot(slotName))
    {
        let num = 0;
        armature.getSlot(slotName).rawDisplayDatas.forEach(it => {
            num++
            console.log("插槽", num, "的图片:", it.name)
        })
        armature.getSlot(slotName)._setDisplayIndex(index);
    } else
    {
        console.log("插槽查询失败");
    }
}
pro.getBone = (node, name) => {
    let arm = pro.getArm(node);
    console.log(": -----------------------");
    console.log("pro.getBone -> arm", arm);
    console.log(": -----------------------");
    return arm.getBone(name);
}
pro.getArm = (node) => {
    var armature = null;
    if (node.getComponent(dragonBones.ArmatureDisplay))
    {
        console.log("在此节点上找到骨骼");
        armature = node.getComponent(dragonBones.ArmatureDisplay).armature();
        return armature;
    } else if (node.getComponentInChildren(dragonBones.ArmatureDisplay))
    {
        armature = node.getComponentInChildren(dragonBones.ArmatureDisplay).armature();
        console.log("在子节点上找到骨骼");
        return armature;
    } else
    {
        cc.error("没有找到骨骼")
        return;
    }
}
pro.getSlot = function (node, slotName) {
    var armature;
    if (node.getComponent(dragonBones.ArmatureDisplay))
    {
        console.log("在此节点上找到骨骼");
        armature = node.getComponent(dragonBones.ArmatureDisplay).armature();
    } else if (node.getComponentInChildren(dragonBones.ArmatureDisplay))
    {
        console.log("在此子节点上找到骨骼");
        armature = node.getComponentInChildren(dragonBones.ArmatureDisplay).armature();
    } else
    {
        console.error("插槽查询失败");
        return;
    }
    if (armature.getSlot(slotName))
    {
        console.log("在此节点上找到插槽");
        return armature.getSlot(slotName);
    }
}
pro.showAllAnimation = function (node, name) {
    let ad;
    let nodeAnimName;
    if (name)
    {
        nodeAnimName = name;
    } else
    {
        nodeAnimName = "Armature";
    }
    if (node.getComponent(dragonBones.ArmatureDisplay))
    {
        ad = node.getComponent(dragonBones.ArmatureDisplay)
        ad.getAnimationNames(nodeAnimName);
    } else
    {
        ad = node.getComponentInChildren(dragonBones.ArmatureDisplay)
        ad.getAnimationNames(nodeAnimName);
    }
    console.log("---------------------------------------");
    console.log("------------dragonBones.ArmatureDisplay", ad);
    console.log("------------所有动画名", ad.getAnimationNames(nodeAnimName));
    console.log("---------------------------------------");
}
pro.dragons = new Dragons();
module.exports = pro.dragons;