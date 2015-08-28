(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.TrackSlide = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var af = require("bloody-animationframe")

module.exports = function(fn){
  var id
  return function(){
    var args = arguments
    if(id != null) {
      af.cancelAnimationFrame(id)
    }
    id = af.requestAnimationFrame(function(){
      fn.apply(null, args)
      id = null
    })
  }
}

},{"bloody-animationframe":2}],2:[function(require,module,exports){
var animationFrame = {}
  , win = window
  , requestAnimationFrame =
      win.requestAnimationFrame ||
      win.webkitRequestAnimationFrame ||
      win.mozRequestAnimationFrame ||
      win.oRequestAnimationFrame ||
      win.msRequestAnimationFrame ||
      function(callback){
        return setTimeout(function(){
          callback()
        }, 1000 / 60)
      }
  , cancelAnimationFrame =
      win.cancelAnimationFrame ||
      win.webkitCancelAnimationFrame ||
      win.webkitCancelRequestAnimationFrame ||
      win.mozCancelAnimationFrame ||
      win.oCancelAnimationFrame ||
      win.msCancelAnimationFrame ||
      function(id){
        clearTimeout(id)
      }

module.exports = {
  requestAnimationFrame : function(){
    return requestAnimationFrame.apply(window, arguments)
  },
  cancelAnimationFrame : function(){
    return cancelAnimationFrame.apply(window, arguments)
  },
}

},{}],3:[function(require,module,exports){
/*!
 * Event Handler - create event emitters
 * https://github.com/TheC2Group/event-handler
 * @version 2.3.1
 * @license MIT (c) The C2 Group (c2experience.com)
 */

var eventHandler = (function () {
    'use strict';

    var on = function (event, fn) {
        if (typeof event !== 'string' || !event.length || typeof fn === 'undefined') return;

        if (event.indexOf(' ') > -1) {
            event.split(' ').forEach(function (eventName) {
                on.call(this, eventName, fn);
            }, this);
            return;
        }

        this._events = this._events || {};
        this._events[event] = this._events[event] || [];
        this._events[event].push(fn);
    };

    var off = function (event, fn) {
        if (typeof event !== 'string' || !event.length) return;

        if (event.indexOf(' ') > -1) {
            event.split(' ').forEach(function (eventName) {
                off.call(this, eventName, fn);
            }, this);
            return;
        }

        this._events = this._events || {};

        if (event in this._events === false) return;

        if (typeof fn === 'undefined') {
            delete this._events[event];
            return;
        }

        var index = this._events[event].indexOf(fn);
        if (index > -1) {
            if (this._events[event].length === 1) {
                delete this._events[event];
            } else {
                this._events[event].splice(index, 1);
            }
        }
    };

    var emit = function (event /* , args... */) {
        var args = Array.prototype.slice.call(arguments, 1);

        var lastIndex = event.lastIndexOf(':');
        if (lastIndex > -1) {
            emit.call(this, event.substring(0, lastIndex), args);
        }

        this._events = this._events || {};

        if (event in this._events === false) return;

        this._events[event].forEach(function (fn) {
            fn.apply(this, args);
        }, this);
    };

    var EventConstructor = function () {};

    var proto = EventConstructor.prototype;
    proto.on = on;
    proto.off = off;
    proto.emit = emit;

    // legacy extensions
    proto.bind = on;
    proto.unbind = off;
    proto.trigger = emit;

    var handler = function (_class) {

        // constructor
        if (arguments.length === 0) {
            return new EventConstructor();
        }

        // mixin
        if (typeof _class === 'function') {
            _class.prototype.on = on;
            _class.prototype.off = off;
            _class.prototype.emit = emit;
        }

        if (typeof _class === 'object') {
            _class.on = on;
            _class.off = off;
            _class.emit = emit;
        }

        return _class;
    };

    return handler;
}());

// export commonjs
if (typeof module !== 'undefined' && ('exports' in module)) {
    module.exports = eventHandler;
}

},{}],4:[function(require,module,exports){
/*!
 * jquery-dragger
 * https://github.com/cuth/jquery.dragger
 * @version 1.5.0
 * @license MIT (c) Jonathan Cuthbert
 */

'use strict';

var $ = jQuery || require('jquery');

var defaults = {
    start: null,
    drag: null,
    stop: null,
    initX: 0,
    initY: 0,
    allowVerticalScrolling: false,
    allowHorizontalScrolling: false,
    target: null
};

var defaultBounds = {
    minX: null,
    maxX: null,
    minY: null,
    maxY: null
};

var setBounds = function (newBounds) {
    $.extend(this.bounds, newBounds);
};

var setPosition = function (pos) {
    $.extend(this.handle, pos);
};

var hasDragged = function () {
    return (this.dragStart.diffX !== 0 || this.dragStart.diffY !== 0);
};

var getPageScroll = function () {
    return {
        x: (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft,
        y: (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop
    };
};

var getNewPos = function (cursorPos, checkDiff) {
    var diffX, diffY, newX, newY;

    // measure the difference from when the drag started till now
    diffX = cursorPos.x - this.dragStart.x;
    diffY = cursorPos.y - this.dragStart.y;

    // check to see if there has been any change since it was called last
    if (checkDiff && diffX === this.dragStart.diffX &&
        diffY === this.dragStart.diffY) {
        return false;
    }

    // store the difference variables to check if position has changed
    this.dragStart.diffX = diffX;
    this.dragStart.diffY = diffY;

    // set the new handle position
    newX = diffX + this.handle.x;
    newY = diffY + this.handle.y;

    // keep the new position inside the bounds
    if (typeof this.bounds.minX === 'number') {
        newX = Math.max(newX, this.bounds.minX);
    }
    if (typeof this.bounds.maxX === 'number') {
        newX = Math.min(newX, this.bounds.maxX);
    }
    if (typeof this.bounds.minY === 'number') {
        newY = Math.max(newY, this.bounds.minY);
    }
    if (typeof this.bounds.maxY === 'number') {
        newY = Math.min(newY, this.bounds.maxY);
    }

    return {
        x: newX,
        y: newY
    };
};

var startDrag = function (cursorPos) {
    var pageScroll = getPageScroll();
    this.dragStart = {
        x: cursorPos.x,
        y: cursorPos.y,
        diffX: 0,
        diffY: 0,
        scrollX: pageScroll.x,
        scrollY: pageScroll.y
    };
    if (typeof this.opts.start === 'function') {
        this.opts.start.call(this, this.handle);
    }
};

var moveHandle = function (cursorPos) {
    var newPos = getNewPos.call(this, cursorPos, true);
    if (newPos && typeof this.opts.drag === 'function') {
        this.opts.drag.call(this, newPos);
    }
};

var stopDrag = function (cursorPos) {
    this.handle = getNewPos.call(this, cursorPos, false);
    var dragSuccess = (hasDragged.call(this) && !this.isScrolling);
    if (typeof this.opts.stop === 'function') {
        this.opts.stop.call(this, this.handle, dragSuccess);
    }
    this.isDragging = false;
};

var eventMouseDown = function (e) {
    document.onselectstart = function () { return false; };
    this.isDragging = true;
    startDrag.call(this, { x: e.clientX, y: e.clientY });
};

var eventMouseMove = function (e) {
    if (!this.isDragging) return;
    moveHandle.call(this, { x: e.clientX, y: e.clientY });
};

var eventMouseUp = function (e) {
    document.onselectstart = null;
    if (!this.isDragging) return;
    stopDrag.call(this, { x: e.clientX, y: e.clientY });
};

var eventTouchStart = function (e) {
    // Allow touch to scroll the page before setting isDragging to true
    this.isDragging = false;
    startDrag.call(this, { x: e.originalEvent.touches[0].clientX, y: e.originalEvent.touches[0].clientY });
};

var didPageScroll = function () {
    var pageScroll = getPageScroll();
    if (this.opts.allowVerticalScrolling && pageScroll.y !== this.dragStart.scrollY) {
        return true;
    }
    if (this.opts.allowHorizontalScrolling && pageScroll.x !== this.dragStart.scrollX) {
        return true;
    }
    return false;
};

var didDragEnough = function (pos) {
    if (!this.opts.allowVerticalScrolling && Math.abs(pos.y - this.dragStart.y) > 10) {
        return true;
    }
    if (!this.opts.allowHorizontalScrolling && Math.abs(pos.x - this.dragStart.x) > 10) {
        return true;
    }
    return false;
};

var eventTouchMove = function (e) {
    if (this.isScrolling) return true;
    var pos = {
        x: e.originalEvent.touches[0].clientX,
        y: e.originalEvent.touches[0].clientY
    };
    if (!this.isDragging) {

        // check to see if the page has scrolled since touch has started
        if (didPageScroll.call(this)) {
            this.isScrolling = true;
            return true;
        }
        if (didDragEnough.call(this, pos)) {
            this.isDragging = true;
        } else {
            return true;
        }
    }
    e.preventDefault();
    moveHandle.call(this, pos);
};

var eventTouchEnd = function (e) {
    var pos = {
        x: (this.isScrolling) ? this.dragStart.x : e.originalEvent.changedTouches[0].clientX,
        y: (this.isScrolling) ? this.dragStart.y : e.originalEvent.changedTouches[0].clientY
    };
    stopDrag.call(this, pos);
    this.isScrolling = false;
};

var preventDragStart = function (e) {
    e.preventDefault();
};

var preventClickWhenDrag = function (e) {
    if (hasDragged.call(this)) {
        e.preventDefault();
    }
};

var bindEvents = function () {
    if (this.opts.target) {
        this.$el.on('mousedown.dragger' + this.id, this.opts.target, eventMouseDown.bind(this));
        $(document)
            .on('mousemove.dragger' + this.id, eventMouseMove.bind(this))
            .on('mouseup.dragger' + this.id, eventMouseUp.bind(this));
        this.$el.on('touchstart.dragger' + this.id, this.opts.target, eventTouchStart.bind(this));
        this.$el.on('touchmove.dragger' + this.id, this.opts.target, eventTouchMove.bind(this));
        this.$el.on('touchend.dragger' + this.id, this.opts.target, eventTouchEnd.bind(this));
        this.$el.on('dragstart.dragger' + this.id, this.opts.target, preventDragStart.bind(this));
        this.$el.on('click.dragger' + this.id, this.opts.target, preventClickWhenDrag.bind(this));
    } else {
        this.$el.on('mousedown.dragger' + this.id, eventMouseDown.bind(this));
        $(document)
            .on('mousemove.dragger' + this.id, eventMouseMove.bind(this))
            .on('mouseup.dragger' + this.id, eventMouseUp.bind(this));
        this.$el.on('touchstart.dragger' + this.id, eventTouchStart.bind(this));
        this.$el.on('touchmove.dragger' + this.id, eventTouchMove.bind(this));
        this.$el.on('touchend.dragger' + this.id, eventTouchEnd.bind(this));
        this.$el.on('dragstart.dragger' + this.id, preventDragStart.bind(this));
        this.$el.on('click.dragger' + this.id, preventClickWhenDrag.bind(this));
    }
};

var unbindEvents = function () {
    if (this.opts.target) {
        this.$el.off('.dragger' + this.id, this.opts.target);
        $(document).off('.dragger' + this.id);
    } else {
        this.$el.add(document).off('.dragger' + this.id);
    }
};

var initCount = 0;

var init = function () {
    if (this.enabled || !this.$el.length) return false;
    this.el = this.$el[0];

    // initial position of the element that will be dragged
    this.handle = { x: this.opts.initX, y: this.opts.initY };

    // set this object at the beginning of the drag
    this.dragStart = { x: 0, y: 0, diffX: 0, diffY: 0, scrollX: 0, scrollY: 0 };

    this.isDragging = false;
    this.isScrolling = false;

    if (this.opts.allowVerticalScrolling) {
        this.el.style.msTouchAction = 'pan-y';
        this.el.style.touchAction = 'pan-y';
    } else if (this.opts.allowHorizontalScrolling) {
        this.el.style.msTouchAction = 'pan-x';
        this.el.style.touchAction = 'pan-x';
    } else {
        this.el.style.msTouchAction = 'none';
        this.el.style.touchAction = 'none';
    }

    bindEvents.call(this);

    this.enabled = true;
};

var uninit = function () {
    if (!this.enabled) return;
    unbindEvents.call(this);
    delete this.handle;
    delete this.dragStart;
    delete this.isDragging;
    delete this.isScrolling;
    this.el.style.msTouchAction = undefined;
    delete this.enabled;
};

var Dragger = function (el, options, bounds) {
    this.$el = $(el);
    this.id = initCount++;
    this.opts = $.extend({}, defaults, options);
    this.bounds = $.extend({}, defaultBounds, bounds);
    init.call(this);
};
Dragger.prototype.setBounds = setBounds;
Dragger.prototype.setPosition = setPosition;
Dragger.prototype.hasDragged = hasDragged;
Dragger.prototype.enable = init;
Dragger.prototype.disable = uninit;

$.fn.Dragger = function (options) {
    return new Dragger(this, options);
};


module.exports = Dragger;
},{"jquery":undefined}],5:[function(require,module,exports){
/*!
 * Track Slide
 * https://stash.c2mpg.com:8443/projects/C2/repos/track-slide
 * @version 2.0.0
 * @license MIT (c) The C2 Group (c2experience.com)
 */

'use strict';

var $ = jQuery || require('jquery');
var eventHandler = require('c2-event-handler');
var Dragger = require('jquery-dragger');
var debounce = require('bloody-debounce-af');

var defaults = {
    pageLock: false,
    trackSelector: 'ul',
    cellSelector: 'li',
    autoResize: 'true',
    animationDuration: 400,
    useTransform: false
};

var slideTo = function (index) {

    var distance;

    index = Math.max(0, index);

    if (this.opts.pageLock) {
        index = Math.min(index, Math.ceil(this.len / this.m.fit) - 1);

        distance = index * this.m.fit * this.m.item + index * this.m.fit * this.m.gap;
    } else {
        index = Math.min(index, this.len - this.m.fit);

        // How far from the left is the item
        distance = index * this.m.item + index * this.m.gap;

        // If the track is longer than the bounds
        // And the distance to the item is greater than the difference between the bounds and the length of the track
        // Set the distance to the difference
        if (this.m.track > this.m.bounds && distance > this.m.track - this.m.bounds) {
            distance = this.m.track - this.m.bounds;
        }
    }

    if (this.opts.useTransform) {
        this.$track.css('transform', 'translate(' + -distance + 'px, 0px)');
    } else {
        this.$track.stop(true).animate({'left': -distance}, this.opts.animationDuration, 'swing');
    }

    this.dragger.setPosition({
        x: -distance,
        y: 0
    });
    this.current = index;

    this.emit('slideTo', index);
};

var previous = function () {
    var num = this.current - 1;
    if (num < 0) return;
    slideTo.call(this, num);
};

var next = function () {
    var num = this.current + 1;
    if (num > this.len - this.m.fit) return;
    slideTo.call(this, num);
};

var previousPage = function () {
    if (this.opts.pageLock) {
        previous.call(this);
        return;
    }

    if (this.current === 0) return;
    var num = this.current - this.m.fit;
    if (num < 0) num = 0;
    slideTo.call(this, num);
};

var nextPage = function () {
    if (this.opts.pageLock) {
        next.call(this);
        return;
    }

    var max = this.len - this.m.fit;
    if (this.current === max) return;
    var num = this.current + this.m.fit;
    if (num > max) num = max;
    slideTo.call(this, num);
};

var onStart = function () {
    if (this.opts.useTransform) {
        this.$el.addClass('isDragging');
    }
};

var onDrag = function (handle) {
    if (this.opts.useTransform) {
        this.$track.css('transform', 'translate(' + handle.x + 'px, 0px)');
    } else {
        this.$track.css('left', handle.x);
    }
};

var onStop = function (handle, hasDragged) {

    if (this.opts.useTransform) {
        this.$el.removeClass('isDragging');
    }

    if (!hasDragged) return;

    // hard to know what to set the offset value to
    var offset = 0; //(this.m.item / 3);
    var closest;

    if (this.opts.pageLock) {
        closest = Math.round(handle.x / ((this.m.item + this.m.gap) * this.m.fit));
    } else {
        closest = Math.round((handle.x - offset) / (this.m.item + this.m.gap));
    }

    slideTo.call(this, -closest);
};

var getMeasurement = function () {
    var bounds = this.$el.width();
    var track = this.$track.outerWidth();
    var trackPadding = track - this.$track.width();
    var item = this.$items.eq(0).outerWidth();
    var gap = 0;
    if (this.len > 1) {
        gap = this.$items.get(1).getBoundingClientRect().left - this.$items.get(0).getBoundingClientRect().left - item;
    }
    var fit = (bounds - trackPadding + gap) / (item + gap);
    fit = Math.min(Math.floor(fit), this.len);

    return {
        'bounds': bounds,
        'track': track,
        'item': item,
        'gap': gap,
        'fit': fit
    };
};

var resize = function () {
    this.m = getMeasurement.call(this);
    slideTo.call(this, this.current);
};

var setFocus = function (e) {
    if (this.dragger.isDragging) return;
    var index = this.$items.index(e.delegateTarget);

    // move the track if the focused element is out of view
    if (index < this.current) {
        slideTo.call(this, index);
    }
    if (index >= this.current + this.m.fit) {
        slideTo.call(this, index - this.m.fit + 1);
    }
};

var bindEvents = function () {
    if (this.opts.autoResize) {
        $(window).on('resize', debounce(resize.bind(this)));
    }

    this.$items.on('focus', setFocus.bind(this));
};

var getDraggerOptions = function () {
    return {
        'start': onStart.bind(this),
        'drag': onDrag.bind(this),
        'stop': onStop.bind(this),
        'allowVerticalScrolling': true
    };
};

var init = function () {
    if (!this.$el.length) return false;
    this.$track = this.$el.find(this.opts.trackSelector);
    if (!this.$track.length) return false;

    this.$items = this.$track.find(this.opts.cellSelector);
    this.len = this.$items.length;
    this.m = getMeasurement.call(this);
    this.current = 0;

    this.dragger = new Dragger(this.$el, getDraggerOptions.call(this));

    bindEvents.call(this);
    return true;
};

var TrackSlide = function (el, options) {
    this.$el = $(el);
    this.opts = $.extend({}, defaults, options);
    this.result = init.call(this);
};

eventHandler(TrackSlide);

TrackSlide.prototype.slideTo = slideTo;
TrackSlide.prototype.resize = resize;
TrackSlide.prototype.previous = previous;
TrackSlide.prototype.next = next;
TrackSlide.prototype.previousPage = previousPage;
TrackSlide.prototype.nextPage = nextPage;
TrackSlide.prototype.resize = resize;

module.exports = TrackSlide;

},{"bloody-debounce-af":1,"c2-event-handler":3,"jquery":undefined,"jquery-dragger":4}]},{},[5])(5)
});