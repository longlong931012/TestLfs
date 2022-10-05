var Actions = function () {

}
var pro = Actions.prototype;

pro.delayTime = function (node, delayTime, callback) {
    if (node && node.active)
    {
        let delay = cc.delayTime(delayTime);
        let callFun = cc.callFunc(function () {
            if (!!callback)
            {
                callback();
            }
        })
        let action = cc.sequence(delay, callFun);
        node.runAction(action);
        return action;
    }
}
pro.jumpTo = function (node, delayTime, pos, h, jumps, callback) {
    if (node && node.active)
    {
        let jump = cc.jumpTo(delayTime, pos, h, jumps);
        let callFun = cc.callFunc(function () {
            if (callback)
            {
                callback();
            }
        })
        let action = cc.sequence(jump, callFun);
        node.runAction(action);
        return action;
    }
}
pro.fadeTo = function (node, delayTime, opacity, callback) {
    if (node && node.active)
    {
        let fadeTo = cc.fadeTo(delayTime, opacity);
        let callFun = cc.callFunc(function () {
            if (!!callback)
            {
                callback();
            }
        })
        let action = cc.sequence(fadeTo, callFun);
        node.runAction(action);
        return action;
    }
}
pro.fadeIn = function (node, delayTime, callback) {
    if (node && node.active)
    {
        let fadein = cc.fadeIn(delayTime);
        let callFun = cc.callFunc(function () {
            if (!!callback)
            {
                callback();
            }
        })
        let action = cc.sequence(fadein, callFun);
        node.runAction(action);
        return action;
    }
}
pro.fadeOut = function (node, delayTime, callback) {
    if (node && node.active)
    {
        let fadeout = cc.fadeOut(delayTime);
        let callFun = cc.callFunc(function () {
            if (!!callback)
            {
                callback();
            }
        })
        let action = cc.sequence(fadeout, callFun);
        node.runAction(action);
        return action;
    }
}
pro.bezierTo = function (node, delayTime, nodes, callback) {
    if (node && node.active)
    {
        let bezierTo = cc.bezierTo(delayTime, nodes);
        let callFun = cc.callFunc(function () {
            if (!!callback)
            {
                callback();
            }
        })
        let action = cc.sequence(bezierTo, callFun);
        node.runAction(action);
        return action;
    }
}
pro.catmullRomTo = function (node, delayTime, nodes, callback) {
    if (node && node.active)
    {
        let ac = cc.catmullRomTo(delayTime, nodes);
        let callFun = cc.callFunc(function () {
            if (!!callback)
            {
                callback();
            }
        })
        let action = cc.sequence(ac, callFun);
        node.runAction(action);
        return action;
    }
}
pro.flipX = function (node, bool, callback) {
    if (node && node.active)
    {
        let flipX = cc.flipX(bool);
        let callFun = cc.callFunc(() => { if (!!callback) { callback() } });
        let action = cc.sequence(flipX, callFun);
        node.runAction(action);
        return action;
    }
}
pro.moveTo = function (node, delayTime, x, y, callback) {
    if (node && node.active)
    {
        let moveTo = cc.moveTo(delayTime, x, y);
        let callFun = cc.callFunc(function () {
            if (!!callback)
            {
                callback();
            }
        })
        let action = cc.sequence(moveTo, callFun);
        node.runAction(action);
        return action;
    }
}
pro.moveBy = function (node, delayTime, x, y, callback) {
    if (node && node.active)
    {
        let moveBy = cc.moveBy(delayTime, x, y);
        let callFun = cc.callFunc(function () {
            if (!!callback)
            {
                callback();
            }
        })
        let action = cc.sequence(moveBy, callFun);
        node.runAction(action);
        return action;
    }
}
pro.moveToBy = (moveNode, speed, x, y, callback) => {
    let nor = moveNode.getPosition().sub(cc.v2(x, y)).normalize();
    // 每一步移动的最大值
    let maxRange;
    if (Math.abs(nor.x) > Math.abs(nor.y))
        maxRange = Math.abs(nor.x * speed);
    else
        maxRange = Math.abs(nor.y * speed);
    // 下一步移动的坐标
    let nextStepPos = cc.v2(moveNode.x - nor.x * speed, moveNode.y - nor.y * speed);
    moveNode.setPosition(nextStepPos);
    if (moveNode.getPosition().fuzzyEquals(cc.v2(x, y), maxRange))
    {
        if (callback) callback();
    } else
    {
        setTimeout(() => { pro.moveToBy(moveNode, speed, x, y, callback) }, 0.1);
    }
}
pro.movePath = (moveNode, speed, pathArr, callback) => {
    let arr = new Array().concat(pathArr)
    let move = () => {
        if (arr.length > 0)
        {
            let node = arr.shift();
            pro.moveToBy(moveNode, speed, node.x, node.y, () => { move(); })
        } else
        {
            if (callback) callback();
        }
    }
    move();
}
pro.scaleTo = function (node, delayTime, sx, sy, callback) {
    if (node && node.active)
    {
        let scaleTo = cc.scaleTo(delayTime, sx, sy);
        let callFun = cc.callFunc(function () {
            if (!!callback)
            {
                callback();
            }
        })
        let action = cc.sequence(scaleTo, callFun);
        node.runAction(action);
        return action;
    }
}
pro.rotateTo = function (node, delayTime, dstAngle, callback) {
    if (node && node.active)
    {
        let rotateTo = cc.rotateTo(delayTime, dstAngle);
        let callFun = cc.callFunc(function () {
            if (!!callback)
            {
                callback();
            }
        })
        let action = cc.sequence(rotateTo, callFun);
        node.runAction(action);
        return action;
    }
}
pro.shake = function (node, duration, callback) {
    let x = node.x;
    let y = node.y;
    if (node)
    {
        node.active = true;
        node.runAction(
            cc.repeatForever(
                cc.sequence(
                    cc.moveTo(0.02, cc.v2(x + 5, y + 7)),
                    cc.moveTo(0.02, cc.v2(x - 6, y + 7)),
                    cc.moveTo(0.02, cc.v2(x - 13, y + 3)),
                    cc.moveTo(0.02, cc.v2(x + 3, y - 6)),
                    cc.moveTo(0.02, cc.v2(x - 5, y + 5)),
                    cc.moveTo(0.02, cc.v2(x + 2, y - 8)),
                    cc.moveTo(0.02, cc.v2(x - 8, y - 10)),
                    cc.moveTo(0.02, cc.v2(x + 3, y + 10)),
                    cc.moveTo(0.02, cc.v2(x, y))
                )
            )
        );
        setTimeout(() => {
            node.stopAllActions();
            node.setPosition(x, y);
            if (callback)
            {
                callback();
            }
        }, 0.35 * 1000);
    }
}

pro.actions = new Actions();
module.exports = pro.actions;