import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Login from '../views/Login.vue'
import Join from '../views/Join.vue'
import launchpad from '../views/launchpad.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/', //홈화면
    name: 'Home',
    component: launchpad 
  },
  {
    path: '/home', //지도 화면
    name: 'Home',
    component: Home
  },
  {
    path: '/login',  //로그인 화면
    name: 'Login',
    component: Login
  },
  {
    path: '/join',  //회원가입 화면
    name: 'Join',
    component: Join
  },
  {
    path: '/launchpad',  //런치패드 화면
    name: 'launchpad',
    component: launchpad
  },
  {
    path: '/about',  //운동일지 화면
    name: 'About',
    component: About
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
