function huadong(){
	var haha = document.getElementById('huadonglunbo');
	var $circles = 	$(".xiaoyuandian ul li");
		window.mySwipe = Swipe(
			haha, 
			{	
				startSlide: 0,		//表示轮播开始的图片编号
				auto: 2000,         //表示自动轮播的间隔
				continuous: true,   //表示是否再来一轮
				disableScroll: true,  //表示是否在上面阻止默认的滚轮事件，不用改
				stopPropagation: true,   //表示是否阻止冒泡，不用改。
				callback: function(index, element) {
					//写小圆点的业务
					$(".xiaoyuandian span").animate({"left":index*25},500);
				}
			}
		);

		 
}

function zhankai(){
	var $bb = $("nav ul li a b");
			$("nav ul li").eq(4).click(function(){
				if($bb.css("transform") === "rotate(180deg)"){						
					$bb.css("transform","rotate(0deg)");
					$("nav").css("height","88px");
					$("nav ul li a span").html("展开");						
				}else{						
					$bb.css("transform","rotate(180deg)");
					$("nav").css("height","176px");
					$("nav ul li a span").html("收起");						
				}
			});
}

