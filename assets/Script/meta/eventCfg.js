var HashMap = require('HashMap')
var eventCfg = function () { 
    this.dataMap = new HashMap();
}
var pro = eventCfg.prototype;
pro.initWithData = function(data){
    for (var i=0;i<data.length;i++){
        var itemTmp = data[i];
        var item = createevent(itemTmp);
        this.dataMap.put(item.id,item)
    }
}
pro.geteventWithId = function(dataId){
    if(this.dataMap.hasKey(dataId)){
        return this.dataMap.get(dataId)
    }
}
pro.hasevent = function(dataId){
    return this.dataMap.hasKey(dataId)
}
var createevent = function(item){
    var obj = {}
    obj.id = item.id;
    obj.type = item.type;
    obj.target = item.target;
    obj.next = item.next;
    obj.act = item.act;
    obj.param1 = item.param1;
    obj.param2 = item.param2;
    obj.param3 = item.param3;
    obj.param4 = item.param4;
    obj.param5 = item.param5;
    obj.param6 = item.param6;
    obj.param7 = item.param7;
    obj.param8 = item.param8;
    obj.param9 = item.param9;
    obj.param10 = item.param10;
    return obj
}
module.exports = new eventCfg();
