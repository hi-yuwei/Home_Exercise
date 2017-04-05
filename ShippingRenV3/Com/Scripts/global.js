/*
* global.js
* author: Jack
* time: 2014-12-24
*/

/*******************************************************************/
/* jquery扩展 */
/*******************************************************************/

;(function($) {
	/*********************************************/
	/* 扩展jquery全局对象 */
	/*********************************************/
	
	$.extend({
		/* 页面遮罩层--pageMask */
		pageMask: function(opacity) {
			var opacity = (/^[0]\.[0-9]+$|^[0-1]$/g.test(opacity))? opacity : 0.1;
			var wHeight = $(window).height();
			var pageMaskHtml = '<div class="pageMask"><iframe src="about:blank" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe><div class="mask"></div></div>';
			if ($(".pageMask").size() == 0) {
				$(pageMaskHtml).appendTo($("body"));
			}
			$(".pageMask").show().css("opacity", opacity).width(document.body.clientWidth).height(Math.max(document.body.clientHeight, wHeight))
			.find("iframe, .mask").width(document.body.clientWidth).height(Math.max(document.body.clientHeight, wHeight));
			
			//改变窗口大小
			$(window).resize(function () {
				var wHeight = $(window).height();
				if ($(".pageMask").size() > 0 && $(".pageMask").is(":visible")) {
					$(".pageMask").show().width(document.body.clientWidth).height(Math.max(document.body.clientHeight, wHeight))
					.find("iframe, .mask").width(document.body.clientWidth).height(Math.max(document.body.clientHeight, wHeight));
				}
			});
		},
		
		/* 页面通用弹出层--alertDialog */
		alertDialog: function(options) {
			var opts = $.extend({}, $.alertDialog.defaults, options);
			if($(".adminDialog").size() == 0) {
				$(alertConfirmHtml).appendTo("body");
			}
			$(".adminDialog").show()
			.find(".title h3").html(opts.title)
			.closest(".adminDialog").find(".msg .text").html(opts.content)
			.closest(".adminDialog").find(".linkBtn").hide().filter(".ok").show().text(opts.btnOk);
			if(opts.id) {
				$(".adminDialog").attr("id", opts.id);
			}
			$.pageMask();
			$.closeDialog();
		},
		
		/* 页面通用弹出层--confirmDialog */
		confirmDialog: function(options) {
			var opts = $.extend({}, $.confirmDialog.defaults, options);
			if($(".adminDialog").size() == 0) {
				$(alertConfirmHtml).appendTo("body");
			}
			$(".adminDialog").show()
			.find(".title h3").html(opts.title)
			.closest(".adminDialog").find(".msg .text").html(opts.content)
			.closest(".adminDialog").find(".linkBtn").show().filter(".ok").hide()
			.parent().find(".determine").text(opts.btnDetermine)
			.closest(".btnBox").find(".cancel").text(opts.btnCancel);
			if(opts.id) {
				$(".adminDialog").attr("id", opts.id);
			}
			$.pageMask();
			$.closeDialog();
		},
		
		/* 模仿原生confirm */
		confirmReturn: function(options, callback) {
			var opts = $.extend({}, $.confirmReturn.defaults, options);
			if($(".adminDialog").size() == 0) {
				$(alertConfirmHtml).appendTo("body");
			}
			$(".adminDialog").show()
			.find(".title h3").html(opts.title)
			.closest(".adminDialog").find(".msg .text").html(opts.content)
			.closest(".adminDialog").find(".linkBtn").show().filter(".ok").hide()
			.parent().find(".determine").text(opts.btnDetermine).focus()
			.closest(".btnBox").find(".cancel").text(opts.btnCancel);
			if(opts.id) {
				$(".adminDialog").attr("id", opts.id);
			}
			$.pageMask();
			$("body").on("click", "#confirmReturn .determine", function() {
				$(".pageMask").hide();
				$("#confirmReturn").hide();
				if(typeof callback == "function") {
					callback();
				}
			});
			$("body").on("click", "#confirmReturn .cancel, #confirmReturn .close", function() {
				$(".pageMask").hide();
				$("#confirmReturn").hide();
			});
		},
		
		/* 关闭页面通用弹出层 */
		closeDialog: function() {
			$("body").delegate(".adminDialog .close, .adminDialog .cancel,  .adminDialog .ok", "click", function () {
				$(this).closest(".adminDialog").hide();
				$(".pageMask").hide();
				//return false;
			});
		},
		
		/* 页面通用弹出窗口--pageDialog--div+iframe */
		pageDialog: function(options) {
			var html = "<div class=\"pageDialog\"><div class=\"top cf\"><div class=\"topLeft\"></div><div class=\"topRight\"></div><div class=\"topCenter\"></div></div>";
			html += "<div class=\"middle\"><div class=\"middleInner\"><div class=\"title cf\"><h3></h3><a class=\"close\" href=\"javascript:void(0)\"></a></div>";
			html += "<iframe name=\"pageDialogIframe\" src=\"about:blank\" frameborder=\"0\" marginwidth=\"0\" marginheight=\"0\" scrolling=\"no\"></iframe></div></div>";
			html += "<div class=\"bottom cf\"><div class=\"bottomLeft\"></div><div class=\"bottomRight\"></div><div class=\"bottomCenter\"></div></div></div>";
			var opts = $.extend({}, $.pageDialog.defaults, options);
			if($(".pageDialog").size() == 0) {
				$(html).appendTo("body");
			}
			$(".pageDialog").show().css({"width": parseInt(opts.width) + 16 + "px", "height": parseInt(opts.height) + 46 + "px", "margin-left": -parseInt(opts.width) / 2 - 8, "margin-top": -parseInt(opts.height) / 2 - 23})
			.find("iframe").css({"width": opts.width, "height": opts.height}).attr("src", opts.src)
			.siblings(".title").find("h3").text(opts.title);
			$.pageMask();
			//关闭页面弹出框
			$("body").on("click", ".pageDialog .close", function() {
				$.closePageDialog();
				return false;
			});
		},
		
		/* 关闭页面通用弹出窗口 */
		closePageDialog: function() {
			//top.$(".pageDialog").remove();
			//top.$(".pageMask").remove();
			$(".pageDialog").remove();
			$(".pageMask").remove();
		},
		closePageDialogNoMask: function() {
			$(".pageDialog").remove();
		}
		
	});
	
	/*********************************************/
	/* 暴露某些参数 */
	/*********************************************/
	
	/* 页面通用弹出层--html */
	var alertConfirmHtml = "<div class=\"adminDialog\"><div class=\"title cf\"><h3></h3><a class=\"close\" href=\"javascript:void(0)\"></a></div>";
	alertConfirmHtml += "<div class=\"contentBox\"><div class=\"msg cf\"><strong class=\"icon\"></strong><span class=\"text\"></span></div></div>";
	alertConfirmHtml += "<div class=\"btnBox cf\"><a href=\"javascript:void(0)\" class=\"linkBtn btnDefault ok\"></a>";
	alertConfirmHtml += "<a href=\"javascript:void(0)\" class=\"linkBtn btnGray cancel\"></a>";
	alertConfirmHtml += "<a href=\"javascript:void(0)\" class=\"linkBtn btnDefault determine\"></a></div></div>";
	
	/* 页面通用弹出层--alertDialog--参数设置 */
	$.alertDialog.defaults = {
		title: "alert提示框标题",
		content: "alert提示框内容！",
		btnOk: "OK",
		id: ""
	};
	
	/* 页面通用弹出层--confirmDialog--参数设置 */
	$.confirmDialog.defaults = {
		title: "confirm提示框标题",
		content: "confirm提示框内容！",
		btnDetermine: "确定",
		btnCancel: "取消",
		id: ""
	};
	
	/* 模仿原生confirm--参数设置 */
	$.confirmReturn.defaults = {
		title: "Title",
		content: "Confirm",
		btnDetermine: "确定",
		btnCancel: "取消",
		id: "confirmReturn"
	};
	
	/* 页面通用弹出层--pageDialog--参数设置 */
	$.pageDialog.defaults = {
		width: "500px",
		height: "430px",
		title: "页面弹出框",
		src: "about:blank"
	};
	
	/*********************************************/
	/* 扩展jquery对象 */
	/*********************************************/
	
	$.fn.extend({
		
		/* textarea可输入字数显示 */
		textareaCheckWord: function(options, showBtn) {
			var defaults = {
				maxNum: 500,
				showDom: ""
			};
			var opts = $.extend({}, defaults, options);
			this.each(function() {
				var _this = $(this);
				$.fn.textareaCheckWord.control(_this, opts);
				_this.on("focus", function() {
					$.fn.textareaCheckWord.control(_this, opts);
				});
				if(/msie/i.test(navigator.userAgent)) {  //ie
					_this[0].onpropertychange = function() {
						$.fn.textareaCheckWord.control(_this, opts);
					};
				} else {  //非ie
					_this[0].addEventListener("input", function() {
						$.fn.textareaCheckWord.control(_this, opts);
					}, false);
				}
			});
			return this;
		}
		
	});
	
	/*********************************************/
	/* 暴露某些方法 */
	/*********************************************/
	
	/* textarea可输入字数显示--控制和操作 */
	$.fn.textareaCheckWord.control = function(_this, opts) {
		var val = _this.val();
		var num = fnStrCheckWord(_this, opts.maxNum);
		var $showDom = _this.siblings(opts.showDom);
		$showDom.find("em").text(num).css({"color": "#999"});
		if(num <= 0) {
			$showDom.find("em").text("0").css({"color": "red"});
		}
		if(num < 0) {
			_this.val(val.substring(0, 500));
		}
	};
	
})(jQuery);

/*******************************************************************/
/* jquery扩展 */
/*******************************************************************/

/*******************************************************************/
/* 公有函数定义 */
/*******************************************************************/

/* 返回中英文字符串的字数--maxNum为true代表可输入字数，maxNum为false或不传参数代表已输入字数 */
function fnStrCheckWord(_this, maxNum) {
	var value = _this.val(),
		lenW = value.length;
	if($.trim(value) == "" || value == _this.attr("vText")) {
		if(maxNum) {
			return maxNum;
		} else {
			return 0;
		}
	}
	if(maxNum) {
		return maxNum - lenW;
	} else {
		return lenW;
	}
}

/* 输入框文本提示--默认颜色 */
function inputJsTip(obj) {
	obj.each(function() {
		$(this).css({"color": "#ccc"});
		if($.trim($(this).val()) == "") {
			$(this).val($(this).attr("vText"));
		} else if($(this).val() != $(this).attr("vText")) {
			$(this).css({"color": "#464646"});
		}
	});
	obj.on("focus", function() {
		var _this = $(this);
		var value = _this.val();
		if(value == _this.attr("vText")) {
			_this.val("");
		}
		_this.css({"color": "#464646"});
	});
	obj.on("blur", function() {
		var _this = $(this);
		var value = _this.val();
		if($.trim(value) == "") {
			_this.val($(this).attr("vText")).css({"color": "#ccc"});
		}
	});
	obj.parents("form").on("submit", function() {
		obj.each(function() {
			var _this = $(this);
			if(_this.val() == _this.attr("vText")) {
				_this.val("");
			}
		});
	});
}

/* 输入框文本提示--自定义颜色 */
function inputJsDIY(obj, colorTip, colorTxt) {
	obj.each(function() {
		$(this).css({"color": colorTip});
		if($.trim($(this).val()) == "") {
			$(this).val($(this).attr("vText"));
		} else if($(this).val() != $(this).attr("vText")) {
			$(this).css({"color": colorTxt});
		}
	});
	obj.on("focus", function() {
		var _this = $(this);
		var value = _this.val();
		if(value == _this.attr("vText")) {
			_this.val("");
		}
		_this.css({"color": colorTxt});
	});
	obj.on("blur", function() {
		var _this = $(this);
		var value = _this.val();
		if($.trim(value) == "") {
			_this.val($(this).attr("vText")).css({"color": colorTip});
		}
	});
	obj.parents("form").on("submit", function() {
		obj.each(function() {
			var _this = $(this);
			if(_this.val() == _this.attr("vText")) {
				_this.val("");
			}
		});
	});
}

/* 判断文本框内容与vText的值是否一致 */
function judgeInputVal(obj) {
	obj.each(function() {
		if($(this).val() == $(this).attr("vText")) {
			$(this).val("");
		}
	});
}

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

/* 带遮罩的按钮宽、高自适应--函数定义 */
function fnBtnCoverModel(obj) {
	obj.each(function() {
		var _this = $(this);
		var width = _this.children(".btnCover").siblings("a").outerWidth();
		var height = _this.children(".btnCover").siblings("a").outerHeight() + 1;
		_this.children(".btnCover").width(width).height(height).children().width(width).height(height);
	});
}

/* 成功、失败提示框--函数定义 */
function promptSuccess(text, delay) {
	var html = "<div class=\"prompt-success\"><span></span></div>";
	if(!$(".prompt-success").size()) {
		$("body").append(html);
	}
	$(".prompt-success").show().children("span").text(text);
	var promptTimeout = setTimeout(function() {
		$(".prompt-success").hide()
	}, delay);
}
function promptFailure(text, delay) {
	var html = "<div class=\"prompt-failure\"><a class=\"close\" href=\"javascript:void(0)\"></a><span></span></div>";
	if(!$(".prompt-failure").size()) {
		$("body").append(html);
	}
	$.pageMask();
	$(".prompt-failure").show().children("span").text(text);
	$("body").on("click", ".prompt-failure .close", function() {
		$(".prompt-failure").hide();
		$(".pageMask").hide();
		return false;
	});
	var time = delay || 3000;
	var delaySetTimeout = setTimeout(function() {
		$(".prompt-failure").hide();
		$(".pageMask").hide();
	}, time);
}
function promptSuccessLong(text, delay) {
	var html = "<div class=\"prompt-success-long\"><span></span></div>";
	if(!$(".prompt-success-long").size()) {
		$("body").append(html);
	}
	$(".prompt-success-long").show().children("span").text(text);
	var promptTimeout = setTimeout(function() {
		$(".prompt-success-long").hide()
	}, delay);
}
function promptFailureLong(text, delay) {
	var html = "<div class=\"prompt-failure-long\"><a class=\"close\" href=\"javascript:void(0)\"></a><span></span></div>";
	if(!$(".prompt-failure-long").size()) {
		$("body").append(html);
	}
	$.pageMask();
	$(".prompt-failure-long").show().children("span").text(text);
	$("body").on("click", ".prompt-failure-long .close", function() {
		$(".prompt-failure-long").hide();
		$(".pageMask").hide();
		return false;
	});
	var time = delay || 3000;
	var delaySetTimeoutLong = setTimeout(function() {
		$(".prompt-failure-long").hide();
		$(".pageMask").hide();
	}, time);
}
function promptFailureBuy(text, linkText, linkURL) {
	var html = "<div class=\"prompt-failure-buy\"><a class=\"close\" href=\"javascript:void(0)\"></a><span class=\"text\"></span><div class=\"buyDiv\"><a class=\"buy\" href=\"javascript:void(0)\"></a></div></div>";
	if(!$(".prompt-failure-buy").size()) {
		$("body").append(html);
	}
	$.pageMask();
	$(".prompt-failure-buy").show().children(".text").text(text).end().find(".buy").text(linkText).attr("href", linkURL);
	$("body").on("click", ".prompt-failure-buy .close", function() {
		$(".prompt-failure-buy").hide();
		$(".pageMask").hide();
		return false;
	});
}
function promptFailureLongDH(text, delay) {
	var html = "<div class=\"prompt-failure-longDH\"><a class=\"close\" href=\"javascript:void(0)\"></a><span></span></div>";
	if(!$(".prompt-failure-longDH").size()) {
		$("body").append(html);
	}
	$.pageMask();
	$(".prompt-failure-longDH").show().children("span").text(text);
	$("body").on("click", ".prompt-failure-longDH .close", function() {
		$(".prompt-failure-longDH").hide();
		$(".pageMask").hide();
		return false;
	});
	var time = delay || 3000;
	var delaySetTimeoutLong = setTimeout(function() {
		$(".prompt-failure-longDH").hide();
		$(".pageMask").hide();
	}, time);
}
function promptFailureNoMask(text, delay) {
	var html = "<div class=\"prompt-failure\"><a class=\"close\" href=\"javascript:void(0)\"></a><span></span></div>";
	if(!$(".prompt-failure").size()) {
		$("body").append(html);
	}
	$.pageMask();
	$(".prompt-failure").show().children("span").text(text);
	$("body").on("click", ".prompt-failure .close", function() {
		$(".prompt-failure").hide();
		return false;
	});
	var time = delay || 3000;
	var delaySetTimeout = setTimeout(function() {
		$(".prompt-failure").hide();
	}, time);
}
function promptFailureLongNoMask(text, delay) {
	var html = "<div class=\"prompt-failure-long\"><a class=\"close\" href=\"javascript:void(0)\"></a><span></span></div>";
	if(!$(".prompt-failure-long").size()) {
		$("body").append(html);
	}
	$.pageMask();
	$(".prompt-failure-long").show().children("span").text(text);
	$("body").on("click", ".prompt-failure-long .close", function() {
		$(".prompt-failure-long").hide();
		return false;
	});
	var time = delay || 3000;
	var delaySetTimeoutLong = setTimeout(function() {
		$(".prompt-failure-long").hide();
	}, time);
}

/*******************************************************************/
/* 公有函数定义 */
/*******************************************************************/

/*******************************************************************/
/* 公有函数调用、公有交互 */
/*******************************************************************/

$(function() {
	
	/* fixedADImage页头宣传图片 */
	(function() {
		var $fixedADImage = $('#fixedADImage');
		var $fixedBar = $('#fixedBar');
		var HImage = $fixedADImage.outerHeight();
		var HBar = $fixedBar.outerHeight();
		if(!$fixedADImage.size()) {
			return false;
		}
		if(!(!-[1,] && !window.XMLHttpRequest)) {
			$fixedADImage.animate({
				top: 0
			}, 1000);
			$fixedBar.animate({
				top: HImage
			}, 1000);
			$('body').animate({
				paddingTop: HImage + HBar
			}, 1000);
			setTimeout(function() {
				$fixedADImage.animate({
					top: -HImage
				}, 1000, function() {
					$fixedADImage.remove();
				});
				$fixedBar.animate({
					top: 0
				}, 1000);
				$('body').animate({
					paddingTop: HBar
				}, 1000);
			}, 6000);
		} else {
			setTimeout(function() {
				$fixedADImage.animate({
					height: 0
				}, 1000, function() {
					$fixedADImage.remove();
				});
			}, 5000);
		}
	})();
	
	/* fixedBar宽度小于1200px时JS控制 */
	if(!(!-[1,]&&!window.XMLHttpRequest)) {
		var winWidth = $(window).width();
		if(winWidth < 1200) {
			$("#fixedBar .wrap").width(winWidth);
		} else {
			$("#fixedBar .wrap").width(1200);
		}
		$(window).resize(function() {
			winWidth = $(window).width();
			if(winWidth < 1200) {
				$("#fixedBar .wrap").width(winWidth);
			} else {
				$("#fixedBar .wrap").width(1200);
			}
		});
	}
	
	/* 页面右侧400电话和在线客服 */
	var PSIEnter = null, PSILeave = null;
	$(".pageSideIcons").on('mouseenter', function() {
		var _this = $(this);
		_this.children('i').addClass('over');
		//clearTimeout(PSILeave);
		PSIEnter = setTimeout(function() {
			_this.stop(true).animate({
				width: '151px'
			}, 200);
		}, 250);
	}).on('mouseleave', function() {
		var _this = $(this);
		_this.children('i').removeClass('over');
		clearTimeout(PSIEnter);
		PSILeave = setTimeout(function() {
			_this.stop(true).animate({
				width: '42px'
			}, 200);
		}, 250);
	});
	
	/* 页头登录后user下拉交互 */
	var loginUserStart = null;
	$(".loginUser").on("mouseenter", function() {
		var _this = $(this);
		clearTimeout(loginUserStart);
		loginUserStart = setTimeout(function() {
			_this.children(".loginUser_tit").addClass("tit_current").siblings(".loginUser_box").show();
		}, 200);
	}).on("mouseleave", function() {
		var _this = $(this);
		clearTimeout(loginUserStart);
		_this.children(".loginUser_tit").removeClass("tit_current").siblings(".loginUser_box").hide();
	});
	
	/* topWrap页头搜索区域scroll效果 */
	/*$(window).scroll(function() {
		var _topWrap = $(".topWrap");
		if($(window).scrollTop() > 110) {
			$("body").addClass("topScroll");
			if(!(_topWrap.is(":animated"))) {
				_topWrap.animate({
					top: "39px"
				}, 200);
			}
		} else {
			$("body").removeClass("topScroll");
			_topWrap.css({"top": "0px"});
		}
	});*/
	
	/* 网站导航交互 */
	$(".website_nav").on("mouseenter", function() {
		$(this).addClass("website_nav_h");
	}).on("mouseleave", function() {
		$(this).removeClass("website_nav_h");
	});
	
	/* 全部航线分类 */
	var _categoryAll = $("#categoryAll");
	var _category_SR = $("#category_SR");
	if($(".bannerWrap").size()) {
		$(".HD_title .icon", _categoryAll).hide();
		_category_SR.show();
	} else {
		$(".HD_title .icon", _categoryAll).show();
		_category_SR.hide();
		
		//所有分类--显示隐藏
		var stTime = null;
		_categoryAll.on("mouseenter", function() {
			clearTimeout(stTime);
			stTime = setTimeout(function() {
				_category_SR.show();
				$(this).find(".HD_title .icon").addClass("iconUp");
			}, 50);
		}).on("mouseleave", function() {
			clearTimeout(stTime);
			_category_SR.hide();
			$(this).find(".HD_title .icon").removeClass("iconUp");
		});
	}
	$(".listBox li", _category_SR).on("mouseenter", function() {
		$(this).addClass("liOver");
	}).on("mouseleave", function() {
		$(this).removeClass("liOver");
	});
	
	/* 返回顶部--函数调用 */
	backToTop($(".backToTop"));
	
	/* 输入框文本提示--函数调用 */
	inputJsTip($(".inputJsTip"));
	
	/* 输入框文本提示--函数调用 */
	fnBtnCoverModel($(".btnCoverModel"));
	
	/* 拼箱、整箱切换 */
	$(".web_search_selType").on("mouseenter", function() {
		$(this).children(".showBox").show().end().find(".arrow").addClass("arrowUp");
	}).on("mouseleave", function() {
		$(this).children(".showBox").hide().end().find(".arrow").removeClass("arrowUp");
	});
	$(".web_search_selType .showBox a").on("click", function() {
		var _this =  $(this);
		var mid = _this.attr("mid");
		var text = _this.text();
		var _textDom = _this.parents(".web_search_selType").find(".text");
		//var mid_t = _textDom.attr("mid");
		//var text_t = _textDom.text();
		_textDom.attr("mid", mid).text(text);
		//_this.attr("mid", mid_t).text(text_t);
		_this.parents(".showBox").hide();
	});
	
	/* 公用下拉框--dropDwon */
	$("body").on("click", ".dropDownShow, .dropDownShowBig", function(e) {
		$(".slide-model").hide();
		$(".dropDownWrap").css("z-index", "10");
		$(this).siblings(".dropDownSlide").show().parent().css("z-index", "11");
		e.stopPropagation();
	});
	$("body").on("click", ".dropDownSlide a", function() {
		var _this = $(this);
		var text = _this.children("span").text();
		var value = _this.children("span").attr("value");
		_this.closest(".dropDownWrap").find(".word").text(text).attr("title", text).attr("value", value);
	});
	$("body").click(function() {
		$(".slide-model").hide();
		$(".dropDownWrap").css("z-index", "10");
	});
});

/*******************************************************************/
/* 公有函数调用、公有交互 */
/*******************************************************************/