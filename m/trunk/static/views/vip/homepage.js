/**
 * Created by YW on 2016/6/27.
 */
// 宝象会员

define(function (require, exports, module) {
    require("views/vip/src/style.css");
    var sTpl = require("views/vip/homepage.html");

    var iPublic = require("components/public.js");
    var API_GET = iPublic.API_GET;

    var homepage_extend = Vue.extend({
        template: sTpl,
        // 我的特权
        components: {
            'list': {
                template: ' <div class="power-item">\
                                    <div v-for="val in list" v-link="\'/vip/introduce/\' + val.levelProfitId"><div class="itemList">\
                                     <div class="img" v-bind:style="{background:\'url(https://bxwd-img.oss-cn-hangzhou.aliyuncs.com/\'+val.levelProfitIcon+\') no-repeat center\',backgroundSize:\'100% 100%\'}">\
                                </div>\
                                <p>{{val.levelProfitName}}</p></div>\
                                </div>\
                            </div>',
                data: function () {
                    return {
                        list: []
                    }
                }
            }
        },
        data: function () {
            return {
                homeInfo: {"avatar": "", "userName": "","levelName":"","levelId":"","levelIcon":"","memberGrowth":"","memberProfits":[{"levelProfitId":"","levelProfitName":"","levelProfitIcon":""}]},
                showline:{},
                ulwidth:{
                    width:''
                }
            };
        },
        methods: {
            setline:function (type) {
                var deviceWidth=$(window).width();
                var setLeft=0,len=this.showline.length;
                this.showline.map(function(val,key){
                    if(val.levelSettingId==type){
                        setLeft=key;
                    }
                })
                $('.gradeline').scrollLeft(deviceWidth*(setLeft/len));
            },
            changetab: function (event) {
                var that=this;
                $(event.currentTarget).addClass('ring').siblings('li').removeClass('ring');
                var id=event.currentTarget.getAttribute('data-id');
                API_GET({
                    url: 'wd_api/memberSystem/getProfitsByLevelOn',
                    // url:'api/vip.json',
                    data: {"levelId":id},
                    success: function (result) {
                        if(result.isSuccess){
                            setTimeout(function () {
                                that.$children[0].list=result.data;
                            },0)
                        }
                    }
                });
            }
        },
        created: function () {
            //设置返回键
            this.$root.$children[0].showgoback = false;
            //设置title
            this.$root.setTitle('宝象会员');
            var that = this;
            function get_vipdata() {
                //获取我的等级
                API_GET({
                    url: 'wd_api/memberSystem/getMemberSystemLevel',
                    // url: 'api/data.json',
                    data: {},
                    success: function (result) {
                        if(result.isSuccess){
                            that.homeInfo = result.data; //设置会员信息
                            that.$children[0].list=result.data.memberProfits;    //设置特权
							//获取等级规则
							API_GET({
								url: 'wd_api/memberSystem/getMemberSystemLevelRollOn',
								// url:'api/helplist.json',
								data: {},
								success: function (result) {
									if (result.isSuccess) {
										//设置选中项
										for (var i in result.data) {
											if (result.data[i]['levelSettingId'] == that.homeInfo.levelId) {
												result.data[i].on = "on ring";
											}
										}
										// that.ulwidth.width=result.data.length*8.2+"rem";
										that.ulwidth.width=result.data.length*8.5+"rem";
										that.showline = result.data;
										setTimeout(function () {
											that.setline(that.homeInfo.levelId);
										}, 0)

									}
								}
							});
                        }else{
							that.homeInfo.userName = result.message;
							//献给亲爱的Android
							setTimeout(get_vipdata,1000);
						}
                    }
                });
            }

            /*
            * 初始化数据
            * setTimeout解决不实时bug
            * */
            setTimeout(get_vipdata,0);
        }
    });
    module.exports = homepage_extend;
});

