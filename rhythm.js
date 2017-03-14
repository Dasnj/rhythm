(function(window, document, undefined){

    'use strict';

    var rJS, rJSON, rQ, Rhythm, ry, tagPrefix = 'ry';

    // 定义事件发射器
    var RhythmEvent = function(){};
    RhythmEvent.prototype.constructor = RhythmEvent;

    Rhythm = function(){};
    // Rhythm 继承 RhythmEvent
    Rhythm.prototype = Object.create(RhythmEvent.prototype);
    Rhythm.prototype.constructor = Rhythm;

    // 内置JS方法
    rJS = {};

    // JSON
    rJSON = {};

    // 类似jQuery的DOM操作
    var rQuery = function(){};

    ry = new Rhythm();
    rQ = new rQuery();
    ry.rQ = rQ;

    var eventDOMChange = function(){};
    var eventInputChange = function(e){};


    // 定义侦听事件目录
    var setEventListener = function(){
        rQ.dom('body').on('DOMSubtreeModified', eventDOMChange);
        rQ.dom('[' + tagPrefix + '-data]').on('input change', eventInputChange);
    };

    // 设定初始化并于HTML加载完成后执行
    var eventInit = function(){
        setEventListener(); // 全局侦听
        // ry.restore(); // 本地存储恢复数据
        // ry.setDefaults(); // 设置默认值
        // ry.registerDependencies(); // 寄存器依赖关系
        // ry.updateDependencies(); // 更新依赖关系
    };

    rQ.ready(eventInit);

    window.ry = ry;

    return ry;

}(window, document));
