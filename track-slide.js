/* track-slide
 * version: 1.3.1
 * https://stash.c2mpg.com:8443/projects/C2/repos/track-slide
 * @preserve
 */

/*exported TrackSlide */

var TrackSlide = (function ($, Dragger) {

    'use strict';

    var defaults = {
        pageLock: false,
        trackSelector: 'ul',
        cellSelector: 'li',
        autoResize: 'true',
        animationDuration: 400,
        useTransform: false
    };

    var previous = function () {
        var num = this.current - 1;
        if (num < 0) return;
        moveTo.call(this, num);
    };

    var next = function () {
        var num = this.current + 1;
        if (num > this.len - this.m.fit) return;
        moveTo.call(this, num);
    };

    var previousPage = function () {
        if (this.opts.pageLock) {
            previous.call(this);
            return;
        }

        if (this.current === 0) return;
        var num = this.current - this.m.fit;
        if (num < 0) num = 0;
        moveTo.call(this, num);
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
        moveTo.call(this, num);
    };

    var moveTo = function (index) {

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

        // trigger moved event
    };

    var onStart = function (handle) {
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

        moveTo.call(this, -closest);
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
        moveTo.call(this, this.current);
    };

    var setFocus = function (e) {
        if (this.dragger.isDragging) return;
        var index = this.$items.index(e.delegateTarget);

        // move the track if the focused element is out of view
        if (index < this.current) {
            moveTo.call(this, index);
        }
        if (index >= this.current + this.m.fit) {
            moveTo.call(this, index - this.m.fit + 1);
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

    TrackSlide = function (el, options) {
        this.$el = $(el);
        this.opts = $.extend({}, defaults, options);
        this.result = init.call(this);
    };

    TrackSlide.prototype.moveTo = moveTo;
    TrackSlide.prototype.resize = resize;
    TrackSlide.prototype.previous = previous;
    TrackSlide.prototype.next = next;
    TrackSlide.prototype.previousPage = previousPage;
    TrackSlide.prototype.nextPage = nextPage;
    TrackSlide.prototype.resize = resize;

    function debounce(fn) {
        if (typeof requestAnimationFrame === 'undefined') {
            return fn;
        }

        var id = null;
        return function () {
            var args = arguments;
            if (id !== null) {
                cancelAnimationFrame(id);
            }
            id = requestAnimationFrame(function () {
                fn.apply(null, args);
                id = null;
            });
        };
    }

    return TrackSlide;

}(jQuery, Dragger));
