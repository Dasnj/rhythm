'use strict';
var rJS, rJSON, rQ, rQuery, Rhythm, RhythmEvent, ry, tagPrefix = 'ry';

////////////////
// 全局方法集合 //
////////////////

function func(){
	//
}

rJS = {};
rJS.isNumber = function(obj){
	return Object.prototype.toString.call(obj) === '[object Number]';
};
rJS.isString = function(obj){
	return Object.prototype.toString.call(obj) === '[object String]';
};
rJS.isFunction = function(obj){
	return Object.prototype.toString.call(obj) === '[object Function]';
};
rJS.isObject = function(obj){
	var type = typeof obj;
	return type === 'function' || type === 'object' && !!obj;
};
rJS.has = function(obj, key){
	return obj != null && Object.prototype.hasOwnProperty.call(obj, key);
};

rJS.startEndWith = function(name, type, bool){
	if(type === ''){
		return;
	}
	if(name === null || type === null){
		return false;
	}
	name = String(name);
	type = String(type);
	bool = typeof bool === 'boolean' ? bool : true;
	if(bool){
		return name.length >= type.length && name.slice(0, type.length) === type;
	}else{
		return name.length >= type.length && name.slice(name.length - type.length, name.length) === type;
	}
};


rJS.extend = function(obj){
	if(!rJS.isObject(obj)){
		return obj;
	}
	var source, prop;
	for(var i = 1, length = arguments.length; i < length; i++){
		source = arguments[i];
		for(prop in source){
			if(Object.prototype.hasOwnProperty.call(source, prop)){
				obj[prop] = source[prop];
			}
		}
	}
	return obj;
};

rJSON = {};

/////////////////
// 简易化jQuery //
/////////////////

rQuery = function(){};
rQuery.constructor = rQuery;

rQuery.prototype.dom = function(selector, createOptions){
	var self = this, elements = [];
	if(createOptions){
		//
	}else{
		if(rJS.isString(selector)){
			elements = [].slice.call(document.querySelectorAll(selector));
		}else{
			if(rJS.isObject(selector) && selector.attributes){
				elements = [selector];
			}
		}
		self._elements = elements;
		self.length = elements.length;
		return self;
	}
};
rQuery.prototype.get = function(index, chain){
	var self = this,
		elements = self._elements || [],
		element = elements[index] || {};
	if(chain){
		self._element = element;
		return self;
	}else{
		return rJS.isNumber(index) ? element : elements;
	}
};
rQuery.prototype.find = function(selector){
	var self = this, element = self.get(0), elements = [];
	if(rJS.isString(selector)){
		elements = [].slice.call(element.querySelectorAll(selector));
	}
	self._elements = elements;
	return self;
};

rQuery.prototype.reverse = function(){
	this._elements = this._elements.reverse();
	return this;
};

rQuery.prototype.attr = function(attr, value){
	var self = this, elements = self._elements;
	for(var i in elements){
		if(value === undefined){
			return elements[i].getAttribute(attr);
		}else{
			elements[i].setAttribute(attr, value);
		}
	}
};
rQuery.prototype.removeAttr = function(attr){
	var self = this;
	for(var i in self._elements){
		self._elements[i].removeAttribute(attr);
	}
	return self;
};



rQuery.prototype.ready = function(callback){
	if(document && rJS.isFunction(document.addEventListener)){
		document.addEventListener("DOMContentLoaded", callback, false);
	}else if(window && rJS.isFunction(window.addEventListener)){
		window.addEventListener("load", callback, false);
	}else{
		document.onreadystatechange = function(){
			if(document.readyState === "complete"){
				callback();
			}
		}
	}
};

rQ = new rQuery();


////////////////
// 全局主体集合 //
////////////////

RhythmEvent = function(){};
RhythmEvent.prototype.constructor = RhythmEvent;

Rhythm = function(){
	this.data = {}; // 页面总数据
	this._bindings = {}; // 表单中所有需要侦听的元素
	this.options = {
		persistent: false,
		timeoutInput: 50,
		timeoutDOM: 500
	};
};
Rhythm.prototype = Object.create(RhythmEvent.prototype);
Rhythm.constructor = Rhythm;
Rhythm.prototype.dom = function(element){
	this._element = rQ.dom(element).get(0);
	return this;
};

// HTML获取标签
Rhythm.prototype.getOptions = function(element){
	var self = this,
		element = element || self._element,
		defaultOptions = {
			data: null,
			html: false,
			readonly: false,
			writeonly: false,
			persistent: false
		};
	return rJS.extend(defaultOptions, self.dom(element).getAttrs(tagPrefix));
};
Rhythm.prototype.setOptions = function(options, element){
	var self = this, element = self._element || element;
		for(var k in options){
			var attr = tagPrefix + "-" + k, value = options[k];
			rQ.dom(element).attr(attr, value);
		}
};
Rhythm.prototype.getAttrs = function(prefix, element){
	var self = this,
		element = element || self._element;
	var parseAttrValue = function(key, value){
		var attrTypes = {
			pick: 'array',
			omit: 'array',
			readonly: 'boolean',
			writeonly: 'boolean',
			json: 'boolean',
			html: 'boolean',
			persistent: 'boolean'
		};
		var parsers = {
			array: function(value){
				return value.split(',');
			},
			boolean: function(value){
				return value === "false" ? false : true;
			}
		};
		var defaultParser = function(){
			return value;
		};
		var valueType = attrTypes[key] || null;
		var parser = parsers[valueType] || defaultParser;
		return parser(value);
	};
	var attributes = {};
	var attrs = [].slice.call(rQ.dom(element).get(0).attributes);
	attrs.forEach(function(attr){
		var include = (prefix && rJS.startEndWith(attr.name, prefix + "-")) ? true : false;
		if(include){
			var name = (prefix) ? attr.name.slice(prefix.length + 1, attr.name.length) : attr.name;
			var value = parseAttrValue(name, attr.value);
			// if(rJS.contains(["transform", "filter"], name)){
			// 	value = value.split("|");
			// }
			attributes[name] = value;
		}
	});
	return attributes;
};

// 设置默认值
Rhythm.prototype.setDefault = function(){};
Rhythm.prototype.setDefaults = function(){};

// 本地备份与恢复
Rhythm.prototype.backup = function(){
	var self = this;
	if(!self.options.persistent){
		return;
	}
	try{
		var data = self.data || {};
		localStorage.setItem(tagPrefix, JSON.stringify(data));
	}catch(e){
		console.log("Your browser does not support localStorage.");
	}
};
Rhythm.prototype.restore = function(){
	var self = this;
	if(!self.options.persistent){
		return;
	}
	try{
		var data = localStorage.getItem(tagPrefix);
		try{
			data = JSON.parse(data);
			for(var key in data){
				self.set(key, data[key]);
			}
		}catch(e){}
	}catch(e){
		console.log("Your browser does not support localStorage.");
	}
};

// 表单初始化
Rhythm.prototype.updateForms = function(){
	var self = this,
		selector = 'form[' + tagPrefix + '-data]',
		elements = rQ.dom(selector).get();
	for(var i in elements){
		var form = elements[i],
			options = self.dom(form).getOptions(),
			formDataSelector = options.data,
			inputs = rQ.dom(form).find('[name]').reverse().get();
		rQ.dom(form).removeAttr(tagPrefix + '-data');
		for(var i in inputs){
			var input = inputs[i],
				name = rQ.dom(input).attr('name');
			if(rJS.startEndWith(name, '[]', false)){
				var array = name.split('[]')[0],
					arraySelector = '[name^="' + array + '"]',
					arrayIndex = rQ.dom(form).find(arraySelector).get().length;
				name = array;
			}
			// if(rJS.startEndWith(name, '{}', false)){
			// 	var obj = name.split('{}')[0],
			// 		objSelector = '[name^="' + obj + '"]',
			// 		objIndex = rQ.dom(form).find(objSelector).get().length;
			// 	name = obj + '.' + objIndex;
			// }
			var selector = formDataSelector + "." + name;
			options.data = selector;
			self.dom(input).setOptions(options);
			rQ.dom(input).removeAttr("name");
		}
	}
};

ry = new Rhythm();
ry.rQ = rQ;
