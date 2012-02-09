#jQuery Fullscreen

@author Darcy Clarke (http://darcyclarke.me)
@version 1.0
 
Copyright (c) 2012 Darcy Clarke
Dual licensed under the MIT and GPL licenses.
 
##ADDS: 
 
- $.support.fullscreen (boolean)
- :fullscreen pseudo selector & filter (.is .find .filter)

- $(el).on("fullscreenchange", fn)
- $(el).trigger("RequestFullScreen", fn) or $(el).RequestFullScreen(fn)
- $(el).trigger("CancelFullScreen", fn) or $(el).CancelFullScreen(fn)

##USES
 
- :-webkit-full-screen and :-moz-fullscreen (no fallbacks)
- webkit/moz fullscreenchange
- webkit/moz Cancel/Request FullScreen 
- W3C fullscreenchange 
- W3C Exit/Request FullScreen 
 
##FALLBACKS
 
- Utilizes fullscreen popups with load/unload events to mimic Cancel/Request Fullscreen events
- Trigger fullscreenchange on load/unload events
- To note: You must turn on fallback support 
 
Example: 
$.extend({ $.fullscreen.settings, { fallback : true, window_url : 'http://google.com' }); 