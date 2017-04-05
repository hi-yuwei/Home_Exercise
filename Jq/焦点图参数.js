function bannerWidth() {
    var w1 = $(".pagination").outerWidth();
    $(".pagination").css('margin-left', parseInt(-w1 / 2) - 44)
    $(".bx_banner_slide .page").css("width", $(window).width());
}
$(window).resize(function () {
    bannerWidth();
});
bannerWidth();
$(".bx_banner_slide,.bx_right_product").slides({
    preload: true,
    play: 5000,
    pause: 3000,
    generatePagination: false,
    generatePrevnext: false,
    animationStart: function () {
        $(window).resize();
    },
    animationComplete: function () {
        $(window).resize();
    }
});

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
    animationStart: function () {
},
animationComplete: function () {
}




$(".messageInfo").Slide({
    effect: "scroolTxt", speed: "normal", timer: 1600, steps: 1
});
(function ($) {
    function inintTab(_a, _b, _c) {
        var a = $(_a);
        a.each(function () {
            var me = $(this), b = me.find(_b), c = me.find(_c), d;
            b.mouseover(function () {
                var me = this, index = $(me).index();
                d = setTimeout(function () {
                    $(me).addClass("active").siblings().removeClass('active');
                    c.eq(index).show().siblings(_c).hide();
                }, 50);
            }).mouseout(function () {
                clearTimeout(d);
            });
            b.eq(0).addClass("active").siblings().removeClass('active');
            c.eq(0).show().siblings(_c).hide();
        });
    }

    inintTab('.bx_tab_box', '.bxb_tab h4', '.bxb_body table');
})(jQuery);
$("#bx_partner").Slide({
    effect: "scroolY", speed: "normal", timer: 5000, childSize: 10, mul: 2
});
/**
 * Created by Administrator on 2016/1/7.
 */
