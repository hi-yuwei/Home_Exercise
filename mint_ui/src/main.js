// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import routerOption from './router.js'
import Mint from 'mint-ui';
import { Loadmore } from 'mint-ui';


Vue.use(VueRouter);
Vue.use(Mint);

Vue.component(Loadmore.name, Loadmore);

const router = new VueRouter(routerOption);
Vue.config.productionTip = false

/* eslint-disable no-new */
const app = new Vue({
    router,
    render: h => h(App)
}).$mount('#app')