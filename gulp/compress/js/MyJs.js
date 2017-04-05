/**
 * Created by Administrator on 2016/4/27.
 */
var myfun = {
    dofun: function () {
        this.paly();
    },
    paly: function () {
        var sum = 0;
        $(".btn").on("click", function () {
            sum = ++sum === 5 ? 0 : sum;
            $(".shape li").eq(sum).addClass("oncolumn").siblings().removeClass("oncolumn");
            $(".txtlist li").eq(sum).addClass("showCon").siblings().removeClass("showCon");
            $(".txtConList p").eq(sum).addClass("showTxt").siblings().removeClass("showTxt");
        });
        $(".shape li").on("mouseover", function () {
            sum = $(this).index();
            $(this).addClass("oncolumn").siblings().removeClass("oncolumn");
            $(".txtConList p").eq(sum).addClass("showTxt").siblings().removeClass("showTxt");
            $(".txtlist li").eq(sum).addClass("showCon").siblings().removeClass("showCon");
        });
    }
}