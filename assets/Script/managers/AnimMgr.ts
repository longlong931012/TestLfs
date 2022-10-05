class AnimMgr
{
    public play(node: cc.Node,animName,callback?)
    {
        let anim = node.getComponent(cc.Animation);
        let animState = anim.getAnimationState(animName);
        anim.play(animName)
        if (callback)
        {
            anim.once(cc.Animation.EventType.FINISHED,callback,this)
        }
        return anim;
    }
    public pause(node: cc.Node,animName)
    {
        let anim = node.getComponent(cc.Animation);
        anim.pause(animName);
        return anim;
    }
    public stop(node: cc.Node,animName)
    {
        let anim = node.getComponent(cc.Animation);
        anim.stop(animName);
        return anim;
    }
    public resume(node: cc.Node,animName)
    {
        let anim = node.getComponent(cc.Animation);
        anim.resume(animName);
        return anim;
    }
}
export default new AnimMgr();