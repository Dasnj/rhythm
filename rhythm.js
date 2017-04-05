(function(root, factory){
	if(typeof define === "function" && define.amd){
		define(factory);
	}else if(typeof exports === "object"){
		module.exports = factory();
	}else{
		root.ry = factory();
	}
}(this, function(){
	'use strict';
	var rJS, rJSON, rQ, rQuery, Rhythm, RhythmEvent, ry, tagPrefix = 'ry';

	////////////////
	// 全局方法集合 //
	////////////////

    function func(){
        //
    }

	rJS = {};

	rJSON = {};

	/////////////////
	// 简易化jQuery //
	/////////////////

	rQuery = function(){};
	rQuery.constructor = rQuery;
    rQuery.prototype.ready = function(callback){
        //
    };

	rQ = new rQuery();


	////////////////
	// 全局主体集合 //
	////////////////

	RhythmEvent = function(){};
	RhythmEvent.prototype.constructor = RhythmEvent;

	Rhythm = function(){
		this.data = {}; // 页面总数据
		this._binding = {}; // 表单中所有需要侦听的元素
		this.option = {
			persistent: false,
			timeoutInput: 50,
			timeoutDOM: 500
		};
	};
	Rhythm.prototype = Object.create(RhythmEvent.prototype);
	Rhythm.constructor = Rhythm;

	ry = new Rhythm();
	ry.rQ = rQ;


	////////////////
	// 组织全局逻辑 //
	////////////////


	var timeoutInput = null, timeoutDOM = null;
	var eventDOMChange = function(){
		//
	};
	var eventInputChange = function(){
		//
	};
	// 事件侦听列表
	var setEventListeners = function(){
		rQ.dom('body').on('DOMSubtreeModified', eventDOMChange);
		rQ.dom('[' + tagPrefix + '-data]').on('input change', eventInputChange);
	};

	var eventInit = function(){
		setEventListeners();
		ry.restore();
		ry.setDefaults();
		ry.registerDependencies();
		ry.updateDependencies();
	};

	rQ.ready(eventInit);

	return ry;
}));
