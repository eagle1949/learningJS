import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Contact from '@/components/Contact'
import Friend from '@/components/Friend'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/Contact/:id/:name',
      name: 'Contact',
      props : true,
      component: Contact
    },
    {
      path: '/Friend',
      name: 'Friend',
      component: Friend
    }
  ]
})
