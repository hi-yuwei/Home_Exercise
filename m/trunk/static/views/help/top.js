/**
 * Created by hmc on 2016/7/7.
 */
// 帮助中心 默认页

define(function (require,exports,module) {
	
    var help = Vue.extend({
		template: '<router-view></router-view>',
		created: function () {
			this.$root.setTitle('帮助与反馈');
		}
	});
    module.exports = help;
});

