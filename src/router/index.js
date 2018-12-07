import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import base from '@/pages/base/index'
import scene0 from '@/pages/scene0/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/base',
      name: 'base',
      component: base
    },
    {
      path: '/scene0',
      name: 'scene0',
      component: scene0
    }
  ]
})
