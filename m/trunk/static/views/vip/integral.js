/**
 * Created by YW on 2016/6/27.
 */
// 成长值记录

define(function (require, exports, module) {
    require("views/vip/src/style.css");
    var sTpl = require("views/vip/integral.html");

    var iPublic = require("components/public.js");
    var publicArr = iPublic.publicArr,
        Auth = iPublic.Auth,
        pagedata = iPublic.pagedata,
        API_GET = iPublic.API_GET;


    var getM,getY;
    var VueComponent = Vue.extend({
        template: sTpl,
        data: function () {
            return {
                list: [],
                stillMore: false,
                total:'',
                offset:0,
                max:20,
                sum:'',
                show:false,
                nodata:false,
                loading:true,
                lock:true
            };
        },
        methods: {
            loadData: function () {

                var that = this;
                API_GET({
                    url: 'wd_api/memberSystem/getMemberGrowthDetails',
                    data: {"offset": that.offset, "max": that.max},
                    success: function (result) {
                        if (result.isSuccess) {
                            that.loading=false;
                            if (result.data.length == 0) {
                                if(that.lock){
                                    that.show = true;
                                }
                            } else {
                                if (result.data.length < that.max) {
                                    that.stillMore = false;
                                    that.nodata=true;
                                } else {
                                    that.stillMore = false;
                                }
                                that.list = that.list.concat(result.data);
                                that.offset += 20;
                                that.lock=false;
                            }
                        }else{
                            that.loading=false;
                        }
                    }
                });


                //总计
                API_GET({
                    url: 'wd_api/memberSystem/getMemberSystemLevel',
                    data: {},
                    success: function (result) {
                        if(result.isSuccess){
                            that.sum=result.data.memberGrowth;    //设置总计
                        }
                    }
                });
            },
            scrollLoad:function () {
/*                var that=this;
                setTimeout(function () {
                    console.log($("a.page_button[show-btn]").offset().top)
                    $(window).on('scroll',function() {
                        console.log($("body").scrollTop())
                        console.log($("a.page_button[show-btn]").offset().top)
                        var btn=$("a.page_button[show-btn]");

                        var meTop = btn.offset().top, scrollTop = $("body").scrollTop(), windowHeight = $(window).height();
                        if ((scrollTop + windowHeight * 1.5 >= meTop)) {
                            that.stillMore=true;
                        }else{
                            that.stillMore=true;
                        }
                    })
                },0)*/

            }
        },
        created: function () { 
            //设置返回键
            this.$root.$children[0].showgoback = true;
            //设置title
            this.$root.setTitle('成长值记录');
/*            if(parseInt(this.$route.params.total)){
                this.total=this.$route.params.total;
                this.loadData();
            }*/
            // this.total=this.$route.params.total;
            this.loadData();

            var that=this;
            $(window).on('scroll',function() {
                var raw = $("a.vip_load[vip-visibled]")

                raw.each(function(){
/*                    if(publicArr.path == '/view/:id'){ return; }
                    if(pagedata[publicArr.path]['stillMore'] == false){ return; }*/
                    var me = $(this);
                    var meTop = me.offset().top,
                        scrollTop = $("body").scrollTop(),
                        windowHeight = $(window).height(),
                        domHeight=$(document).height();

                    //alert((scrollTop + windowHeight * 1.5) + ' loadNextPage ' + meTop + ' = ' + (scrollTop + windowHeight * 1.5 >= meTop));
                    //窗口卷出距离 + 窗口高度 * 1.5 >= 元素距离顶部的距离
                    if ((scrollTop + windowHeight  >= domHeight)) {
                            that.loadData();
                    }

                });
            });
        }
    });
    //处理月份
    /*    VueComponent.filter('setMonth',function(month,year){
            var nowDate=new Date();
            var nowMonth=nowDate.getMonth()+1;
            var nowYear=nowDate.getFullYear();
            if (month == nowMonth && nowYear == year) {
                return '本月';
            } else {
                var upper = ['一月份', '二月份', '三月份', '四月份', '五月份', '六月份', '七月份', '八月份', '九月份', '十月份', '十一月份', '十二月份'];
                return upper[month - 1];
            }
        });*/
    //处理日期
    VueComponent.filter('formatDate',function(date){
       return date.replace(/\s(\d{2}:{0,1})+/,'');
    });

    module.exports = VueComponent;
});

