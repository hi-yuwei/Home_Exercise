/**
 * Created by yy on 2016/1/14.
 */
$.fn.slides.option = {
    preload: false,
    preloadImage: '/img/loading.gif',
    container: 'slides_container',
    generateNextPrev: false,
    next: 'next',
    prev: 'prev',
    pagination: true,
    generatePagination: true,
    paginationClass: 'pagination',
    fadeSpeed: 350,
    slideSpeed: 350,
    start: 1,
    effect: 'slide',
    crossfade: false,
    randomize: false,
    play: 0,
    pause: 0,
    hoverPause: false,
    autoHeight: false,
    autoHeightSpeed: 350,
    bigTarget: false,
    animationStart: function() {
    },
    animationComplete: function() {
    }
};