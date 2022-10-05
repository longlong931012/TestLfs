var EventEmitter = require('EventEmitter');
var EventsMgr = function () {
    EventEmitter.call(this);
}
var pro = EventsMgr.prototype;
pro.__proto__ = EventEmitter.prototype;

/**
 * 发出一个事件
 * @param eventId
 * @param data
 */
pro._dispatch = function(eventType,data){
    this.emit(eventType,data);
}
module.exports = new EventsMgr();

