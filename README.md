#jQuery Fullscreen

@author Darcy Clarke (http://darcyclarke.me)
@version 1.0
 
##Adds: 
 
- `$.support.fullscreen` (boolean)
- `fullscreen` pseudo selector & filter (.is .find .filter)

```javascript
$(el).on("fullscreenchange", fn)
```
```javascript
$(el).trigger("requestFullScreen", fn) or $(el).requestFullScreen(fn)
```
```javascript
$(el).trigger("cancelFullScreen", fn) or $(el).cancelFullScreen(fn)
```

##Uses
 
- `:-webkit-full-screen` and `:-moz-fullscreen` (no fallbacks)
- webkit/moz fullscreenchange
- webkit/moz Cancel/Request FullScreen 
- W3C fullscreenchange 
- W3C Exit/Request FullScreen 
 
##Fallbacks
 
- Utilizes fullscreen popups with load/unload events to mimic Cancel/Request Fullscreen events
- Trigger fullscreenchange on load/unload events
- To note: You must turn on fallback support 
 
##Examples

```javascript
$.extend({ $.fullscreen.settings, { fallback : true, window_url : 'http://google.com' });
```

```javascript
$('video').on('click', function(e){
	e.preventDefault();
	this.pause();
	$(this).requestFullScreen(function(){
		this.play();	
	});
});
```

```javascript
$('.close').on('click', function(e){
	e.preventDefault();
	var video = $('video:fullscreen');
	video[0].pause();
	video.cancelFullScreen(function(){
		this.play();
	});
});
```

##License

Copyright (c) 2012 Darcy Clarke <darcy@darcyclarke.me>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 