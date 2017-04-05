define(function (require,exports,module) {

	var you = Vue.extend({
		template: '<router-view></router-view>',
		components: {
			'btn': {
				template: '<div><a href="http://www.baidu.com" class="btn yellow">立即加入</a></div>',
				data: '',
				methods: ''
			},
			data:function(){
				return {
				};
			},
			methods: {}
		},
		created: function () {
			//设置title
			this.$root.setTitle('象财优品');
		}
	});
	module.exports = you;
});


