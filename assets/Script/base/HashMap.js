"use strict";
/**
 * Hash Map的简单实现
 * 详细使用方法，请参考 /util/test/HashMapTest 
 */
var HashMap = function(){  
     this.count = 0;  
     this.entry = new Object();  
};

var hmp = HashMap.prototype;
   
//设定给定key值的元素值，如果没有则新增
hmp.put = function(key, value){
	if(!this.containsKey(key)){  
		this.count++;  
	};
	this.entry[key] = value;  
};  

//获取给定key值的value
hmp.get = function(key, defaultValue){
    return this.containsKey(key) ? this.entry[key] : ((defaultValue !== undefined)?defaultValue:null);
};
       
//删除给定key值的元素并返回给定元素
hmp.remove = function(key){
	var v = null;
	if( this.containsKey(key)) {
		v = this.entry[key];
		delete this.entry[key];
		this.count --;  
	}
	return v;
};
hmp.pop = hmp.remove;

//删除给定value值的元素并返回给定元素
//可以指定删除比较的算法
hmp.removeByValue = function(value, cmpFunc){  
	var v = null;
		var isSame = false;
		var cmp = cmpFunc || function(first, second){
			return first === second;
		};
	for(var prop in this.entry){  
		if(cmp(this.entry[prop], value)){  
			v = this.entry[prop];
			delete this.entry[prop];
			this.count --;
		};
	};
	return v;
};
hmp.popByValue = hmp.removeByValue;

//

       
hmp.containsKey = function(key ){  
	return (key in this.entry);
}; 
hmp.hasKey = hmp.containsKey;
       
hmp.containsValue = function(value){  
	for(var prop in this.entry){  
		if(this.entry[prop] === value){  
			return true;  
		};  
	};
	return false;  
};
hmp.hasValue = hmp.containsValue;
       
hmp.values = function(){  
	var values = [];  
	for(var prop in this.entry){  
		values.push(this.entry[prop]);  
	};  
	return values;  
};  
       
hmp.keys = function(){  
	var keys = [];  
	for(var prop in this.entry){  
		keys.push(prop);  
	};  
	return keys;  
};  

hmp.sortKeys = function(sortBy){
	var skeys = this.keys();
	var sb = sortBy || function(f,s){
		return f<s?-1:1;
	};
	skeys.sort(sb);
	return skeys;
};
       
hmp.size = function(){  
	return this.count;  
};  
hmp.length = hmp.size;

hmp.empty = function(){
	return this.count === 0;
};
       
hmp.clear = function (){
	this.count = 0;  
	this.entry = new Object();  
};  

hmp.forEach = function(cb){
	for(var prop in this.entry){
		cb(this.entry[prop]);
	};
};
hmp.forValues = hmp.forEach;

hmp.forKeys = function(cb){
	for(var prop in this.entry){
		cb(prop);
	};
};

hmp.forItems = function(cb){
	for(var prop in this.entry){
		cb(prop, this.entry[prop]);
	};
};

hmp.all = function(cb){
	for(var prop in this.entry){
		if (!cb(this.entry[prop])){
			return false;
		};
	};
	return true;
};

hmp.any = function(cb){
	for(var prop in this.entry){
		if (cb(this.entry[prop])){
			return true;
		};
	};
	return false;
};

hmp.filter = function(cb){
	var out = [];
	for(var prop in this.entry){
		if (cb(prop, this.entry[prop])){
			out.push(this.entry[prop]);
		};
	};
	return out;
}

hmp.sum = function(func){
	var total = 0;
	for(var prop in this.entry){
		if (!func) total += this.entry[prop];
		else total += func(this.entry[prop]);
	};
	return total;
}

module.exports = HashMap;