/*
* news.js
* author: Jack
* time: 2015-06-02
*/

/* 插件编写 */
(function($) {

	/* 图片切换--通用插件 */
	$.fn.newsSlide = function(imgBox, switchTime, delayTime, easing) {
		var easing = easing || false;
		return this.each(function() {
			var _this = $(this);
			var $switchDom = _this.children();
			var $imgDom = _this.parent().children(imgBox).children();
			var $NsLatest = _this.parent().siblings(".NsLatestBox").children();
			var start;
			var index = 0;
			var len = $switchDom.size();
			$imgDom.css({'opacity': '0'});
			$imgDom.filter(".visible").css({'opacity': '1'});
			$switchDom.bind("mouseenter", function() {
				index = $(this).index();
				$switchDom.removeClass("current");
				$(this).addClass("current");
				if(easing) {
					$imgDom.filter('.visible').stop().animate({'opacity': '0', "top": "-37%"}, switchTime).removeClass('visible');
					$imgDom.eq(index).css("top", "0").stop().animate({'opacity': '1'}, switchTime).addClass('visible');
				} else {
					$imgDom.filter('.visible').stop().animate({'opacity': '0'}, switchTime).removeClass('visible');
					$imgDom.eq(index).stop().animate({'opacity': '1'}, switchTime).addClass('visible');
				}
				//其它文本
				if($NsLatest.size() > 0) {
					$NsLatest.hide();
					$NsLatest.eq(index).show();
				}
				clearTimeout(start);
			});
			$switchDom.bind("mouseleave", function() {
				start = setTimeout(change, delayTime);
			});
			if(_this.siblings(".slideArrowLeft, .slideArrowRight").size() > 0) {
				_this.parent().bind("mouseenter", function() {
					_this.siblings(".slideArrowLeft, .slideArrowRight").show();
				}).bind("mouseleave", function() {
					_this.siblings(".slideArrowLeft, .slideArrowRight").hide();
				});
			}
			_this.siblings(".slideArrowLeft").bind("click", function() {
				clearTimeout(start);
				change(true);
			});
			_this.siblings(".slideArrowRight").bind("click", function() {
				clearTimeout(start);
				change();
			});
			function change(mark) {
				var mark = mark || false;
				if(!mark) {
					if(index >= len - 1) {
						index = 0;
					} else {
						index += 1;
					}
				} else {
					if(index <= 0) {
						index = len - 1;
					} else {
						index -= 1;
					}
				}
				$switchDom.removeClass("current");
				$switchDom.eq(index).addClass("current");
				if(easing) {
					$imgDom.filter('.visible').stop().animate({'opacity': '0', "top": "-37%"}, switchTime).removeClass('visible');
					$imgDom.eq(index).css("top", "0").stop().animate({'opacity': '1'}, switchTime).addClass('visible');
				} else {
					$imgDom.filter('.visible').stop().animate({'opacity': '0'}, switchTime).removeClass('visible');
					$imgDom.eq(index).stop().animate({'opacity': '1'}, switchTime).addClass('visible');
				}
				//其它文本
				if($NsLatest.size() > 0) {
					$NsLatest.hide();
					$NsLatest.eq(index).show();
				}
				start = setTimeout(change, delayTime);
			}
			start = setTimeout(change, delayTime);
		});
	};
})(jQuery);

/* 页面交互 */
$(function() {
	
	/* 首页banner图片交互 */
	$('.slideModelTab').newsSlide(".slideModelImg", 1000, 5000);
	
	/* 列表交互 */
	$(document).on("mouseenter", ".newsListMain li", function() {
		$(this).addClass("hover");
	}).on("mouseleave", ".newsListMain li", function() {
		$(this).removeClass("hover");
	});
	
});