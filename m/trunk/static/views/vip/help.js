/**
 * Created by YW on 2016/6/27.
 */
// 成长值帮助

define(function (require,exports,module) {
	require("views/vip/src/style.css");
    var sTpl = require("views/vip/help.html");

	var iPublic = require("components/public.js");
	var API_GET = iPublic.API_GET;


	var help_extend = Vue.extend({
        template: sTpl,
		data:function () {
			return{
				list:[]
			}
		},
		created: function () {
			//设置返回键
			this.$root.$children[0].showgoback = true;
			//设置title
			this.$root.setTitle('会员等级介绍');

			var that=this;
			//公共ajax请求
			API_GET({
				url: 'wd_api/memberSystem/getMemberSystemLevelRollOn',
				// url:'api/helplist.json',
				data: {},
				success: function (result) {
					if(result.isSuccess){
						that.list=result.data;
					}
				}
			});
		}
    });

    module.exports = help_extend;
});

