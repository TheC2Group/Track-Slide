Track Slide
===========

Constructor to slide multiple objects on a track rather than individually.

Dependencies
------------

* [jQuery](http://jquery.com/)
* [jquery.dragger](https://github.com/cuth/jquery.dragger)

Example
-------

```html
<div class="TrackSlide">
    <ul>
        <li>...
        ...
    </ul>
</div>

<link href="track-slide.css" rel="stylesheet">
<script src="track-slide.js"></script>
```

```js
var slider = new TrackSlide('.TrackSlide');

// Change the slider to a specifig index
slider.moveTo(1);

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
