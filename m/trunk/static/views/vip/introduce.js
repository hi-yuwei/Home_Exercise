/**
 * Created by YW on 2016/6/27.
 */
// 权益介绍

define(function (require,exports,module) {
	require("views/vip/src/style.css");
    var sTpl = require("views/vip/introduce.html");

	var iPublic = require("components/public.js");
	var publicArr = iPublic.publicArr, API_GET = iPublic.API_GET;


	var VueComponent = Vue.extend({
        template: sTpl,
        methods:{
			getInfo:function (id) {
				var that=this;
				API_GET({
					url: 'wd_api/memberSystem/getLevelProfitByProfitsOn',
					data: {"profitId":id},
					success: function (result) {
						if (result.isSuccess) {
/*							that.$root.pageName(result.data.levelProfitName);
							document.title=result.data.levelProfitName;*/
							that.$root.setTitle(result.data.levelProfitName);
							that.list=result;
						}
					}
				});

			}
        },
        data:function(){
			return{
				list: {"data":{"levelProfitId":"","levelProfitName":"","levelProfitIcon":"","levelProfitDescription":""},"isSuccess":""}
			}
        },
		created: function () {
			this.$root.$children[0].showgoback = true;	//设置返回键
			this.getInfo(this.$route.params.id);	//获取id
		}
    });
    module.exports = VueComponent;
});

