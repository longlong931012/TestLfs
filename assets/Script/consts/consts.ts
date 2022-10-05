const consts = {
    EVENTS: {
        PLAY_MUSIC: 2001,//播放背景音乐
        PLAY_SOUND: 2002,//播放声音

        DRAG_START: "10000",//开始拖拽
        DRAG_SUCCESS: "10001",//拖拽成功
        DRAG_FAIL: "10002",//拖拽失败,没有拖拽到目标节点
        DRAG_WRONG: "10003",//拖拽错误，把错误的节点拖拽

        CLICK: "10010",//点击事件
    },
    /**拖拽组 其实没什么卵用可以自己设置 */
    CellGroups: cc.Enum({
        DG_Def: 'drag_group_default',
        DG_01: 'drag_group_01',
        DG_02: 'drag_group_02',
        DG_03: 'drag_group_03',
    }),
    /**碰撞组 */
    COLLISION_STATE: {
        IDLE: 0,//不在碰撞状态
        STAY: 1,//碰撞中
    },
}
export const enum JIETU
{
    screenshots = "screenshots",
}
export const enum TOUCH
{
    START = "Touch_start",
    END = "Touch_end",
    DISABLE = "disableTouch",
    ENABLE = "enableTouch",
}
export const enum DRAG
{
    START = "drag_start",
    SUCCESS = "drag_success",
    FAIL = "drag_fail",
    WRONG = "drag_wrong",
    FILL = "drag_fill",
    PutIn = "drag_PutIn",
    PutWrong = "drag_PutWrong"
}
export const enum DRAW
{
    START = "draw_start",
    END = "draw_end",
    SUCCESS = "draw_success"
}
export default consts;