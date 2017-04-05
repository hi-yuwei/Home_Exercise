import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import say from '@/components/say'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: 'say',
      name: 'say',
      component: say
    }
  ]
})
