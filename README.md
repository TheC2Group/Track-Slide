Track Slide
===========

> Constructor to slide multiple objects on a track rather than individually.


To get started
--------------

### CommonJS

```
$ npm install track-slide
```

```js
var TrackSlide = require('track-slide');
```

### Browser Global

```html
<script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
<script src="TheC2Group/event-handler.js"></script>
<script src="cuth/dist/jquery.dragger.js"></script>
<script src="iife/track-slide.js"></script>
```


Example
-------

```html
<div class="TrackSlide">
    <ul>
        <li>...
        ...
    </ul>
</div>
```

```js
// This wouldn't be necessary since all these options are the defaults
var options = {
    pageLock: false,
    trackSelector: 'ul',
    cellSelector: 'li',
    autoResize: 'true',
    animationDuration: 400,
    useTransform: false,
    allowEmptySpace: false
};

var slider = new TrackSlide('.TrackSlide', options);

// Change the slider to a specifig index
slider.slideTo(1);

// Remeasure the slider
slider.resize();

// Move to the previous slide
slider.previous();

// Move to the next slide
slider.next();

// Move to the previous page of slides
slider.previousPage();

// Move to the next page of slides
slider.nextPage();
```

Events
------

### slideTo

```js
slider.on('slideTo', function (index) {
    console.log('Slider moved to ' + index);
});

// slider.off('slideTo');
```

### hasDragged

### resize

```js
slider.on('resize', function (measurements) {
    console.log(slider.len - measurements.fit); // amount not showing
});
```


Test
----
Start a local server in the base directory.
Example
```
http-server
```
Navigate to localhost:8080/test/

Lint the JavaScript:
```
jshint track-slide.js
```


License
-------

MIT © [The C2 Group](https://c2experience.com)
