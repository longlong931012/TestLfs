var HashMap = require('HashMap')
var levelsCfg = function () {
    this.dataMap = new HashMap();
}
var pro = levelsCfg.prototype;
pro.initWithData = function (data) {
    for (var i = 0; i < data.length; i++) {
        var itemTmp = data[i];
        var item = createlevels(itemTmp);
        this.dataMap.put(item.id, item)
    }
}
pro.getlevelsWithId = function (dataId) {
    if (this.dataMap.hasKey(dataId)) {
        return this.dataMap.get(dataId)
    }
}
pro.haslevels = function (dataId) {
    return this.dataMap.hasKey(dataId)
}
var createlevels = function (item) {
    var obj = {}
    obj.id = item.id;
    obj.pass = item.pass;
    obj.passValue = item.passValue;
    obj.passEvent = item.passEvent;
    obj.res = item.res;
    obj.onStart = item.onStart;
    obj.onEnd = item.onEnd;
    return obj
}
module.exports = new levelsCfg();
