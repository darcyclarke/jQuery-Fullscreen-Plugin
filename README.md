# jQuery Fullscreen

### Adds: 
 
- `$.support.fullscreen` (boolean)
- `fullscreen` pseudo selector & filter (.is .find .filter)

```js
$(el).on('fullscreenchange', fn)
$(el).trigger('requestFullScreen', fn) // or $(el).requestFullScreen(fn)
$(el).trigger('cancelFullScreen', fn) // or $(el).cancelFullScreen(fn)
```

### Uses
 
- `:-webkit-full-screen` and `:-moz-fullscreen` (no fallbacks)
- webkit/moz fullscreenchange
- webkit/moz Cancel/Request FullScreen 
- W3C fullscreenchange 
- W3C Exit/Request FullScreen 
 
### Fallbacks
 
- Utilizes fullscreen popups with load/unload events to mimic Cancel/Request Fullscreen events
- Trigger fullscreenchange on load/unload events
- To note: You must turn on fallback support 
 
### Examples

```js
$.extend($.fullscreen.settings, { fallback: true, window_url: 'http://google.com' })
$('video').on('click', function(e) {
  e.preventDefault()
  this.pause()
  $(this).requestFullScreen(function() {
    this.play()
  })
})
$('.close').on('click', function(e) {
  e.preventDefault()
  var video = $('video:fullscreen')
    video[0].pause()
    video.cancelFullScreen(function() {
      this.play()
  })
})
```
