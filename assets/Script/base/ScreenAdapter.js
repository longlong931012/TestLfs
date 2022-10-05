const PAD_SCREET_RATIO = 4/3;
cc.Class({
    extends: cc.Component,

    properties: {
        isAdapterDesign:{
            default:true,
            tooltip:'是否自动适配新的设计分辨率',
        },
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        let canvas = this.node.getComponent(cc.Canvas);
        let winSize = cc.winSize;
        if (winSize.width/winSize.height <= PAD_SCREET_RATIO){//比较方的屏幕都认为是pad
            if (this.isAdapterDesign){
                canvas.designResolution = cc.size(1334,750/PAD_SCREET_RATIO);
                canvas.fitWidth = true;
                canvas.fitHeight = false;
            }else{
                canvas.fitWidth = true;
                canvas.fitHeight = true;
            }
        }
    },

    start () {

    },

    // update (dt) {},
});
