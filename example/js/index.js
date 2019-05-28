'use strict';

var $ = require('jquery');
var TrackSlide = require('../../cjs/track-slide');

var slidesIDs = [
    'slide1',
    'slide2',
    'slide3',
    'slide4',
    'slide5',
    'slide6',
    'slide7',
    'slide8'
];

var sliders = {};

slidesIDs.forEach(function (slide) {
    sliders[slide] = new TrackSlide('#' + slide);
});

sliders.slide1b = new TrackSlide('#slide1b', {
    pageLock: true
});

sliders.slideAllowEmptySpace = new TrackSlide('#slideAllowEmptySpace', {
    allowEmptySpace: true
});

$(document).on('click', '[previous]', function (e) {
    e.preventDefault();
    var id = $(this).attr('previous');

    sliders[id].previous();
});

$(document).on('click', '[next]', function (e) {
    e.preventDefault();
    var id = $(this).attr('next');

    sliders[id].next();
});

$(document).on('click', '[previous-page]', function (e) {
    e.preventDefault();
    var id = $(this).attr('previous-page');

    sliders[id].previousPage();
});

$(document).on('click', '[next-page]', function (e) {
    e.preventDefault();
    var id = $(this).attr('next-page');

    sliders[id].nextPage();
});
