/**
 * Created by T'ingHsi on 2016/6/23.
 */
// 我的客户 默认页

define(function (require,exports,module) {

    var financialPlanner = Vue.extend({
		template: '<router-view></router-view><menu></menu>',
		components: {
			'menu' : {
				template:	'<nav class="tab_bar">\
				<template v-if="path == \'view\'">\
					<template v-for="t in view">\
							<a :class="t.className" href="{{t.link}}">{{t.title}}</a>\
					</template>\
				</template>\
				<template v-else>\
					<template v-for="t in list">\
							<a :class="t.className" v-link="{ path: t.link, replace: t.replace }">{{t.title}}</a>\
					</template>\
				</template>\
				</nav>',
				data:function(){
					return {
						path:'customers',
						list: [
							{title:"我的客户",link:"/financialPlanner/customers",replace:true,className:'customers_btn'},
							{title:"即将回款",link:"/financialPlanner/receipts",replace:true,className:'receipts_btn'},
							{title:"近期投资",link:"/financialPlanner/invests",replace:true,className:'invests_btn'}
						],
						view: [
							{title:"短信联系",link:'sms:',replace:true,className:'sms_btn'},
							{title:"拨打电话",link:'tel:',replace:true,className:'tel_btn'}
						]
					};
				},
				methods:{
					changeMenu:function(){
						//console.log(arguments);
						//console.log(this.$data);
						var mydata = this.$data;
						mydata.path = arguments[0];
						if(arguments[0] == 'view' && arguments[1]){
							mydata.view[0].link = 'sms:' + arguments[1];
							mydata.view[1].link = 'tel:' + arguments[1];
						}
					}
				}
			},
		},
		created: function () {
			//构造一个仅可一次性访问的链接
			//this.$router.on('/financialPlanner/user/:userId', {
			//	component: { template: '<div>{{$route.params.userId}}</div>' }
			//})
			this.$root.setTitle('理财师');
		}
	});
    
    module.exports = financialPlanner;
});

