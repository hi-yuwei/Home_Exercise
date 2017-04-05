/**
 * Created by yy on 2016/3/31.
 */

var run = {
    dofun: function () {
        this.play();
    },
    play: function () {
        var skewing, cloneSkewing, timer, time = 1500, changeBtnTime = 500, imgNum = 5, cloneLeft;

        $(".clone").append($(".ui-cont").html());   //克隆一份
        skewing = parseInt($(".ui-cont").css("left"));//偏移位置
        var imgWidth = $(".ui-cont li").width();   //单个图片宽度
        var imgLength = $(".ui-cont li").length;   //图片个数
        var imgMargin = parseInt($(".ui-cont li").eq(1).css("marginLeft"));  //外边距
        var sumWidth = imgWidth * imgLength + (imgLength - 1) * imgMargin;
        $(".ui-cont").width(sumWidth);    //设置Ul的中宽度
        $(".clone").css({"width": sumWidth + imgMargin, "left": sumWidth + imgMargin});    //设置克隆盒子的宽度和偏移
        cloneLeft = parseInt($(".clone").css("left"));    //克隆图片的偏移
        imgLeft = parseInt($(".ui-cont").css("left"));    //原图的偏移位置


        //计算
        var setCount = function () {
            skewing -= (imgWidth + imgMargin);
            if (parseInt($(".ui-cont").css("left")) <= -1476) {
                $(".ui-cont").css("left", 1476);
                skewing = -246;
                cloneLeft = 0;
                imgLeft = 1476;

            } else if (parseInt($(".clone").css("left")) <= -1476) {
                $(".clone").css("left", 1476);
                skewing = -246;
                imgLeft = 0;
                cloneLeft = 1476;
            }
            $(".ui-cont").stop(true).animate({"left": imgLeft + skewing}, changeBtnTime);
            $(".clone").stop(true).animate({"left": cloneLeft + skewing}, changeBtnTime);
        }

        //判断图片个数
        if (imgLength > imgNum) {
            //定时器
            function move() {
                clearInterval(timer);
                timer = setInterval(setCount, time);
            }

            //左右切换
            $(".btn a").on("click", function () {
                if ($(this).index()) {
                    setCount();
                } else {
                    //左点击时：当当前偏移位置大于或等于为0时设置到保留5张图的位置和他们的边距，否则当前偏移位置减去它的宽度和外边距
                    skewing += (imgWidth + imgMargin);
                    if (parseInt($(".ui-cont").css("left")) == 0) {
                        $(".clone").css("left", -1476);
                        skewing = 246;
                        imgLeft = 0;
                        cloneLeft = -1476;

                    } else if (parseInt($(".clone").css("left")) == 0) {
                        $(".ui-cont").css("left", -1476);
                        skewing = 246;
                        cloneLeft = 0;
                        imgLeft = -1476;
                    }
                    $(".ui-cont").stop(true).animate({"left": imgLeft + skewing}, changeBtnTime);
                    $(".clone").stop(true).animate({"left": cloneLeft + skewing}, changeBtnTime);
                }
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