/**
 * Created by hmc on 2016/7/7
 */
// 帮助中心

define(function (require, exports, module) {
    require("views/help/src/css.css");
    var sTpl = require("views/help/index.html");
    var iPublic = require("components/public.js");
    var API_GET = iPublic.API_GET;

    var index = Vue.extend({
		template: sTpl,
        // 列表
        components: {
            'list': {
                template: ' <ul class="listCon">\
                            <template v-for="val in list">\
                            <li v-link="\'/help/news/\'+val.articleId" data-id="{{val.articleId}}"><p>{{val.articleTitle}}</p></li>\
                            </template>\
                            </ul>',
                data: function () {
                    return {
                        list: []
                    }
                }
            }
        },
        data:function(){
            return {
                indexInfo: [{"helpId":"","helpName":""}]
            };
        },
        methods:{
            click:function(event){
                $(event.target).addClass('on').siblings('li').removeClass('on');
                var that=this;
                var id=event.currentTarget.getAttribute('data-helpKey');
                this.getInfo(id);

            },
            getInfo:function(type){
                var that=this;
                API_GET({
                    url:'wd_api/helpApp/getHelpListOn',
                    data: {"helpKey":type},
                    success: function (result) {
                        if(result.isSuccess){
                            setTimeout(function(){
                                that.$children[0].list = result.data;
                            },0)
                        }
                    }
                });
            }

        },
        created:function(){
            //设置返回键
            this.$root.$children[0].showgoback = true;
            this.$root.bodyColor='gray';
            var that = this;
            setTimeout(function(){
                API_GET({
                    url:'wd_api/helpApp/getHelpTypeOn',
                    data:{},
                    success:function(result){
                        if(result.isSuccess){
                            that.indexInfo = result.data;
                            that.getInfo(result.data[0].helpKey)
                        }
                    }
                })
            },0)
        }
    });
    module.exports = index;
});

