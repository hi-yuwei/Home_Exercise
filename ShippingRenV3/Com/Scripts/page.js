/*
* page.js
* author: Jack
* time: 2014-12-24
*/

/*******************************************************************/
/* 公有模块js */
/*******************************************************************/


/*******************************************************************/
/* 公有模块js */
/*******************************************************************/

/*******************************************************************/
/* index */
/*******************************************************************/
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
	
	/* indexSlideLR */
	$.fn.indexSlideLR = function(slideTime, delayTime) {
		return this.each(function() {
			var _this = $(this);
			var _LBtn = _this.find(".leftBtn"),
			_RBtn = _this.find(".rightBtn"),
			_imgUl = _this.find(".imgBox ul");
			if(_this.find(".imgBox li").size() == 0) {
				return;
			}
			var liOutWidth = _imgUl.children("li").outerWidth(true);
			var liNum = _imgUl.children("li").size();
			var visibleNum = Math.round(_this.width() / liOutWidth);
			var visibleWidth = liOutWidth * visibleNum;
			var start = null;
			var _prevDom = _imgUl.children("li:lt(" + (visibleNum) + ")").clone(true);
			var _nextDom = _imgUl.children("li:gt(" + (liNum - visibleNum - 1) + ")").clone(true);
			if(liNum == visibleNum) {
				_nextDom = _imgUl.children("li").clone(true);
			}
			if(liNum >= visibleNum) {
				_imgUl.append(_prevDom).prepend(_nextDom).css("margin-left", -visibleWidth);
			}
			//点击右侧按钮，图片向左滑动
			_RBtn.on("click", function() {
				if(liNum < visibleNum || _imgUl.is(":animated")) {
					return false;
				}
				var leftWidth = -parseInt(_imgUl.css("margin-left"));
				if(leftWidth >= visibleWidth + liOutWidth * liNum) {
					_imgUl.css("margin-left", -visibleWidth);
					leftWidth = visibleWidth;
				}
				_imgUl.animate({
					marginLeft: -(leftWidth + liOutWidth)
				}, slideTime);
			});
			//点击左侧按钮，图片向右滑动
			_LBtn.on("click", function() {
				if(liNum < visibleNum || _imgUl.is(":animated")) {
					return false;
				}
				var leftWidth = -parseInt(_imgUl.css("margin-left"));
				if(leftWidth <= 0) {
					_imgUl.css("margin-left", -(liOutWidth * liNum));
					leftWidth = liOutWidth * liNum;
				}
				_imgUl.animate({
					marginLeft: -(leftWidth - liOutWidth)
				}, slideTime);
			});
			//图片自动向左滑动
			if(liNum >= visibleNum) {
				start = setTimeout(slideLeftAuto, delayTime);
			}
			function slideLeftAuto() {
				if(!(_imgUl.is(":animated"))) {
					var leftWidth = -parseInt(_imgUl.css("margin-left"));
					if(leftWidth >= visibleWidth + liOutWidth * liNum) {
						_imgUl.css("margin-left", -visibleWidth);
						leftWidth = visibleWidth;
					}
					_imgUl.animate({
						marginLeft: -(leftWidth + liOutWidth)
					}, slideTime);
				}
				start = setTimeout(slideLeftAuto, delayTime);
			}
		});
	};
	
	/* indexSideSlide */
	$.fn.indexSideSlide = function() {
		return this.each(function() {
			var _this = $(this);
			var _ul = _this.children("ul");
			var size = _ul.children("li").size();
			var height = _ul.height();
			var step = 1;
			var pos = 0;
			var start = null;
			var lt = 0;
			if(size < 17) {
				lt = size;
			} else {
				lt = 17;
			}
			_ul.append(_ul.children("li:lt(" + lt + ")").clone(true));
			start = setTimeout(animation, 150);
			_this.hover(
				function() {
					clearTimeout(start);
				},
				function() {
					start = setTimeout(animation, 150);
				}
			);
			function animation() {
				pos += step;
				pos = (pos < height)? pos: 0;
				_ul.css({'top': -pos});
				start = setTimeout(animation, 150);
			}
		});
	};
	
})(jQuery);

$(function() {
	
	/* bannerSlide */
	$('.bannerSlideTab').bannerSlide(".bannerSlideImg", 1000, 6000, false);
	
	/* indexSlideLR */
	$('.indexSlideLR').indexSlideLR(500, 5000);
	
	/* indexSideSlide */
	$(".ISSlidePrice, .ISSlideRecord").indexSideSlide();
});
/*******************************************************************/
/* index */
/*******************************************************************/

/*******************************************************************/
/* index以外的所有页面 */
/*******************************************************************/
$(function() {
	
	/* 页面滚动--滚动条到底部，页面显示更多数据列表 
	$(window).scroll(function() {
		if($(window).scrollTop() == $(document).height() - $(window).height()) {
			$(".adminLoadingMarket").show();
			$(".marketListCont").append('<div class="list" style="height: 30px;">OK</div>');
			$(".adminLoadingMarket").hide();
		}
	});*/
	
	/*
	$.pageDialog({
		width: "700px",
		height: "430px",
		title: "页面弹出框",
		src: "about:blank"
	});
	$.confirmDialog({
		title: "confirm提示框标题",
		content: "您当前没有权限访问我的物流。您当前没有权限访问我的物流。您当前没有权限访问我的物流。",
		btnDetermine: "确定",
		btnCancel: "取消",
		id: ""
	});
	*/
	//promptFailureLong("ddddddddd", 3000)
	
	/* 新增航线 */
	$(".adminHangQuery .new").on("click", function() {
		$.pageMask();
		$(".newLineDialog").show();
	});
	$(".newLineDialog .close").on("click", function() {
		$(".pageMask").hide();
		$(".newLineDialog").hide();
	});
	
	/* 物流市场 */
	$(".marketCategory .cateOneBox ul").each(function() {
		var _this = $(this);
		if(_this.height() <= 84) {
			_this.parent().height("auto").siblings(".btnSlide").hide();
		}
	});
	$(".marketCategory .btnSlide").on("click", function() {
		var _this = $(this);
		var _ul = _this.siblings(".cateOneBox").children("ul");
		if(_this.hasClass("btnUp")) {
			_ul.parent().css({"height": "84px", "overflow-y": "hidden"});
			_this.removeClass("btnUp");
		} else {
			_ul.parent().css({"height": "112px", "overflow-y": "auto"});
			_this.addClass("btnUp");
		}
	});
	//选中条件效果
	$(".marketCategory .cateOneBox li a").on("click", function() {
		var _this = $(this);
		var value = _this.text();
		var _list = _this.parents(".list");
		var title = _list.children(".textTit").text();
		var cid = _list.attr("cid");
		var html = '<div class="chkOpt" cid="' + cid + '"><a class="text" href="javascript:void(0)">' + title + value + '</a>';
		html += '<a class="icon" href="javascript:void(0)">&nbsp;</a></div>';
		$(".cateCheckedOpts").append(html);
		_list.hide();
	});
	$("body").on("click", ".cateCheckedOpts .chkOpt", function() {
		var _this = $(this);
		var cid = _this.attr("cid");
		$(".marketCategory .list[cid='" + cid + "']").show();
		_this.remove();
	});
	
	/* 物流市场、货盘市场列表鼠标hover效果 */
	$(".marketListCont .topBox .list:last").css("border-bottom", "0px");
	$(".marketListCont .list").on("mouseenter", function() {
		$(this).addClass("over");
	}).on("mouseleave", function() {
		$(this).removeClass("over");
	});
	
	/* 选择班期--发布运价页面 */
	$(".publishForm .schedulePrice .box li a").on("click", function() {
		var _this = $(this);
		var _li = _this.parent();
		if(_li.hasClass("selected")) {
			_li.removeClass("selected");
		} else {
			_li.addClass("selected");
			if(_li.hasClass("budingqi")) {
				_li.siblings().removeClass("selected");
			} else {
				_li.siblings(".budingqi").removeClass("selected");
			}
		}
	});
	function fnSelSchedule() {
		var str = "";
		$(".publishForm .schedulePrice .box .selected").each(function() {
			str += $(this).attr("vid") + ",";
		});
		return str;
	}
	
	/* 发布货盘--运去哪帮您预估标准箱 */
	$(".estimate_standard_cabinet .txtTit").on("click", function() {
		$(".estimate_STCB_box").show();
	});
	$(".estimate_STCB_box .STCB_close").on("click", function() {
		$(".estimate_STCB_box").hide();
	});
	
	/* 帮助中心--menu */
	$(".helpMenu .title").on("click", function() {
		var _this = $(this);
		if(_this.parent().hasClass("present")) {
			_this.parent().removeClass("present");
		} else {
			_this.parent().addClass("present");
		}
	});
	$(".helpHowLinks a").on("click", function() {
		$(this).addClass("current").siblings().removeClass("current");
	});
	
	/* v1.1 */
	
	/* 精英计划 */
	$(".elitePlanSlide").indexSideSlide();
	
	/* 企业认证--删除上传图片 */
	$(".ENTCT_upload_img .cell").on("mouseenter", function() {
		$(this).children(".close").show();
	}).on("mouseleave", function() {
		$(this).children(".close").hide();
	});
	
	/* v1.2 */
	
	/* 详情--记录和评价tab切换 */
	$(".record_comment_tabs .tabs a").on("click", function() {
		var _this = $(this);
		var _a = $(".record_comment_tabs .tabs a");
		var vid = $.trim(_this.attr("vid"));
		if(vid == "record") {
			_a.removeClass("current");
			_this.addClass("current");
			$(".record_comment_record").show();
			$(".record_comment_comment").hide();
		} else {
			_a.removeClass("current");
			_this.addClass("current");
			$(".record_comment_comment").show();
			$(".record_comment_record").hide();
		}
	});
	
	/* 评价须知 */
	$(".evaluateKnowTip").on("mouseenter", function() {
		$(this).addClass("evaluateKnowOver");
	}).on("mouseleave", function() {
		$(this).removeClass("evaluateKnowOver");
	});
	
	/* 好评、中评、差评交互 */
	$(".evaluate_radio .cell input").on("click", function() {
		var _this = $(this);
		var tipTxt = _this.attr("tip");
		$(".evaluate_radio .cell span").hide();
		_this.siblings("span").show().parent().siblings(".tipTxt").text(tipTxt);
	});
	
	/* 评论输入框--输入内容交互 */
	$(".evaluate_input_box .textarea").textareaCheckWord({
		maxNum: 500,
		showDom: ".number"
	})
	
	/* 评论--星级评分 */
	$(".evaluate_selStar .selStar em").on("mouseenter", function() {
		var _this = $(this);
		var num = _this.prevAll(".star").size();
		var hoverTip = _this.attr("hoverTip");
		_this.parent().addClass("selStarHover");
		if(num < 2) {
			_this.addClass("hoverGray").prevAll(".star").addClass("hoverGray");
		} else {
			_this.addClass("hoverGold").prevAll(".star").addClass("hoverGold");
		}
		_this.siblings(".starNum").show().css({"left": (-6 + 20 * num) + "px"}).children("p").text(hoverTip);
	}).on("mouseleave", function() {
		var _this = $(this);
		_this.parent().removeClass("selStarHover");
		_this.removeClass("hoverGray hoverGold").siblings(".star").removeClass("hoverGray hoverGold");
		_this.siblings(".starNum").hide();
	});
	$(".evaluate_selStar .selStar em").on("click", function() {
		var _this = $(this);
		var num = _this.prevAll(".star").size();
		var clickTipA = _this.attr("clickTipA");
		var clickTipB = _this.attr("clickTipB");
		_this.removeClass("clickGray clickGold").siblings(".star").removeClass("clickGray clickGold");
		if(num < 2) {
			_this.addClass("clickGray").prevAll(".star").addClass("clickGray");
		} else {
			_this.addClass("clickGold").prevAll(".star").addClass("clickGold");
		}
		_this.parent().siblings(".noSelTip").hide().siblings(".clickTip").show().children("b").text(clickTipA).siblings("span").text(clickTipB);
	})
	
	/* 报价、砍价列表--更多筛选条件 */
	$(".quoteBargainSearch .moreSelOpts").on("click", function() {
		var _this = $(this);
		var _showDom = _this.parent().siblings(".moreSelOptsShow");
		if(_showDom.is(":hidden")) {
			_showDom.show();
			_this.addClass("moreSelOptsUp");
		} else {
			_showDom.hide();
			_this.removeClass("moreSelOptsUp");
		}
	});
	
	/* 上传图片模块--模板 */
	$(".upload_model_img .cell").on("mouseenter", function() {
		$(this).children(".close").show();
	}).on("mouseleave", function() {
		$(this).children(".close").hide();
	});
	
});

/*******************************************************************/
/* index以外的所有页面 */
/*******************************************************************/

/*******************************************************************/
/* v1.3 */
/*******************************************************************/
$(function() {
	/* 潜在客户管理/运费管理--列表通用--全选交互 */
	$("body").on("change", ".adminLineTitle .inputChk", function() {
		var _this = $(this);
		var _chk = _this.parents(".adminLineWrap").find(".adminLineList .inputChk");
		if(_this.is(":checked")) {
			_chk.prop("checked", true);
		} else {
			_chk.prop("checked", false);
		}
	});
	$("body").on("change", ".adminLineList .inputChk", function() {
		var _this = $(this);
		var _chkAll = _this.parents(".adminLineWrap").find(".adminLineTitle .inputChk");
		var numAll = _this.parents(".adminLineList").find(".inputChk").size();
		var numChk = _this.parents(".adminLineList").find(".inputChk:checked").size();
		if(numAll == numChk) {
			_chkAll.prop("checked", true);
		} else {
			_chkAll.prop("checked", false);
		}
	});
	
	/* 运费中心--表头、表尾--固定fixed */
	$(window).scroll(function() {
		//表头
		if($("#priceCLTitle").size()) {
			if($(window).scrollTop() >= $("#priceCLTitle").parent().offset().top - 39) {
				$("#priceCLTitle").addClass("priceCLTitleFixed");
			} else {
				$("#priceCLTitle").removeClass("priceCLTitleFixed");
			}
		}
		//表尾
		if($("#priceCenterOpts").size()) {
			if($("#priceCenterOpts").parent().offset().top - $(window).scrollTop() + 42 >= $(window).height()) {
				$("#priceCenterOpts").addClass("PRCTOptsFixed");
			} else {
				$("#priceCenterOpts").removeClass("PRCTOptsFixed");
			}
		}
	});
	//表尾--页面加载--判断是否显示
	if($("#priceCenterOpts").size()) {
		if($("#priceCenterOpts").parent().offset().top - $(window).scrollTop() + 42 >= $(window).height()) {
			$("#priceCenterOpts").addClass("PRCTOptsFixed");
		} else {
			$("#priceCenterOpts").removeClass("PRCTOptsFixed");
		}
	}
	
	/* 选择客户分组--弹出框 */
	$("#btnSelCustGroup").on("click", function() {
		var _newCustGroupDialog = $("#selCustGroupDialog");
		var width = _newCustGroupDialog.outerWidth();
		var height = _newCustGroupDialog.outerHeight();
		$.pageMask();
		_newCustGroupDialog.show().css({"margin-left": -(width / 2), "margin-top": -(height / 2)});
	});
	$("body").on("click", "#selCustGroupDialog .close, #selCustGroupDialog .btnCancel", function() {
		$("#selCustGroupDialog, .pageMask").hide();
	});
	
	/* 新建客户分组--弹出框 */
	$("#btnNewCustGroup").on("click", function() {
		var _newCustGroupDialog = $("#newCustGroupDialog");
		var width = _newCustGroupDialog.outerWidth();
		var height = _newCustGroupDialog.outerHeight();
		$.pageMask();
		_newCustGroupDialog.show().css({"margin-left": -(width / 2), "margin-top": -(height / 2)});
	});
	$("body").on("click", "#newCustGroupDialog .close, #newCustGroupDialog .btnCancel", function() {
		$("#newCustGroupDialog, .pageMask").hide();
	});
	
	/* 批量修改同运费--弹出框 */
	$("#btnPatchModifyPrice").on("click", function() {
		var _newCustGroupDialog = $("#patchModifyPrice");
		var width = _newCustGroupDialog.outerWidth();
		var height = _newCustGroupDialog.outerHeight();
		$.pageMask();
		_newCustGroupDialog.show().css({"margin-left": -(width / 2), "margin-top": -(height / 2)});
	});
	$("body").on("click", "#patchModifyPrice .close, #patchModifyPrice .btnCancel", function() {
		$("#patchModifyPrice, .pageMask").hide();
	});
	
	/* 提交缺失港口--弹出框 */
	$("#submitPortFixed").on("click", function() {
		var _newCustGroupDialog = $("#submitPortDialog");
		var width = _newCustGroupDialog.outerWidth();
		var height = _newCustGroupDialog.outerHeight();
		$.pageMask();
		_newCustGroupDialog.show().css({"margin-left": -(width / 2), "margin-top": -(height / 2)});
	});
	$("body").on("click", "#submitPortDialog .close, #submitPortDialog .btnCancel", function() {
		$("#submitPortDialog, .pageMask").hide();
	});
	
	/* 招标货盘--指定供应商 */
	$(".appointCustRd").on("click", function() {
		var mid = $(this).attr("mid");
		var _appointCustTip = $(this).parents(".palletType").siblings(".appointCustTip");
		var _appointCustShow = $(".appointCustShow");
		var _appointCustDialog = $("#appointCustDialog");
		var width = _appointCustDialog.outerWidth();
		var height = _appointCustDialog.outerHeight();
		switch(mid) {
			case "PM":
				_appointCustTip.hide();
				_appointCustShow.hide();
				break;
			case "CM":
				_appointCustTip.show();
				_appointCustShow.show();
				_appointCustDialog.show().css({"margin-left": -(width / 2), "margin-top": -(height / 2)});
				$.pageMask();
				break;
		}
	});
	$(".appointCustBtn").on("click", function() {
		var _appointCustDialog = $("#appointCustDialog");
		var width = _appointCustDialog.outerWidth();
		var height = _appointCustDialog.outerHeight();
		_appointCustDialog.show().css({"margin-left": -(width / 2), "margin-top": -(height / 2)});
		$.pageMask();
	});
	$("body").on("click", "#appointCustDialog .close", function() {
		$("#appointCustDialog, .pageMask").hide();
	});
	
	/* 提现--选择银行 */
	$("#CDSelBank, #CDSelBankShow").on("click", function(e) {
		$("#CDSelBankShow").show();
		e.stopPropagation();
	});
	$("#CDSelBankShow li").on("click", function(e) {
		var _this = $(this);
		var vid = _this.attr("vid");
		var text = _this.children(".image").text();
		$("#CDSelBankShow .radio").prop("checked", false);
		_this.children(".radio").prop("checked", true);
		$("#CDSelBankShow").hide();
		$("#CDBankArea").text($.trim(text)).attr("vid", vid);
		e.stopPropagation();
	});
	$("body").on("click", function() {
		$("#CDSelBankShow").hide();
	});
	
	/* 提现--弹出框 */
	$(".cashCoupon .TXLink").on("click", function() {
		$(".cashDialog").show();
		$.pageMask();
	});
	$("body").on("click", ".cashDialog .titBox .close", function() {
		$(".cashDialog").hide();
		$(".pageMask").hide();
	});
	
	/* 左侧边栏--导航--sideMenu */
	$(".adminMenu dt a").on("click", function() {
		var _this = $(this);
		var _dd = _this.parent().siblings("dd");
		if(_dd.size()) {
			if(_dd.is(":visible")) {
				_dd.hide();
				_this.children("em").addClass("down");
			} else {
				_dd.show();
				_this.children("em").removeClass("down");
			}
		}
	});
	
	/* 品牌物流商--搜索focus */
	$(".brandLogSrch .input").on("focus", function() {
		var _parent = $(this).parent();
		var src_2 = _parent.attr("src_2");
		_parent.css("background-image", "url(" + src_2+ ")");
	}).on("blur", function() {
		var _this = $(this);
		var _parent = _this.parent();
		var src_1 = _parent.attr("src_1");
		var src_2 = _parent.attr("src_2");
		var value = $.trim(_this.val());
		if(value == "") {
			_this.val("");
			_parent.css("background-image", "url(" + src_1+ ")");
		} else {
			_parent.css("background-image", "url(" + src_2+ ")");
		}
	});
	
	/* 品牌物流商--弹出地图层 */
	/*$("body").on("click", ".brandLogList .image, .brandLogList .company a, .brandLogList .addrIcon", function() {
		$("#brandLogDialog").show();
		$.pageMask();
	});
	$("body").on("click", ".brandLogDialog .close", function() {
		$("#brandLogDialog").hide();
		$(".pageMask").hide();
	});*/
	
	/* 后台管理中心--手机认证弹出层 */
	var RZModelStart = null;
	$(".mngCent_user .RZModel").on("mouseenter", function() {
		clearTimeout(RZModelStart);
		$(".mngCent_user .RZBox").hide();
		$(this).children(".RZBox").show();
	}).on("mouseleave", function() {
		var _this = $(this);
		RZModelStart = setTimeout(function() {
			_this.children(".RZBox").hide();
		}, 200);
	});
});
/*******************************************************************/
/* v1.3 */
/*******************************************************************/

/*******************************************************************/
/* v1.6 */
/*******************************************************************/
$(function() {
	/* v1.6 */
	$(".nIndexHot li").on('mouseenter', function() {
		var _this = $(this);
		var _h2 = _this.children('h2');
		var _h3 = _this.children('h3');
		var _layer = _this.children('.layer');
		_h3.text(_h3.attr('text2'));
		_h2.stop().animate({
			top: '20px'
		}, 300);
		_layer.stop().animate({
			height: '140px'
		}, 300);
	}).on('mouseleave', function() {
		var _this = $(this);
		var _h2 = _this.children('h2');
		var _h3 = _this.children('h3');
		var _layer = _this.children('.layer');
		_h3.text(_h3.attr('text1'));
		_h2.stop().animate({
			top: '60px'
		}, 300);
		_layer.stop().animate({
			height: '50px'
		}, 300);
	});
	
});
/*******************************************************************/
/* v1.6 */
/*******************************************************************/

/*******************************************************************/
/* v2.0 */
/*******************************************************************/
$(function() {
	/* 委托页面--选择委托报关、委托拖车 */
	/*$(document).on('click', '.entrustTypeCheck .check', function() {
		var _this = $(this);
		var _li = _this.parent();
		if(_li.hasClass('checked')) {
			_li.removeClass('checked');
		} else {
			_li.addClass('checked');
		}
	});*/
	
	/* 委托页面--选择 拖车+报关、仅报关、仅拖车 */
	$(document).on('mouseenter', '.entrustFirstSel li', function() {
		$(this).addClass('hover');
	}).on('mouseleave', '.entrustFirstSel li', function() {
		$(this).removeClass('hover');
	}).on('click', '.entrustFirstSel li', function() {
		$(this).addClass('select').siblings().removeClass('select');
	});
	
	/* 委托页面--保存、再次编辑交互 */
	$(document).on('click', '.entrustSaveBtn', function() {
		var _this = $(this);
		var _entrustSection = _this.parents('.entrustSection');
		_entrustSection.find('.entrustEditBox').hide().siblings('.entrustViewBox').show();
		_entrustSection.find('.entrustBtnBox .saveBox').hide().siblings('.editBox').show();
	});
	$(document).on('click', '.entrustEditAgain', function() {
		var _this = $(this);
		var _entrustSection = _this.parents('.entrustSection');
		_entrustSection.find('.entrustEditBox').show().siblings('.entrustViewBox').hide();
		_entrustSection.find('.entrustBtnBox .saveBox').show().siblings('.editBox').hide();
	});
	
	/* 委托页面--上传文件交互 */
	$(document).on('mouseenter', '.entrustUploadList .imgBox', function() {
		if($(this).has('.loading').size() == 0) {
			$(this).children('.opts').show();
		}
	}).on('mouseleave', '.entrustUploadList .imgBox', function() {
		$(this).children('.opts').hide();
	});
	
	/* 添加联系人--全选与单选 */
	(function() {
		var $iframeSelUserAll = $("#iframeSelUserAll");
		var $selMemsShow = $(".selMemsShow ul");
		var selMemsHtml = "<li><span class=\"name\">陈同学</span><a class=\"close\" href=\"#;\"></a></li>";
		$iframeSelUserAll.prop('checked', false);
		$(".iframeSelUserChk").prop('checked', false);
		$iframeSelUserAll.change(function () {
			var _this = $(this);
			var $chk = $(".iframeSelUserChk");
			var id = "", vid = "", name = "";
			if ($(this).is(":checked")) {
				$chk.filter(":not(:checked)").each(function() {
					id = $(this).attr("id");
					vid = $(this).attr("vid");
					name = $(this).parent().siblings(".name").text();
					if(selMemsOver50()) {
						$.alertDialog({
							title: "联系人数量过多",
							content: "选择的联系人数量不能超过50！",
							btnOk: "OK",
							id: ""
						});
						_this.prop('checked', false);
						return false;
					}
					$(this).prop('checked', true);
					$(selMemsHtml).appendTo($selMemsShow).attr({"sid": id, "vid": vid}).find("span").text(name);
				});
			} else {
				$chk.each(function() {
					id = $(this).attr("id");
					$selMemsShow.children("[sid = " + id + "]").remove();
				});
				$chk.prop('checked', false);
			}
		});
		$("body").delegate(".iframeSelUserChk", "change", function () {
			var $chk = $(".iframeSelUserChk");
			var chkNum = $chk.size(), checkedNum = $chk.filter(":checked").size();
			var id = $(this).attr("id");
			var vid = $(this).attr("vid");
			var name = $(this).parent().siblings(".name").text();
			if (chkNum == checkedNum) {
				$iframeSelUserAll.prop('checked', true);
			} else {
				$iframeSelUserAll.prop('checked', false);
			}
			if ($(this).is(":checked")) {
				if(selMemsOver50()) {
					$.alertDialog({
						title: "联系人数量过多",
						content: "选择的联系人数量不能超过50！",
						btnOk: "OK",
						id: ""
					});
					$(this).prop('checked', false);
					$iframeSelUserAll.prop('checked', false);
					return false;
				}
				$(selMemsHtml).appendTo($selMemsShow).attr({"sid": id, "vid": vid}).find("span").text(name);
			} else {
				$selMemsShow.children("[sid = " + id + "]").remove();
			}
		});
		$(".selMemsShow").delegate(".close", "click", function () {
			var id = $(this).parent().attr("sid");
			$(this).parent().remove();
			if($("#" + id).is(":visible")) {
				$("#" + id).prop('checked', false);
				$iframeSelUserAll.prop('checked', false);
			}
		});
		function selMemsOver50() {
			var sum = $selMemsShow.children("li").size();
			if(sum >= 50) {
				return true;
			} else {
				return false;
			}
		}
		function selMemsMatch() {
			var $chk = $(".iframeSelUserChk");
			var mems = new Array();
			$(".selMemsShow li").each(function() {
				mems.push($(this).attr("sid"));
			});
			$chk.each(function() {
				var _this = $(this);
				var id = _this.attr("id");
				for(var i = mems.length - 1; i >= 0; i--) {
					if(id == mems[i]) {
						_this.prop('checked', true);
						break;
					}
				}
			});
			var chkNum = $chk.size(), checkedNum = $chk.filter(":checked").size();
			if (chkNum == checkedNum) {
				$iframeSelUserAll.prop('checked', true);
			} else {
				$iframeSelUserAll.prop('checked', false);
			}
		}
	})();
	
	/* 弹出层交互 */
	/*$(document).on('click', '.btnMid', function() {//显示弹出层示例
		$('#orderViewDialog_1').show().css('margin-top', -($('#orderViewDialog_1').outerHeight() / 2));
		$.pageMask();
	});*/
	$(document).on('click', '.pageDialogDiv .close', function() {//关闭弹出层示例
		$('.pageDialogDiv').hide();
		$('.pageMask').hide();
	});
	
	/* 弹出层--商品编码 */
	$(document).on('click', '.customsFormOrd .MDSMbtn', function() {//显示弹出层示例
		$('#commodityCodeDiv').show().css('margin-top', -($('#commodityCodeDiv').outerHeight() / 2));
		$.pageMask();
	});
	
	/* 创建报关费用--附加费交互 */
	$(document).on('click', '#addExtraCharge', function() {
		var _this = $(this);
		var _list = _this.parent();
		var _copyList = _list.clone(true);
		_copyList.addClass('appendList').find('.inputTitle').text(' ').siblings('.formAddSome').addClass('formRemoveThis').removeClass('formAddSome').prop('id', '');
		if(_list.siblings('.appendList').size() >= 15) {
			$.alertDialog({
				title: "提示",
				content: "添加不能超过15条",
				btnOk: "确定",
				id: ""
			});
			return false;
		}
		if(_list.siblings('.appendList').size() == 0) {
			_list.after(_copyList);
		} else {
			_list.siblings('.appendList:last').after(_copyList);
		}
	});
	$(document).on('click', '.formRemoveThis', function() {
		$(this).parent().remove();
	});
	
	/* 订单详情页面--模块折叠与展开 */
	$('.orderDetailTitle').on('click', function() {
		var _this = $(this);
		var _arrow = _this.children('.arrow');
		if(_arrow.size() == 0) {
			return false;
		}
		if(_arrow.hasClass('arrUp')) {
			_arrow.removeClass('arrUp');
			_this.siblings('.orderDetailBox').hide();
		} else {
			_arrow.addClass('arrUp');
			_this.siblings('.orderDetailBox').show();
		}
	});
	
	/* 订单详情页面--上传文件数hover--浮出层 */
	$(document).on('mouseenter', '.uploadFileNumAct', function() {
		var _this = $(this);
		var offLeft = _this.offset().left;
		var offTop = _this.offset().top;
		$('#uploadFileNumLayer').show().css({'left': offLeft - 533, 'top': offTop + 20});
	}).on('mouseleave', '.uploadFileNumAct', function() {
		$('#uploadFileNumLayer').hide();
	});
	$(document).on('mouseenter', '.uploadFileNumLayer', function() {
		$(this).show();
	}).on('mouseleave', '.uploadFileNumLayer', function() {
		$(this).hide();
	});
	
	/* 拖车报关奖励 */
	$(".pageAwardPerson .content").indexSideSlide();
	
	/* 订单中心--显示奖品 */
	$('.activityAwardView .box').on('mouseenter', function() {
		$(this).children('.showAward').show();
	}).on('mouseleave', function() {
		$(this).children('.showAward').hide();
	});
	
	/* 拖车报关信息汇总页面--tab切换与定位 */
	$(window).scroll(function() {
		if($('#orderGatherTabs').size()) {
			if($(window).scrollTop() + 31 >= $('#orderGatherTabs').offset().top) {
				$('#orderGatherTabs').addClass('orderGatherTabsFixed');
			} else {
				$('#orderGatherTabs').removeClass('orderGatherTabsFixed');
			}
		}
	});
	$('#orderGatherTabs .tab').on('click', function() {
		var _this = $(this);
		var mid = _this.attr('mid');
		var offsetTop = $('#' + mid).offset().top;
		$(window).scrollTop(offsetTop - 27);
		_this.parent().addClass('current').siblings('li').removeClass('current');
	});
	
});
/*******************************************************************/
/* v2.0 */
/*******************************************************************/

/*******************************************************************/
/* v2.1 */
/*******************************************************************/
$(function() {
	/* v2.1首页--拖车报关服务快速入口--选择类型 */
	$('.orderForm .selType').on('click', function() {
		var _this = $(this);
		if(_this.hasClass('typeChecked')) {
			_this.removeClass('typeChecked');
		} else {
			_this.addClass('typeChecked');
			if(_this.hasClass('KYType')) {
				_this.siblings('.TCHYType').removeClass('typeChecked');
			} else {
				_this.siblings('.KYType').removeClass('typeChecked');
			}
		}
	});
	
	/* 附加费用说明--弹出层 */
	$('.TCBG_priceCal .txtTip a').on('click', function() {
		$('#additionalCostDialog').show().css('margin-top', -$('#additionalCostDialog').outerHeight() / 2);
	});
	
	/* checkbox多选框交互 */
	$('.formCHK').on('click', function() {
		var _this = $(this);
		if(_this.hasClass('CHKChecked')) {
			_this.removeClass('CHKChecked');
		} else {
			_this.addClass('CHKChecked');
		}
	});

	/* 费用总计模块fixed */
	if($('.IWantEntrust').size()) {
		$(window).scroll(function() {
			var sideTop = $('.palletSide').offset().top;
			if($(window).scrollTop() >= sideTop - 11) {
				$('.IWantEntrust').addClass('IWE_fixed');
			} else {
				$('.IWantEntrust').removeClass('IWE_fixed');
			}
		});
	}
});
/*******************************************************************/
/* v2.1 */
/*******************************************************************/

/*******************************************************************/
/* v2.2 */
/*******************************************************************/
$(function() {
	/* 海运整箱--货量 */
	$('#knowBZGSL').on('change', function() {
		$('.infoBZGSL').show();
		$('.infoZLHTJ').hide();
	});
	$('#knowZLHTJ').on('change', function() {
		$('.infoBZGSL').hide();
		$('.infoZLHTJ').show();
	});
	
	/* 班期 */
	$(".palletSchedule li").on("click", function() {
		var _li = $(this);
		if(_li.hasClass("selected")) {
			_li.removeClass("selected");
		} else {
			_li.addClass("selected");
			if(_li.hasClass("unscheduled")) {
				_li.siblings().removeClass("selected");
			} else {
				_li.siblings(".unscheduled").removeClass("selected");
			}
		}
	});
	
	/* 我的货盘--更多搜索条件 */
	$(".moreSearchLink").on("click", function() {
		if($('.moreSearchList').is(':hidden')) {
			$('.moreSearchList').show();
			$(this).children('em').addClass('up');
		} else {
			$('.moreSearchList').hide();
			$(this).children('em').removeClass('up');
		}
	});
	
	/* 报价详情--弹出层 */
	$(document).on('click', '.ptDTCTLookBtn', function() {
		$('#ptQuoteDetailDialog').show().css('margin-top', -$('#ptQuoteDetailDialog').outerHeight() / 2);
		$.pageMask();
	});
	
	/* 发布货盘、报价--提示文本 */
	(function() {
		var start = null;
		$(document).on('mouseover', '.iconTextTip', function() {
			clearTimeout(start);
			$(this).children('.show').show();
		}).on('mouseleave', '.iconTextTip', function() {
			var _this = $(this);
			start = setTimeout(function() {
				_this.children('.show').hide();
			}, 150);
		});
	})();
	
	/* 货盘列表--港口浮出层 */
	$(document).on('mouseenter', '.GKLayerMD', function() {
		$(this).children('.showBox').show().parents('.list');
	}).on('mouseleave', '.GKLayerMD', function() {
		$(this).children('.showBox').hide().parents('.list');
	});
	
	/* 对账单详情--全选、单选交互 */
	$("body").on("change", ".palletListTitle .checkAll", function() {
		var _this = $(this);
		var _chk = $('.palletListCont .checkOne');
		if(_this.is(":checked")) {
			_chk.prop("checked", true);
		} else {
			_chk.prop("checked", false);
		}
	});
	$("body").on("change", ".palletListCont .checkOne", function() {
		var _this = $(this);
		var _chkAll = $(".palletListTitle .checkAll");
		var numAll = $('.palletListCont .checkOne').size();
		var numChk = $('.palletListCont .checkOne:checked').size();
		if(numAll == numChk) {
			_chkAll.prop("checked", true);
		} else {
			_chkAll.prop("checked", false);
		}
	});
	
});
/*******************************************************************/
/* v2.2 */
/*******************************************************************/



/*******************************************************************/
/* v2.4 */
/* 快速服务入口（拖车，内装，报关） */
/* Beck 2015-09-15*/
/*******************************************************************/
$(function(){
	var lis=$(".topBoxUl li");
	var divs=$(".orderFormBoxs>div");
	var error=$(".errorhidden");
	lis.click(function(){
		var index=$(this).index();
		if(index!="0"){
			error.html("");	//清空错误提醒。
		}
		else{
			error.html("请输入箱货数量");
		}
		$(this).addClass("current").siblings().removeClass("current");	//修改选项卡区域显示模式
		divs.eq(index).css("display","block").siblings().css("display","none");	//修改内容区域显示模式
	})
})