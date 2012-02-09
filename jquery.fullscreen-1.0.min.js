/**
 * jQuery Fullscreen
 *
 * @author Darcy Clarke
 * @version 1.0
 *
 * Copyright (c) 2012 Darcy Clarke
 * Dual licensed under the MIT and GPL licenses.
 *
 * ADDS: 
 *
 * - $.support.fullscreen (boolean)
 *
 * - :fullscreen pseudo selector & filter (.is .find .filter)
 *
 * - $(el).on("fullscreenchange", fn)
 * - $(el).trigger("RequestFullScreen", fn) or $(el).RequestFullScreen(fn)
 * - $(el).trigger("CancelFullScreen", fn) or $(el).CancelFullScreen(fn)
 *
 * USES:
 *
 * - :-webkit-full-screen and :-moz-fullscreen (no fallbacks)
 * 
 * - webkit/moz fullscreenchange
 * - webkit/moz Cancel/Request FullScreen 
 * - W3C fullscreenchange 
 * - W3C Exit/Request FullScreen 
 * 
 * FALLBACKS:
 *
 * - Utilizes fullscreen popups with load/unload events to mimic Cancel/Request Fullscreen events
 * - Trigger fullscreenchange on load/unload events
 * - To note: You must turn on fallback support 
 * 
 * Example: 
 * $.extend({ $.fullscreen.settings, { fallback : true, window_url : 'http://google.com' });
 *
 */

(function($){

	// Namespace
    var fs = $.fs = $.fullscreen = {};
    
    // Defaults
    fs.settings = {
        timeout : 10,
        loaded : false,
        fallback : false,
        window_handler : window,
        window_name : 'fullscreen',
        window_url : '',
        window_settings : {
            height : window.screen.height,
            width : window.screen.width,
            directories : 0,
            location : 0,
            menubar : 0,
            resizable : 0,
            status : 0,
            toolbar : 0,
            scrollbars : 0
        },
        callback : function(cb){
            if(!fs.settings.loaded){
                var el = this,
                    e = ($.support.fullscreen) ? fs.fullscreenchange : 'load unload';
                fs.settings.loaded = true;
                cb.call(el);
                setTimeout(function(){
                    $(el).on(e, function(){
                        if(fs.settings.loaded)
                            fs.settings.loaded = false;    
                    });
                }, fs.settings.timeout);   
            }
        }
    };
    
    // Dummy Element
    fs.el           = document.createElement('div');

    // Pseudo Selectors
    fs.selectors    = 'full-screen';

    // Vendor Prefixes
    fs.prefixes     = '-webkit- -moz- -o- -ms- -khtml- '.split(' ');
    fs.domPrefixes  = 'Webkit Moz O ms Khtml '.split(' '),

    // Events
    fs.events       = { 
        change  : 'fullscreenchange'.split(' '),
        request : 'requestFullScreen RequestFullScreen'.split(' '),
        cancel  : 'cancelFullScreen CancelFullScreen exitFullscreen'.split(' ')
    };

    /**
     * Checks Support for Event
     * 
     * @param {String} the name of the event
     * @param {Element Object} the element to test support against
     *
     * @return {Boolean} returns result of test (true/false)
     */
    fs.isEventSupported = function(eventName,el) {
        var supported = (eventName in el);
        if (!supported) {
            el.setAttribute(eventName, 'return;');
            supported = typeof el[eventName] == 'function';
        }
        return supported;
    };
    
    /**
     * Simple Prefix Test
     * 
     * @param {Array} an array of prefixes to be added to the stack
     * @param {Array} a stack of values to loop through
     * @param {Function} a function that tests based on the prefixed value
     *
     * @return {String/Function/Array/Object/Boolean} returns result of test if not false
     */
    fs.test = function(prefixes,stack,test){
        return (function(){
            for(i in prefixes){
                var pfx = prefixes[i].toLowerCase();
                for(x in stack){
                    var e = pfx + stack[x];
                    if(test(e))
                        return e;
                }
            }
            return false;
        })();
    }

    // Expose Support
    $.extend( $.support, {
        fullscreen: !!(function(){
            return fs.test(fs.domPrefixes, fs.events.cancel, function(e){
                return (document[e]); 
            });
        })()
    });
    
    // Check & Define Supported Events
    if($.support.fullscreen){
        
        // fullscreenchange event
        fs.fullscreenchange = fs.test(fs.domPrefixes, fs.events.change, function(e){
            return (fs.isEventSupported('on' + e, fs.el));
        });

        // RequestFullScreen event
        fs.RequestFullScreen = fs.test(fs.domPrefixes, fs.events.request, function(e){ 
            return (fs.isEventSupported(e, fs.el)); 
        });

        // CancelFullScreen event
        fs.cancelFullScreen = fs.test(fs.domPrefixes, fs.events.cancel, function(e){
            return (document[e]); 
        });

        // Expose Standard Pseudo Class
        $.extend( $.expr[':'], {
            fullscreen : function(el) {
                return $.fs.test(fs.prefixes,fs.selectors,function(selector){
                    return ($(el).is(selector));
                });
            }
        });   
    }

    // Expose Standard Event
    $.event.special.fullscreenchange = {
        setup: function() {
            var el = ($.support.fullscreen) ? this : fs.window_handler,
                e = ($.support.fullscreen) ? fs.fullscreenchange : 'load unload';
            $(el).on(e, $.event.special.fullscreenchange.handler);
        },
        teardown: function() {
            var el = ($.support.fullscreen) ? this : fs.window_handler,
                e = ($.support.fullscreen) ? fs.fullscreenchange : 'load unload';
            $(el).off(e, $.event.special.fullscreenchange.handler);
        },
        handler: function(e) {
            return true;    
        }
    };

    /**
     * Request FullScreen
     * 
     * @param {Function} the callback to be executed
     *
     * @return {jQuery Object} object that will maintain jQuery chainability/integrity
     */
    $.fn.RequestFullScreen = function(cb){
        cb = (typeof(cb) != 'function') ? function(){} : cb;
        return this.each(function(i, el){
            if(fs.settings.loaded){
                $(el).CancelFullScreen(); 
            } else {
                if($.support.fullscreen){
                    this[fs.RequestFullScreen]();
                    fs.settings.callback.apply(el,[cb]);
                } else {
                    if(fs.settings.fallback){
                        if(fs.settings.window_handler && fs.settings.window_handler != window)
                            fs.settings.window_handler.moveTo(0,0);
                        fs.window_handler = window.open(fs.settings.window_url, fs.settings.window_name, $.param(fs.settings.window_settings).replace("&",","), false);
                        fs.window_handler.onload = function(){
                            fs.settings.callback.apply(fs.window_handler,[cb]);
                        }; 
                        fs.window_handler.onreadystatechange = function(){
                            fs.settings.callback.apply(fs.window_handler,[cb]);
                        };
                        setTimeout(function(){
                            fs.settings.callback.apply(fs.window_handler,[cb]);
                        }, fs.settings.timeout);
                    }
                }
            }
        });
    };

    /**
     * Cancel FullScreen
     * 
     * @param {Function} the callback to be executed
     *
     * @return {jQuery Object} object that will maintain jQuery chainability/integrity
     */
    $.fn.CancelFullScreen = function(cb){
        cb = (typeof(cb) != 'function') ? function(){} : cb;
        fs.settings.loaded = false;
        return this.each(function(i, el){
            if($.support.fullscreen){
                document[fs.CancelFullScreen]();                
                cb();
            } else {
                $(this).trigger('fullscreenchange');
                fs.settings.window_handler.close();
                cb();   
            }
        });
    };

})(jQuery);