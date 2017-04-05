/**
 * Created by T'ingHsi on 2016/6/23.
 */
// 宝象会员 默认页

define(function (require,exports,module) {
	
    var vip = Vue.extend({
		template: '<router-view></router-view>',
		created: function () {
			//设置title
			this.$root.setTitle('宝象会员');

			//设置body颜色
			this.$root.bodyColor='gray';
			// if(this.$route.path == '/vip'){
			// 	this.$router.go('/vip/homepage');
			// }
		}
	});
    module.exports = vip;
});

