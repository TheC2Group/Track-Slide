(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.TrackSlide = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports["default"] = function (fn) {
    if (typeof window !== "undefined" && !(requestAnimationFrame in window)) {
        return fn;
    }

    var id = null;

    return function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        if (id !== null) {
            cancelAnimationFrame(id);
        }

        id = requestAnimationFrame(function () {
            fn.apply(undefined, args);
            id = null;
        });
    };
};

;
module.exports = exports["default"];


},{}],2:[function(require,module,exports){
(function (global){
/*!
 * Track Slide
 * https://github.com/TheC2Group/track-slide
 * @version 2.2.1
 * @license MIT (c) The C2 Group (c2experience.com)
 */

'use strict';

var $ = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var eventHandler = (typeof window !== "undefined" ? window['eventHandler'] : typeof global !== "undefined" ? global['eventHandler'] : null);
var Dragger = (typeof window !== "undefined" ? window['Dragger'] : typeof global !== "undefined" ? global['Dragger'] : null);
var debounce = require('c2-debounce-af');

var defaults = {
    pageLock: false,
    trackSelector: 'ul',
    cellSelector: 'li',
    autoResize: 'true',
    animationDuration: 400,
    useTransform: false,
    allowEmptySpace: false
};

var slideTo = function (index) {

    var distance;

    index = Math.max(0, index);

    if (this.opts.pageLock) {
        index = Math.min(index, Math.ceil(this.len / this.m.fit) - 1);

        distance = index * this.m.fit * this.m.item + index * this.m.fit * this.m.gap;
    } else {

        if (this.opts.allowEmptySpace) {
            index = Math.min(index, this.len - 1);
        } else {
            index = Math.min(index, this.len - this.m.fit);
        }

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
    this.emit('hasDragged');

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"c2-debounce-af":1}]},{},[2])(2)
});