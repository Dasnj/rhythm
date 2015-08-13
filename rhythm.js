(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    // $.fn.extend
    // $.fn.jqueryPlugin = function(){};

    // paging
    $.fn.paging = function(options){
        var opts = $.extend({}, $.fn.paging.defaults, options);
        return this.each(function(){
            $.fn.paging.html($(this), opts);
            $.fn.paging.events($(this), opts);
        });
    };
    $.fn.paging.html = function(obj, opts){
        obj.empty();
        if(opts.current > 1){
            obj.append('<a href="javascript:;" class="paging-prev">上一页</a>');
        }else{
            obj.remove('.paging-prev').append('<span class="paging-disabled">上一页</span>');
        }
        if(opts.pagenum){
            if(opts.current != 1 && opts.current >= 4 && opts.pages != 4){
                obj.append('<a href="javascript:;" class="paging-a">' + 1 + '</a>');
            }
            if(opts.current - 2 > 2 && opts.current <= opts.pages && opts.pages > 5){
                obj.append('<span class="paging-none">...</span>');
            }
            var start = opts.current - 2, end = opts.current + 2;
            if((start > 1 && opts.current < 4) || opts.current == 1){
                end++;
            }
            if(opts.current > opts.pages - 4 && opts.current >= opts.pages){
                start--;
            }
            for(start; start <= end; start++){
                if(start <= opts.pages && start >= 1){
                    if(start != opts.current){
                        obj.append('<a href="javascript:;" class="paging-a">' + start + '</a>');
                    }else{
                        obj.append('<span class="paging-current">' + start + '</span>');
                    }
                }
            }
            if(opts.current + 2 < opts.pages - 1 && opts.current >= 1 && opts.pages > 5){
                obj.append('<span class="paging-none">...</span>');
            }
            if(opts.current != opts.pages && opts.current < opts.pages - 2 && opts.pages != 4){
                obj.append('<a href="javascript:;" class="paging-a">' + opts.pages + '</a>');
            }
        }
        if(opts.current < opts.pages){
            obj.append('<a href="javascript:;" class="paging-next">下一页</a>');
        }else{
            obj.remove('.paging-next').append('<span class="paging-disabled">下一页</span>');
        }
    };
    $.fn.paging.events = function(obj, opts){
        obj.on('click', '.paging-a', function(){
            var current = parseInt($(this).text());
            $.fn.paging.html(obj, $.extend(opts, {'current': current}));
            if(typeof opts.callback == 'function'){
                opts.callback(obj, current);
            }
        });
        obj.on('click', 'a.paging-prev', function(){
            var current = parseInt(obj.children("span.paging-current").text());
            $.fn.paging.html(obj, $.extend(opts, {'current': current - 1}));
            if(typeof opts.callback == 'function'){
                opts.callback(obj, current - 1);
            }
        });
        obj.on('click', 'a.paging-prev', function(){
            var current = parseInt(obj.children("span.paging-current").text());
            $.fn.paging.html(obj, $.extend(opts, {'current': current + 1}));
            if(typeof opts.callback == 'function'){
                opts.callback(obj, current + 1);
            }
        });
        if(opts.callbackload){
            var current = parseInt(obj.children("span.paging-current").text());
            opts.callback(obj, current);
        }
    };
    $.fn.paging.defaults = {
        pages: 10,
        current: 1,
        pagenum: true,
        callbackload: false,
        callback: function(){}
    };

    // $.extend
    // $.jqueryPlugin = function(){};

}));
