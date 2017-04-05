/**
 * Created by yy on 2016/3/31.
 */

var run = {
    dofun: function () {
        this.play();
    },
    play: function () {
        var skewing, timer, time = 2000, changeBtnTime = 500, imgNum = 5,cloneLeft;

        $(".clone").append($(".ui-cont").html());   //克隆一份
        skewing = parseInt($(".ui-cont").css("left"));//偏移位置
        var imgWidth = $(".ui-cont li").width();   //单个图片宽度
        var imgLength = $(".ui-cont li").length;   //图片个数
        var imgMargin = parseInt($(".ui-cont li").eq(1).css("marginLeft"));  //外边距
        var sumWidth = imgWidth * imgLength + (imgLength - 1) * imgMargin;
        $(".ui-cont").width(sumWidth);    //设置Ul的中宽度
        $(".clone").css({"width": sumWidth, "left": sumWidth});    //设置克隆盒子的宽度和偏移
        cloneLeft=parseInt($(".clone").css("left"));



        //判断图片个数
        if (imgLength > imgNum) {
            //定时器
            function move() {
                clearInterval(timer);
                timer = setInterval(function () {
                    //当当前偏移位置小于等于5张图片时设置为起点，否则当前偏移位置加上它的宽度和外边距
                    if (skewing <= -imgWidth * (imgLength - imgNum) - (imgLength - imgNum) * imgMargin) {
                        skewing = 0;
                    } else {
                        skewing -= (imgWidth + imgMargin)
                    }
                    $(".ui-cont").animate({"left": skewing}, changeBtnTime);
                }, time);
            }

            //左右切换
            $(".btn a").on("click", function () {
                if ($(this).index()) {
                    //右点击时：当当前偏移位置小于保留5张图的宽度时设置为0（回到起点），否则当前偏移位置加上它的宽度和外边距
                    if (skewing <= -imgWidth * (imgLength - imgNum) - (imgLength - imgNum) * imgMargin) {
                        skewing = 0;
                    } else {
                        //skewing = skewing - imgWidth - imgMargin;
                        skewing -= (imgWidth + imgMargin);
                    }
                } else {
                    //左点击时：当当前偏移位置大于或等于为0时设置到保留5张图的位置和他们的边距，否则当前偏移位置减去它的宽度和外边距
                    if (skewing >= 0) {
                        skewing = -imgWidth * (imgLength - imgNum) - imgMargin * (imgLength - imgNum);
                    } else {
                        //skewing = skewing + imgWidth + imgMargin
                        skewing += (imgWidth + imgMargin)

                    }
                }
                $(".ui-cont").stop().animate({"left": skewing}, changeBtnTime);
            });
            //鼠标进入包裹图片区域
            $(".ui-cont").on("mouseover", function () {
                clearInterval(timer);
            });
            //鼠标进入包裹图片区域
            $(".ui-cont").on("mouseout", function () {
                clearInterval(timer)
                move();
            });
            //鼠标进入点击区域
            $(".btn a").on("mouseover", function () {
                $(".ui-cont").trigger("mouseover");
            })
            //鼠标离开点击区域
            $(".btn a").on("mouseout", function () {
                $(".ui-cont").trigger("mouseout");
            })
            clearInterval(timer)
            move();
        } else {
            $(".btn").css("display", "none");
        }
    }
}