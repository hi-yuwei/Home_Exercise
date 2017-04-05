/**
 * Created by hmc on 2016/7/7
 */
// 帮助中心

define(function (require, exports, module) {
    require("views/help/src/css.css");
    var sTpl = require("views/help/news.html");
    var iPublic = require("components/public.js");
    var API_GET = iPublic.API_GET;

    var news = Vue.extend({
		template: sTpl,
        data:function(){
            return {
                list: [{"title":"","description":"","content":"","redirectUrl":""}]
            };
        },
        methods:{
            getInfo:function(id){
                var that = this;
                API_GET({
                    url:'wd_api/helpApp/getNoticeDetailOn',
                    data:{"articleId":id},
                    success:function(result){
                        if(result.isSuccess){
                            that.list = result.data;
                        }
                    }
                });
            }
        },
        created:function(){
            this.$root.$children[0].showgoback = true;
            this.$root.bodyColor='';
            this.getInfo(this.$route.params.id);	//获取id
        }
    });
    module.exports = news;
});

