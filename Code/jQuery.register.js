/**
 * Created by yuwei on 2016/1/15.
 */
(function ($) {
    $.fn.register = function (options) {
        //参数
        var defaults = {
            element: "",
            delicon: "<i class='del'></i>",
            borderBC:"",
            reg: "/./"
        };

        var opts = $.extend(defaults, options);

        //获得焦点
        $(defaults.element + " input").focus(function () {
            $(defaults.element + " i").remove();
            $(this).prev().after(defaults.delicon).next().mousedown(function () {
                $(this).next().val("");
            });

            $(this).parent().find("span").stop().animate({
                "top": "0",
                "font-size": "12px"
            }).css("color", "#555");

            $(this).addClass(defaults.borderBC);
        });

        //失去焦点
        $(defaults.element + " input").focusout(function () {
            $(this).parent().find("i.del").remove();

            if (!eval(defaults.reg).test($(this).val())) {
                $(this).parent().find("span").stop().animate({
                    "top": "20px",
                    "font-size": "14px"
                })
            }
            $(this).removeClass("bdbc");
        });

        //点击框
        $(defaults.element).click(function () {
            $(this).find("input").focus();
        });

        //默认选中第一个
        $(".register input:eq(0)").focus();

    };
})(jQuery);