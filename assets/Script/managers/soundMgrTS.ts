
class SoundMgrTS
{
    public playSound(fileName: string,callback: Function)
    {
        let filePath = "sounds/" + fileName;
        cc.audioEngine.stopMusic();
        console.log("当前播放语音");
        this._playSound(filePath,callback);
    }
    public playEffect(fileName: string,param1: Function)
    {
        var filePath = 'sounds/' + fileName;
        this._playEffect(filePath,param1);
    }
    private _playSound(pathName: string,callback: Function)
    {
        this._loadSound(pathName,(err,clip: cc.AudioClip) =>
        {
            let audioID = cc.audioEngine.playMusic(clip,false);
            cc.audioEngine.setFinishCallback(audioID,callback);
        });
    }
    private _playEffect(filePath: string,callback: Function)
    {
        this._loadSound(filePath,(err,res) =>
        {
            let audioID = cc.audioEngine.playEffect(res,false);
            cc.audioEngine.setFinishCallback(audioID,callback);
        })
    }
    private _loadSound(pathName: string,callback: Function)
    {
        cc.loader.loadRes(pathName,cc.AudioClip,(err,clip: cc.AudioClip) =>
        {
            if (!!err)
            {
                callback(err,clip);
            } else
            {
                callback(null,clip);
            }
        });
    }
}
export default new SoundMgrTS();