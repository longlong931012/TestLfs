// var eventsMgr = require('eventsMgr');
var soundMgr = require("soundMgr");
cc.Class({
    extends: cc.Component,

    properties: {
        isEnableTestImg: { displayName: "测试图片", tooltip: "开启选项,截图后将显示在canvas下显示", default: false, },
    },
    onLoad() {
        let self = this;
        this.cameraNode = null;
        cc.game.on("screenshots", self.screenshots, self);
        this.AnimNode = this.node.children[0];
        this.gameNode = cc.find("Canvas/game");
    },
    onDestroy() {
        cc.game.off("screenshots", this.screenshots, this);
    },
    screenshots() {
        console.log("收到消息 开始截图");
        let str = this._getImgUrl();
        this.node.children[0].active = true;
        this.scheduleOnce(() => {
            this._upLoad(str)
            this.node.children[0].active = false;
        }, 2)
    },
    _upLoad(str) {
        if (window.xiaobuJs)
        {
            cc.log('支持小步游戏Api');
            console.log("开始上传");
            window.success = function () {
                console.log("上传成功");
                soundMgr.playEffect("Common/tongyong_congratulations");
                cc.game.emit("game_over");
                // this.node.parent.active = false;
                cc.find("Canvas/game").active = false;
            }
            window.xiaobuJs.uploadMindMap(str, "success");
        } else
        {
            cc.log('不支持小步游戏Api');
            console.log("上传失败,直接结算");
            soundMgr.playEffect("Common/tongyong_congratulations");
            cc.game.emit("game_over");
            // this.node.parent.active = false;
            cc.find("Canvas/game").active = false;
        }
    },
    _getImgUrl() {
        if (this.cameraNode == null)
        {
            this.cameraNode = new cc.Node();
        }
        this.cameraNode.name = "Camera"
        this.cameraNode.parent = cc.Canvas.instance.node;

        let camera = this.cameraNode.addComponent(cc.Camera);
        camera.depth = 0;

        let texture = new cc.RenderTexture();
        texture.initWithSize(cc.visibleRect.width, cc.visibleRect.height);
        camera.targetTexture = texture;
        this.texture = texture;
        let width = this.texture.width;
        let height = this.texture.height;
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        cc.game.emit("showNode");
        camera.render();
        cc.game.emit("hideNode");
        let data = texture.readPixels();
        let rowBytes = width * 4;
        for (let row = 0; row < height; row++)
        {
            let srow = height - 1 - row;
            let imageData = ctx.createImageData(width, 1);
            let start = srow * width * 4;
            for (let i = 0; i < rowBytes; i++)
            {
                imageData.data[i] = data[start + i];
            }
            ctx.putImageData(imageData, 0, row);
        }
        // 获取图片数据
        var dataURL = canvas.toDataURL("image/png");
        if (this.isEnableTestImg == true)
        {
            this.testImg(dataURL);
        }
        let str = dataURL.substring(22)
        // console.log("img 字符串   ", str)
        return str;
    },
    /**测试图片 */
    testImg(dataURL) {
        // this.upLoadUrl(dataURL);
        var img = document.createElement("img");
        img.src = dataURL;
        let texture = new cc.Texture2D();
        texture.initWithElement(img);
        let spriteFrame = new cc.SpriteFrame();
        spriteFrame.setTexture(texture);
        let spNode = new cc.Node();
        let sprite = spNode.addComponent(cc.Sprite);
        sprite.spriteFrame = spriteFrame;
        spNode.zIndex = cc.macro.MAX_ZINDEX;
        spNode.parent = cc.Canvas.instance.node;
        spNode.runAction(cc.moveTo(1.5, 200, 0));
        spNode.runAction(cc.scaleTo(1.5, 0.5, 0.5))
    }
});