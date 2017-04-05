/* 
 * @Author: Administrator
 * @Date:   2015-09-17 16:14:40
 * @Last Modified by:   Administrator
 * @Last Modified time: 2015-09-26 17:22:24
 */

/*******************************************************************/
//功能：首页Banner轮播图
//人员：yuwei
//时间：2015-09-17
//版本：v1.0
/*******************************************************************/
$(function () {
	var bannerArea = $(".Banner");
	var ulArea = $(".banner_img");
	var imgs = $(".Banner .banner_img>li"); //获得Banner图片数量
	var arrows = $(".Banner span.arrows"); //左右箭头按钮
	var imgsBtn = $(".BannerImageBtn");
	var imgW = $(".Banner .banner_img>li").width(); //图片宽度
	var runWidth;
	var num = 0;
	var timer;

	//根据图片数量，插入按钮数
	for (var i = 0, len = imgs.length; i < len; i++) {
		imgsBtn.append('<a href="#""></a>');
	}
	var BtnAs = $(".BannerImageBtn a");
	BtnAs.eq(0).addClass('current');

	//轮播核心函数
	function ScrollImage(x) {
		runWidth = x * -imgW + "px";
		BtnAs.eq(x).addClass('current').siblings().removeClass('current')
		ulArea.animate({
			left: runWidth
		}, 300);
	}
	var autoPlay = function () {
			num < imgs.length - 1 ? num++ : num = 0;
			ScrollImage(num);
		}
		//圆点按钮触发
	BtnAs.click(function () {
		num = $(this).index();
		ScrollImage(num);
	})

	//箭头事件
	arrows.click(function () {
		var flag = $(this).index();

		if (flag == 2) {
			num == 0 ? num = imgs.length - 1 : num--;
			ScrollImage(num);
		} else {
			num == imgs.length - 1 ? num = 0 : num++;
			ScrollImage(num);
		}
	})

	//鼠标进入Banner区域
	bannerArea.hover(function () {
		/* Stuff to do when the mouse enters the element */
		clearInterval(timer);
		arrows.removeClass('showHidden');
	}, function () {
		/* Stuff to do when the mouse leaves the element */
		arrows.addClass('showHidden');
		timer = setInterval(autoPlay, 5000);
	});

	//定时器
	clearInterval(timer);
	timer = setInterval(autoPlay, 5000);



	$(".inGuess_list_Con .inGuess_list_Con_ul li").mouseover(function () {
		$(this).addClass('currentBg').siblings().removeClass('currentBg');
	})
	$(".inGuess_list_Con").mouseout(function () {
		$(".inGuess_list_Con .inGuess_list_Con_ul li").removeClass('currentBg');
	})
})


$(function () {
	$(".lightList_ul li:even").css("background", "#F7F7F7");
})

$(function () {
	var titles = $(".leagueInfo_Header_Option li");
	var cons = $(".leagueInfo_Active ul")
	titles.click(function () {
		$(this).addClass('current').siblings().removeClass('current');
		cons.eq($(this).index()).addClass('leagueInfo_ActiveBlock').siblings().removeClass('leagueInfo_ActiveBlock');
	})
})

// 导航栏效果
$(function () {
	var lis = $(".inNav_con li");
	lis.click(function () {
		$(this).addClass('current').siblings().removeClass('current');
	})
})

//吸附效果
$(function () {
	var tag = $(".adsorption");
	var back = $(".back");
	$(window).scroll(function () {
		var num = $(document).scrollTop();
		if (num > 200) {
			tag.slideDown(800);
		}
		if (num > 800) {
			back.slideDown(1000)
		}
		if (num < 800) {

			back.slideUp(1000)
		}
		if (num < 200) {
			tag.slideUp(800);
		}
	})
})