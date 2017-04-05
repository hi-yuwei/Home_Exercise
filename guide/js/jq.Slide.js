/**
 * @author 愚人码头& T'ing Hsi
 参数名	参数值(默认值可以省略)
 effect : {
    scroolY（默认）：垂直滚动	 
    scroolX：水平滚动
    scroolTxt：文本垂直滚动
    fade：淡出
    scroolLoop：水平左右点击滚动
}
 autoPlay	true（默认）： or false
 speed	动画速度时间，默认"normal"，可以使用毫秒或者JQ中的fast，slow，normal
 timer	滚动间隔时间，默认"1000，可以使用毫秒或者JQ中的fast，slow，normal
 claNav	JQ-slide-nav（默认）：触点对象数组父级
 claCon	JQ-slide-content（默认）：滚动对象或滚动对象父级
 steps	1（默认）：滚动几个
 childSize : 1（默认）： 一行几个
 mul : 滚动li高度的倍数
 */
(function($){
	$.fn.Slide=function(options){
		var opts = $.extend({},$.fn.Slide.deflunt,options);
		var index=1;
		var ContentBox = $("." + opts.claCon , $(this));//滚动的对象
		var ContentBoxNum = Math.ceil(ContentBox.children().size()/opts.childSize);//滚动对象的子元素个数
		var slideH=ContentBox.children().first().outerHeight(true);//滚动对象的子元素个数高度，相当于滚动的高度
		var slideW=ContentBox.children().first().outerWidth(true);//滚动对象的子元素宽度，相当于滚动的宽度
		var targetBox = $("." + opts.claNav, $(this));//目标对象
		if(targetBox.html() == ''){
			targetBox.html((function(){
				var temp = [];
				for(var i = 0,len=Math.ceil(ContentBox.children().size()/opts.childSize);i<len;i++){
					temp.push(i==0 ? '<li class="on">1</li>' : '<li>'+(i+1)+'</li>');
				}
				return temp;
			})());
		}
		var targetLi = $("." + opts.claNav + " li", $(this));//目标对象
		var clickNext = $("." + opts.claNav + " .next", $(this));//点击下一个按钮
		var clickPrev = $("." + opts.claNav + " .prev", $(this));//点击上一个按钮

		var autoPlay;
		var slideWH;
		if(opts.effect=="scroolY"||opts.effect=="scroolTxt"){
			slideWH=slideH;
		}else if(opts.effect=="scroolX"||opts.effect=="scroolLoop"){
			ContentBox.css("width",ContentBoxNum*slideW);
			slideWH=slideW;
		}else if(opts.effect=="fade"){
			ContentBox.children().first().css("z-index","1");
		}

		return this.each(function() {
			var $this=$(this);
			//滚动函数
			var doPlay=function(){
				$.fn.Slide.effect[opts.effect](ContentBox, targetLi, index, slideWH, opts);
				index ++;

				if (index * opts.steps >= ContentBoxNum) {
					index = 0;
				}
			};
			clickNext.click(function(event){
				$.fn.Slide.effectLoop.scroolLeft(ContentBox, targetLi, index, slideWH, opts,function(){
					for(var i=0;i<opts.steps;i++){
						ContentBox.find("li:first",$this).appendTo(ContentBox);
					}
					ContentBox.css({"left":"0"});
				});
				event.preventDefault();
			});
			clickPrev.click(function(event){
				for(var i=0;i<opts.steps;i++){
					ContentBox.find("li:last").prependTo(ContentBox);
				}
				ContentBox.css({"left":-index*opts.steps*slideW});
				$.fn.Slide.effectLoop.scroolRight(ContentBox, targetLi, index, slideWH, opts);
				event.preventDefault();
			});
			//自动播放
			if (opts.autoPlay) {
				autoPlay = setInterval(doPlay, opts.timer);
				ContentBox.hover(function(){
					if(autoPlay){
						clearInterval(autoPlay);
					}
				},function(){
					if(autoPlay){
						clearInterval(autoPlay);
					}
					autoPlay=setInterval(doPlay, opts.timer);
				});
			}

			//目标事件
			targetLi.hover(function(){
				if(autoPlay){
					clearInterval(autoPlay);
				}
				index=targetLi.index(this);
				window.setTimeout(function(){$.fn.Slide.effect[opts.effect](ContentBox, targetLi, index, slideWH, opts);},200);

			},function(){
				if(autoPlay){
					clearInterval(autoPlay);
				}
				autoPlay = setInterval(doPlay, opts.timer);
			});
		});
	};
	$.fn.Slide.deflunt={
		effect : "scroolY",
		autoPlay:true,
		speed : "normal",
		timer : 1000,
		defIndex : 0,
		claNav:"JQ-slide-nav",
		claCon:"JQ-slide-content",
		steps:1,
		childSize:1,
		mul:1
	};
	$.fn.Slide.effectLoop={
		scroolLeft:function(contentObj,navObj,i,slideW,opts,callback){
			contentObj.animate({"left":-i*opts.steps*slideW},opts.speed,callback);
			if (navObj) {
				navObj.eq(i).addClass("on").siblings().removeClass("on");
			}
		},

		scroolRight:function(contentObj,navObj,i,slideW,opts,callback){
			contentObj.stop().animate({"left":0},opts.speed,callback);

		}
	}
	$.fn.Slide.effect={
		fade:function(contentObj,navObj,i,slideW,opts){
			contentObj.children().eq(i).stop().animate({opacity:1},opts.speed).css({"z-index": "1"}).siblings().animate({opacity: 0},opts.speed).css({"z-index":"0"});
			navObj.eq(i).addClass("on").siblings().removeClass("on");
		},
		scroolTxt:function(contentObj,undefined,i,slideH,opts){
			//alert(i*opts.steps*slideH);
			contentObj.animate({"margin-top":-opts.steps*slideH},opts.speed,function(){
				for( var j=0;j<opts.steps;j++){
					contentObj.find("li:first").appendTo(contentObj);
				}
				contentObj.css({"margin-top":"0"});
			});
		},
		scroolX:function(contentObj,navObj,i,slideW,opts,callback){
			contentObj.stop().animate({"left":-i*opts.steps*slideW},opts.speed,callback);
			if (navObj) {
				navObj.eq(i).addClass("on").siblings().removeClass("on");
			}
		},
		scroolY:function(contentObj,navObj,i,slideH,opts){
			contentObj.stop().animate({"top":-i*opts.steps*slideH*opts.mul},opts.speed);
			if (navObj) {
				navObj.eq(i).addClass("on").siblings().removeClass("on");
			}
		}
	};
})(jQuery);