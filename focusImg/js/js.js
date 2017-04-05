(function ($) {
    $.fn.imgsRun = function (options) {
        //将传进来的属性，替换默认属性
        options = $.extend({}, $.fn.imgsRun.options, options);

        //核心
        function samllRun(x) {
            //给当前项添加on，其余去除
            $(options.bigImgList).eq(x).removeClass("on").siblings().addClass("on");
            //控制选中框跑动
            $(options.currentbox).stop().animate({"left": x * $(options.currentbox).width()}, options.moveSpeed);
            //给所有文字移除显示类
            $(options.samllImgTxt).removeClass("small-on");
            //给当前文字添加显示类
            $(options.samllImgTxt).eq(x).addClass("small-on");
        }

        //自动跑
        var play = function () {
            options.count++
            if (options.count == $(options.bigImgList).length) {
                options.count = 0;
            }
            samllRun(options.count);
        }

        clearInterval(options.timer);
        timer = setInterval(play, options.interval);

        $(options.samllImg).on(options.mouseState, function (e) {
            clearInterval(timer);
            e.stopPropagation();
            samllRun($(this).index());
        });

        $(options.samllImg).on(options.mouseEnd, function (e) {
            e.stopPropagation();
            options.count = $(this).index();
            timer = setInterval(play, options.interval);
        })
        //处理鼠标进入小图时停止计时器失效bug
        $(options.currentbox).on(options.mouseState, function (e) {
            clearInterval(timer);
        })
        $(options.currentbox).on(options.mouseEnd, function (e) {
            timer = setInterval(play, options.interval);
        })
    };
    //默认属性
    $.fn.imgsRun.options = {
        timer: null,
        count: 0,
        interval: 500, //定时器时间
        onWidth: 400,   //选中框宽度
        moveSpeed: 300, //选中框移动时长
        bigImgList: ".ui-item div",
        samllImg: ".bg-box li",
        samllImgTxt: ".bg-box li span",
        currentbox: ".trigger",
        mouseState: "mouseover",    //触发事件
        mouseEnd: "mouseout"    //触发事件
    }
}(jQuery))