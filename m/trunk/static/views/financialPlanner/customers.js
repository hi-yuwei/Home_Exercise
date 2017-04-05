/**
 * Created by T'ingHsi on 2016/6/23.
 */
// 我的客户

define(function (require,exports,module) {
    var sTpl = require("views/financialPlanner/customers.html");
	
    //require("lib/layer/layer.js");
    //require("lib/layer/need/layer.css");
	
    var iPublic = require("components/public.js");
    var publicArr = iPublic.publicArr,
		Auth = iPublic.Auth,
		pagedata = iPublic.pagedata,
		loadMore = iPublic.loadMore;
    
    var components_extend = Vue.extend({
        template: sTpl,
        methods:{
            loadMore:function(){
                //layer.open({
                //    content: '我是Foo页面',
                //    style: 'background-color:#09C1FF; color:#fff; border:none;',
                //    time: 2
                //});
            }
        },
        data:function(){
            return {
                list: {isSuccess:'', message:'', data : [] },
                stillMore: false
            };
        },
        created: function () {
			//设置返回键
			this.$root.$children[0].showgoback = false;
			//将当前path传给公共函数
            publicArr.path = this.$route.fullPath;
            //设置底部菜单
            this.$parent.$children[0].changeMenu(publicArr.path);
			pagedata[publicArr.path] = {totalCount: false, offset: 0, stillMore: false, data:[], url: 'wd_api/financialPlanner/getRecommendMemberList'};
            //console.log(this.$route.path);
            
            //拉取数据
            publicArr.me = this;
            if(Auth.get() != 0){
                loadMore(this);
            }else{
				this.list.message="您还没有登录！"
			}
            
            
            /*
            this.list = {
                "data":[
                    {"investorId":17328,"realName":"杭飞云","mobile":"15021987832","availableMoney":0.00,"waitingReceiptAllMoney":0.00},
                    {"investorId":17334,"realName":"李可","mobile":"15021619668","availableMoney":0.00,"waitingReceiptAllMoney":0.00},
                    {"investorId":17342,"realName":"胡斌","mobile":"13816377910","availableMoney":0.00,"waitingReceiptAllMoney":0.00},
                    {"investorId":17362,"realName":"","mobile":"18916792135","availableMoney":0.00,"waitingReceiptAllMoney":0.00},
                    {"investorId":17389,"realName":"","mobile":"18964812901","availableMoney":0.00,"waitingReceiptAllMoney":0.00},
                    {"investorId":17407,"realName":"乐曼青","mobile":"13661654968","availableMoney":0.00,"waitingReceiptAllMoney":0.00},
                    {"investorId":17439,"realName":"洪盛琦","mobile":"18616505307","availableMoney":0.00,"waitingReceiptAllMoney":0.00},
                    {"investorId":17491,"realName":"王玮","mobile":"15002139171","availableMoney":0.00,"waitingReceiptAllMoney":0.00},
                    {"investorId":17585,"realName":"沈宏","mobile":"18918359986","availableMoney":0.00,"waitingReceiptAllMoney":0.00},
                    {"investorId":17671,"realName":"郭玉娥","mobile":"13205171543","availableMoney":0.00,"waitingReceiptAllMoney":0.00}
                ],
                "isSuccess":true,"message":"","page":1,"size":5,"status":200,"totalCount":0
            };
            */
            
            

        }
        
    });
    
    module.exports = components_extend;
});

