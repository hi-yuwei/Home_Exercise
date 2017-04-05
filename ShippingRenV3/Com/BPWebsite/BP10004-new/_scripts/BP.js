/*
* author: Jack
* time: 2015-03-17
*/

/*******************************************************************/
/* 模块级通用js */
/*******************************************************************/

/* 插件编写 */
(function($) {

	/* bannerSlide */
	$.fn.bannerSlide = function(imgBox, switchTime, delayTime, easing) {
		var easing = easing || false;
		return this.each(function() {
			var $switchDom = $(this).children();
			var $imgDom = $(this).parent().children(imgBox).children();
			var start;
			var index = 0;
			var len = $switchDom.size();
			$imgDom.css({'opacity': '0'});
			$imgDom.filter(".visible").css({'opacity': '1'});
			$switchDom.bind("mouseenter", function() {
				clearTimeout(start);
				index = $(this).index();
				$switchDom.removeClass("current");
				$(this).addClass("current");
				if(easing) {
					$imgDom.filter('.visible').stop().animate({'opacity': '0', "left": "-10%"}, switchTime).removeClass('visible');
					$imgDom.eq(index).css("left", "0").stop().animate({'opacity': '1'}, switchTime).addClass('visible');
				} else {
					$imgDom.filter('.visible').stop().animate({'opacity': '0'}, switchTime).removeClass('visible');
					$imgDom.eq(index).stop().animate({'opacity': '1'}, switchTime).addClass('visible');
					//new add
					$(".bannerSlideEasing img").removeClass("past").filter(".present").addClass("past").removeClass("present");
					$(".bannerSlideEasing img").eq(index).addClass("present");
				}
			});
			$switchDom.bind("mouseleave", function() {
				start = setTimeout(change, delayTime);
			});
			$(".bannerSlideEasing").bind("click", function() {
				clearTimeout(start);
				change();
			});
			function change() {
				if(index == len-1 || index > len-1) {
					index = 0;
				} else {index += 1;}
				$switchDom.removeClass("current");
				$switchDom.eq(index).addClass("current");
				if(easing) {
					$imgDom.filter('.visible').stop().animate({'opacity': '0', "left": "-10%"}, switchTime).removeClass('visible');
					$imgDom.eq(index).css("left", "0").stop().animate({'opacity': '1'}, switchTime).addClass('visible');
				} else {
					$imgDom.filter('.visible').stop().animate({'opacity': '0'}, switchTime).removeClass('visible');
					$imgDom.eq(index).stop().animate({'opacity': '1'}, switchTime).addClass('visible');
				}
				start = setTimeout(change, delayTime);
			}
			start = setTimeout(change, delayTime);
		});
	};
	
})(jQuery);

/* 返回顶部--函数定义 */
function backToTop(dom) {
	var $backToTop = dom;
	var start = null, backT = null;
	backT = function() {
		clearTimeout(start);
		start = setTimeout(function() {
			if($(window).scrollTop() > 300) {
				$backToTop.fadeIn(400);
			} else {
				$backToTop.fadeOut(400);
			}
		}, 400);
	}
	backT();
	$(window).scroll(function() {
		backT();
	});
	$(window).resize(function() {
		backT();
	});
	$backToTop.on("click", function() {
		//$(window).scrollTop(0);
		$("html, body").animate({
			scrollTop: "0px"
		}, 200);
		$backToTop.fadeOut(400);
		return false;
	});
}

$(function() {
	
	/* bannerSlide */
	$('.bannerSlideTab').bannerSlide(".bannerSlideImg", 1000, 6000, false);
	
	/* 返回顶部--函数调用 */
	backToTop($(".backToTop"));
	
});
/*******************************************************************/
/* 模块级通用js */
/*******************************************************************/

/*******************************************************************/
/* 页面js */
/*******************************************************************/
$(function() {
	$(".index_tabs dt a").on("click", function() {
		var _this = $(this);
		var tid = _this.attr("tid");
		var tids = tid.replace("all", "") + "1";
		$(".index_tabs dt a, .index_tabs dd a").removeClass("current");
		_this.addClass("current").parents("dl").find("[tid=" + tids + "]").addClass("current");
		$(".index_cont .contP, .index_cont .contS").hide();
		$("#" + tid).show();
		$("#" + tids).show();
	});
	$(".index_tabs dd a").on("click", function() {
		var _this = $(this);
		var tid = _this.attr("tid");
		var tidp = _this.parent().siblings("dt").children("a").attr("tid");
		$(".index_tabs dt a, .index_tabs dd a").removeClass("current");
		_this.addClass("current").parent().siblings("dt").children("a").addClass("current");
		$(".index_cont .contP, .index_cont .contS").hide();
		$("#" + tid).show();
		$("#" + tidp).show();
	});
});
/*******************************************************************/
/* 页面js */
/*******************************************************************/