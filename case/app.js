var commonFun = {
	checkMoblie: function(id) {
		var _temp = $('#' + id),
			_mobile = /^1[0-9]{10}$/,
			_patternsMobile = /^(([0\+]\d{2,3}-)?(0\d{2,3}))(\d{7,8})(-(\d{3,}))?$/;
		if ($.trim(_temp.val()).length > 0) {
			switch ($.trim(_temp.val()).substring(0, 1)) {
				case '0' : // 小灵通
					if (!_patternsMobile.test(_temp.val())) {
						alert('您输入的小灵通号码不正确');
						_temp.focus();
						return false;
					}
					break;
				case '1' : // 手机
					if (_temp.val().length < 11 || !_mobile.test(_temp.val())) {
						alert('您输入的手机号码不正确');
						_temp.focus();
						return false;
					}
					break;
				default :
					alert('您输入的手机号码不正确');
					_temp.focus();
					return false;
					break;
			}
			return true;
		}
		return false;
	},
	isMobile:function(){
		var winW = $(window).width();
		if(winW <= 510){
			return true;
		}
		else{
			return false;
		}
	}
};

var indexFun = {
	doFun:function(){
		this.banner();
		this.tabT();
		this.listSth();
	},
	banner: function () {
		var mySwiper = new Swiper('.swiper-container',{
			pagination: '.pagination',
			loop:true,
			grabCursor: true,
			autoplay:7000,
			paginationClickable: true
		});
		$('#banner .prev').on('click', function(e){
			e.preventDefault();
			mySwiper.swipePrev();
		});
		$('#banner .next').on('click', function(e){
			e.preventDefault();
			mySwiper.swipeNext();
		});
	},
	tabT:function () {
		var trigger = $('.trigger-cont').find('.trigger-title'),
			tabCont = $('.tab-main');

		$.each(trigger,function (index) {
			var _this = $(this);
			_this.mouseover(function () {
				_this.addClass('cur').siblings().removeClass('cur');
				tabCont.eq(index).addClass('cur').siblings().removeClass('cur');
			})
		})
	},
	listSth:function () {
		var boxW = $('.tab-main').find('.list-box'),
			liL =boxW.find('.list-ui').find('.list-item'),
			liW = liL.width(),
			liLength = liL.length,
			liMargin = parseInt(liL.eq(0).css('marginRight'));

		var btn = $('.list-btn');

		boxW.css({width:liW*liLength+(liLength-1)*liMargin});

		var mainW = $('.main-list').width();


	}

};
var header = {
	doFun:function(){
		this.menuToggle();
		this.menuFold();
		this.inputSearch();
		var winW = $(window).width();
		if(winW>780){
			header.subMenu();
		}
		else {
			header.mobileMenu();
		}
	},
	subMenu:function () {
		var liNav = $('.ui-nav-item');

		var statue = true;

		liNav.hover(function () {
			if(statue == true){
				statue = false;
				setTimeout(function () {
					statue = true;
				},300);
			}
			$(this).find('.J-sub-menu').stop().filter(':not(:animated)').slideDown('300');
		},function () {
			$(this).find('.J-sub-menu').stop().slideUp('300');
		});
	},
	mobileMenu:function () {
		var moLi = $('.menu').find('.ui-nav-item');

		var statue = true;

		moLi.click(function () {
			if(statue == true){
				statue = false;
				setTimeout(function () {
					statue = true;
				},300);
			}
			var _this = $(this);
			if(_this.find('.J-sub-menu').css('display')=='none'){
				_this.addClass('curr').siblings().removeClass('curr');
				_this.find('.J-sub-menu').slideDown('300').parent().siblings().find('.J-sub-menu').slideUp('300');
				/*_this.siblings().find('.J-sub-menu').slideUp('300');*/
			}
			else {
				_this.find('.J-sub-menu').slideUp('300');
				_this.removeClass('curr');
			}
		})
	},
	menuToggle:function(){
		var btn = $('.menu-btn'),
			navMenu = $('.header').find('.menu');
		btn.click(function (e) {
			e.stopPropagation();
			if(!btn.hasClass('cur')){
				btn.css({left:'88%'});
				btn.find('span').css({background:'#fff'});
				setTimeout(function () {
					btn.addClass('cur');
				},300);
				navMenu.addClass('cur');
			}
			else {
				btn.css({left:'20px'});
				btn.find('span').css({background:'#666'});
				setTimeout(function () {
					btn.removeClass('cur');
				},300);
				navMenu.removeClass('cur');
			}
		})
	},
	menuFold:function () {
		var winW = $(window).width();
		if(winW<=780){
			$('.ui-bg').click(function (e) {
				e.stopPropagation();
				var btn = $('.menu-btn'),
					navMenu = $('.header').find('.menu');

				if(btn.hasClass('cur')){
					btn.css({left:'20px'});
					btn.find('span').css({background:'#666'});
					setTimeout(function () {
						btn.removeClass('cur');
					},300);
					navMenu.removeClass('cur');
				}
			})
		}
	},
	inputSearch:function () {
		var btn = $('.form-search');
		btn.hover(function () {
			$('.search-input').addClass('cur');
		},function () {
			$('.search-input').removeClass('cur');
		});
		$('.search-input').focus(function () {
			if($.trim($('.search-input').val())=='SEARCH'){
				$('.search-input').val('').css({color:'#fff'});
			}
		});
		$('.search-input').blur(function () {
			if($.trim($('.search-input').val())==''){
				$('.search-input').val('SEARCH').css({color:'#1469a8'});
			}
		})
	}
};

var toTop = {
	doFun: function(){
		this.toTop();
	},
	toTop:function () {
		var btn = $('.share-icon');

		btn.click(function () {
			$('body,html').animate({scrollTop:'0'},300);
			return false;
		})
	}

};


//超出文字部分省略
var obj = {
	txtLenth: function (tar) {
		this.maxWidth(tar);
	},
	maxWidth: function (tar) {
		$(tar).each(function(){
			var txtWidth = 30;
			if($(this).text().length > txtWidth){
				$(this).text($(this).text().substring(0,txtWidth));
				$(this).html($(this).html() + '...');
			}
		})
	}
};
var contactSubmit= {
	doFun:function(){
		this.inputFocus();
		this.contactSubmit();
	},
	inputFocus:function(){
		var aLi = $('.contact-item');

		aLi.click(function () {
			var _this = $(this);
			_this.find('.item-name').hide();
			_this.find('.ui-input').css({background:'rgba(255,255,255,.8)'});
			_this.find('.ui-input').focus();
			_this.find('.ui-textarea').focus();
		});

		aLi.find('.ui-input').focus(function () {
			var _this = $(this),
				itemName = _this.siblings('.item-name');
			if($.trim(_this.val())==''){
				_this.css({background:'rgba(255,255,255,.8)'});
				itemName.hide();
			}
		});

		aLi.find('.ui-textarea').focus(function () {
			var _this = $(this),
				itemName = _this.siblings('.item-name');
			if($.trim(_this.val())==''){
				_this.css({background:'rgba(255,255,255,.8)'});
				itemName.hide();
			}
		});

		aLi.find('.ui-input').blur(function () {
			var _this = $(this),
				itemName = _this.siblings('.item-name');
			if($.trim(_this.val())==''){
				_this.css({background:'rgba(255,255,255,.4)'});
				itemName.show();
			}
		});

		aLi.find('.ui-textarea').blur(function () {
			var _this = $(this),
				itemName = _this.siblings('.item-name');
			if($.trim(_this.val())==''){
				_this.css({background:'rgba(255,255,255,.4)'});
				itemName.show();
			}
		});

	},
	contactSubmit : function () {
		$('#btn-submit').attr('disabled', false).val('Submit');
		$('#btn-submit').click(function() {
			var flag = true;
			var btn = $(this);
			var contactObj = $('#contact_form').serializeArray();

			var submitObj = [];

			$.each(contactObj, function() {
				var inputObj = $('input[name="' + this.name + '"], textarea[name="' + this.name + '"]');

				if (this.name == 'pay' || this.name == 'way') {
					var contactName = inputObj.parents().find('span.item-name').html();
				} else {
					var contactName = inputObj.parent().find('span').html();
				}
				if ($.trim(this.value) == '') {
					alert('Please enter your ' + contactName);
					inputObj.focus();
					flag = false;
					return false;
				} else {
					if (this.name == 'contact_tel') {
						var _mobile = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i;
						if (!_mobile.test(inputObj.val())) {
							flag = false;
							alert('The TEL number you enter is wrong');
							inputObj.focus();
							return false;
						}
					}
					if (this.name == 'contact_email') {
						var _regeMail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
						if (!_regeMail.test(inputObj.val())) {
							flag = false;
							alert('The E-mail you enter is wrong!');
							inputObj.focus();
							return false;
						}
					}
					submitObj.push({name : contactName, value : this.value});
				}
			});

			//文本框 其它需求
			var _name2 = $('.contact-main .item-name').html();
			var _str2 = $('.contact-main').find('textarea').val();
			submitObj.push({name : _name2, value : _str2});

			if (flag) {
				btn.attr('disabled', true).val('In the submission');
				$.post('/api/contactForm', {contactForm : JSON.stringify(submitObj), contactHash : $('#contact-hash').val()},
					function(data) {
						switch (data.errcode) {
							case 0 :
								btn.val('Has been submitted ');
								alert('Submitted successfully');
								break;
							default :
								alert(data.errmsg);
								break;
						}
					}, 'json');
			}
		})
	},
};
var Tools = {
	archives : {
		view: function (id) {
			if (id > 0)
				$.post('/api/archives/view', {
					id: id
				});
		},
		search: function () {
			$('.search-btn').click(function () {
				var _q = $('#keywords');
				if (_q.val().trim().length == 0 || (_q.val() == 'SEARCH')) {
					_q.focus();
					alert('Please enter the name of the product you want to search');
					return false;
				} else {
					var data = $.trim($('#keywords').val());
					if(data==""){
						data="您搜索的内容为空！";
					}
					var _url = '/search/';
					// if (parseInt($(this).data("id")) == 1) {
					// 	window.location.href =  '/en/search/' + encodeURIComponent(data);
					// } else {
					// 	window.location.href =  '/search/' + encodeURIComponent(data);
					// }
					window.location.href =  '/search/' + encodeURIComponent(data);
					$('#keywords').val('');
				}

			});

			if ($('#keywords').val() != 'SEARCH') {
				$('#keywords').css({ color: "#fff" });
			}
			$('#keywords').focus(function () {
				var _this = $(this);
				_this.val("").css({ color: "#fff" });
				_this.keyup(function () {
					_this.attr("data-val", $.trim(_this.val()));
				});
			});
		}
	}
};

var service = {
	doFun:function () {
		this.serviceTab();
	},
	serviceTab:function () {
		var num = 0;

		var tabHead = $('.ui-tab').find('.item-head'),
			tabBtn = $('.tab-btn');

		var statue= true;

		var tabLength = $('.tab-content').find('.tab-main').length;

		$.each(tabHead,function (index) {
			var _this = $(this);
			_this.mouseover(function () {
				num = $(this).index();
				if(statue == true){
					statue = false;
					setTimeout(function () {
						statue = true;
					},300)
				}
				_this.addClass('cur').siblings().removeClass('cur');
				$('.tab-main').eq(num).addClass('cur').siblings().removeClass('cur');
			})
		});
		tabBtn.click(function () {
			num++;
			if(num == tabLength){
				num = 0;
			}
			tabHead.eq(num).addClass('cur').siblings().removeClass('cur');
			$('.tab-main').eq(num).addClass('cur').siblings().removeClass('cur');
		});
	}
};
var proDetail = {
	doFun:function () {
		var winW = $(window).width();
		if (winW>780){
			proDetail.proSth();
		}
		else {
			proDetail.proSth();
		}
	},
	proSth:function () {
		var proImg = $('.pro-img');
		$(window).scroll(function () {
			var docH = $(document).height();
			var docTop = $(document).scrollTop();
			var gap = $('.index-cumic').height()+$('.index-footer').height();
			var winH = $(window).height();
			//console.log(docH);
			//console.log(docTop);
			//console.log(gap);
			//console.log(winH);
			//总体的文档高度-文档卷去的高度-可视窗口的高度(得到的是底部剩余的高度);
			if(docH - docTop - winH <= gap){
				proImg.addClass('curr');
			}
			else {
				proImg.removeClass('curr');
			}
		})
	}
};
var contact = {
	doFun: function(){
		this.bdMap();
	},
	bdMap: function () {
		var data = [
			{
				'jwNum1': '121.578073',
				'jwNum2': '31.272776',
				'title': '<strong style="color:#CB6757;">学呗（上海）教育科技有限公司</strong>',
				'mapCont': '<strong>上海市浦东新区浦东大道2742号中环滨江大厦1号楼417</strong>'
			}
		];

		contact.showMap('mainMap',data[0].jwNum1, data[0].jwNum2, data[0].title, data[0].mapCont);
	},
	showMap: function(id,jwNum1, jwNum2,mapTitle,mapCont1){
		var map = new BMap.Map(id);
		var point = new BMap.Point(jwNum1, jwNum2);
		var marker = new BMap.Marker(point);
		map.addOverlay(marker);
		map.centerAndZoom(point, 19);
		var opts = {
			width: 150,
			height: 100,
			title: mapTitle,
			enableMessage: true,
			message: mapCont1
		}
		var infoWindow = new BMap.InfoWindow(mapCont1, opts);
		marker.addEventListener("click", function () {
			map.openInfoWindow(infoWindow, point);
		});
	}
};

