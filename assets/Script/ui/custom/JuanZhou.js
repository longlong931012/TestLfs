cc.Class({
    extends: cc.Component,
    properties: {
        mask: cc.Node,
        ganzi1: cc.Node,
        ganzi2: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.mask.width = -1;
        this.ganzi1.x = 0;
        this.ganzi2.x = 0;
    },
    onEnable() {
        this.playAction();
        this.scheduleOnce(() => {
            this.node.active = false;
        }, 1.8);
    },
    onDisable() {
        this.mask.width = -1;
        this.ganzi1.x = 0;
        this.ganzi2.x = 0;
    },
    playAction() {
        this.mask.width = 0;
    },
    update(dt) {
        if (this.mask.width < cc.winSize.width && this.mask.width >= 0)
        {
            this.mask.width += 25; // 卷轴的滚动速率
            if (this.ganzi1.x < cc.winSize.width / 2)
            {   // 587 为 1334 / 2 - 80
                this.ganzi1.x += 12.5; // 杆子的滚动速率，必须为卷轴的速率的一半
            }
            if (this.ganzi2.x > -cc.winSize.width / 2)
            {
                this.ganzi2.x -= 12.5; // 杆子的滚动速率，必须为卷轴的速率的一半
            }
        }
    }
});
