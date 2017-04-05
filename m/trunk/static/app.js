/**
 * Created by T'ingHsi on 2016/6/23.
 */
define(function (require,exports,module) {
    require("src/public.css"); //css
    //require("components/public.js");
	
	//var publicArr = module.publicArr; //公共函数
	
	//var Auth = module.Auth;

	//var API_GET = module.API_GET;
	

    // 路由器需要一个根组件。
    var App = Vue.extend({
		data:function(){
			return {
				Name: '',
				bodyClass : '',
				bodyColor:''
			};
		},
		methods: {
			setTitle: function () {
				this.Name = arguments[0];
				this.$children[0].Name = arguments[0];
				document.title = arguments[0];
				titletxt=arguments[0];

				//解决ios无法获取title问题
				setTimeout(function(){
					var body = document.getElementsByTagName('body')[0];
					document.title = titletxt;
					var iframe = document.createElement("iframe");
					iframe.style.display="none";
					iframe.setAttribute("src", "static/src/logo.png");
					var d = function() {
						setTimeout(function() {
							iframe.removeEventListener('load', d);
							document.body.removeChild(iframe);
						}, 0);
					};
					iframe.addEventListener('load', d);
					document.body.appendChild(iframe);
				},0);


			}
		},
		created: function () {
			var ua = navigator.userAgent.toLowerCase();
			if(navigator.standalone == true){
			//IOS桌面版本运行
				this.bodyClass='standalone';
			}else if(ua.indexOf('baoxiang') != -1){
				//宝象APP内运行
				this.bodyClass='noNav';
			}else if(ua.indexOf('micromessenger/') != -1){
				//微信内运行
				this.bodyClass='noNav';
			}else if(ua.indexOf('qq/') != -1){
				this.bodyClass='noNav';
			}else{
				this.bodyClass='hasNav';
			}
		},
		components: {
			'navigation' : {
				template: '<header class="top_nav">\
					<a v-if="showgoback" class="back v-hide" v-on:click="goback()">&lt;</a>\
					<div>{{Name}}</div>\
					<a class="reload" onclick="location.reload()"></a>\
				</header>',
				data:function(){
					return {
						showgoback: false,
						shownav: true,
						Name : this.$root.$data.Name
					};
				},
				methods: {
					goback: function(){
						try{
							history.back();
						}catch(r){
							history.go(-1);
						}
					}
				}
			}
		}
	});
	
	
    // 创建一个路由器实例
    var router = new VueRouter();

    // 定义路由规则
    router.map({
		'/financialPlanner': {
			component: function(resolve) {
				require.async(['views/financialPlanner/index.js'],resolve);
			},
			subRoutes: {
				'/customers': {
					component: function(resolve) {
						require.async(['views/financialPlanner/customers.js'],resolve);
					}
				},
				'/receipts': {
					component: function(resolve) {
						require.async(['views/financialPlanner/receipts.js'],resolve);
					}
				},
				'/invests': {
					component: function(resolve) {
						require.async(['views/financialPlanner/invests.js'],resolve);
					}
				},
				'/view/:id': {
					component: function(resolve) {
						require.async(['views/financialPlanner/view.js'],resolve);
					}
				}
			}
		},
        '/vip': {
            component: function(resolve) {
                require.async(['views/vip/index.js'],resolve);
            },
            subRoutes: {
                '/help': {
                    component: function(resolve) {
                        require.async(['views/vip/help.js'],resolve);
                    }
                },
                '/homepage': {
                    component: function(resolve) {
                        require.async(['views/vip/homepage.js'],resolve);
                    }
                },
                '/integral': {
                    component: function(resolve) {
                        require.async(['views/vip/integral.js'],resolve);
                    }
                },
                '/introduce/:id': {
                    component: function(resolve) {
                        require.async(['views/vip/introduce.js'],resolve);
                    }
                }
            }
        },
		'/help': {
			component: function(resolve) {
				require.async(['views/help/top.js'],resolve);
			},
			subRoutes: {
				'/index': {
					component: function(resolve) {
						require.async(['views/help/index.js'],resolve);
					}
				},
				'/news/:id': {
					component: function(resolve) {
						require.async(['views/help/news.js'],resolve);
					}
				}
			}
		},
		'/youpin': {
			component: function(resolve) {
				require.async(['views/youpin/title.js'],resolve);
			},
			subRoutes: {
				'/index': {
					component: function (resolve) {
						require.async(['views/youpin/index.js'], resolve);
					}
				},
				'/condition': {
					component: function (resolve) {
						require.async(['views/youpin/condition.js'], resolve);
					}
				},
				'/manage': {
					component: function (resolve) {
						require.async(['views/youpin/manage.js'], resolve);
					}
				},
				'/detail': {
					component: function (resolve) {
						require.async(['views/youpin/detail.js'], resolve);
					}
				},
				'/success': {
					component: function (resolve) {
						require.async(['views/youpin/success.js'], resolve);
					}
				},
				'/markitem': {
					component: function (resolve) {
						require.async(['views/youpin/markitem.js'], resolve);
					}
				}
			}
		}
    });

	//路由重定向
	router.redirect({
		// 任意未匹配路径到 /home
		//'*': '/home',

		'/financialPlanner': '/financialPlanner/customers',
		'/vip': '/vip/homepage',
		'/help':'/help/index',
		'/youpin':'/youpin/index'

		// 重定向可以包含动态片段，而且重定向片段必须匹配
		//'/user/:userId': '/profile/:userId',

	});

//router.beforeEach(function (transition) {
	//console.log('将要浏览到: ' + transition.to.fullPath);
	//if(transition.to.path == '/'){
	//	transition.redirect('/financialPlanner/customers');
	//}
	//if (transition.to.auth) {
    // 对用户身份进行验证...
	//}
	
    //if (transition.to.name === 'grouplistedit' && transition.from.name !== 'grouplist') {
	//	  transition.abort()
    //}
	//setTimeout(scroll,0,0,10);//回到顶部
	//transition.next()
//})

//router.afterEach(function (transition) {
//  console.log('成功浏览到: ' + transition.to.path)
//})


    // 路由器会创建一个 App 实例，并且挂载到选择符 #app 匹配的元素上。
    router.start(App, '#app');

});