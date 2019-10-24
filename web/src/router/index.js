import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/layout'
import { i18n } from '@/plugins/i18n.js'

Vue.use(Router)
export const routes = [
  { path: '/home', redirect: '/', hidden: true },
  {
    path: '/',
    name: i18n.t('nav.home'),
    icon: 'el-icon-s-home',
    component: Layout,
    redirect: '/',
    children: [{
      path: '',
      component: () => import('@/views/article/home/index')
    }]
  },
  {
    path: '/articles',
    name: i18n.t('nav.blog'),
    icon: 'el-icon-collection',
    component: Layout,
    redirect: '/',
    children: [
      {
        name: i18n.t('nav.latest_posts'),
        path: '',
        component: () => import('@/views/article/home/index')
      },
      {
        name: i18n.t('nav.new_post'),
        path: 'new',
        component: () => import('@/views/article/new/index')
      },
      {
        hidden: true,
        path: 'detail/:id',
        component: () => import('@/views/article/view/index')
      },
      {
        hidden: true,
        path: 'edit/:id',
        component: () => import('@/views/article/edit/index')
      }]
  },
  {
    path: '/resources',
    name: i18n.t('nav.resources'),
    icon: 'el-icon-help',
    component: Layout,
    redirect: '/',
    children: [{
      path: '',
      component: () => import('@/views/resource/index')
    }]
  },
  {
    path: '/challenges',
    name: i18n.t('nav.challenges'),
    icon: 'el-icon-coffee-cup',
    component: Layout,
    redirect: '/challenges/home',
    children: [{
      path: 'home',
      name: i18n.t('nav.list_challenges'),
      component: () => import('@/views/challenge/home/index')
    },
    {
      path: 'new',
      name: i18n.t('nav.new_challenge'),
      roles: ['group-admin'],
      component: () => import('@/views/challenge/new/index')
    },
    {
      path: 'admin',
      name: i18n.t('nav.manage_challenges'),
      roles: ['group-admin'],
      component: () => import('@/views/challenge/admin/index')
    },
    {
      path: 'edit/:id',
      hidden: true,
      component: () => import('@/views/challenge/edit/index')
    },
    {
      path: 'groups/:id',
      hidden: true,
      component: () => import('@/views/challenge/group/index')
    }]
  },
  {
    path: '/policies',
    name: i18n.t('nav.policies'),
    icon: 'el-icon-setting',
    roles: ['group-admin'],
    component: Layout,
    redirect: '/policies/home',
    children: [{
      path: 'home',
      name: i18n.t('nav.manage_policies'),
      component: () => import('@/views/policy/home/index')
    }]
  },
  {
    path: '/users',
    name: i18n.t('nav.users'),
    component: Layout,
    hidden: true,
    redirect: '/',
    children: [{
      path: 'register',
      component: () => import('@/views/user/registration/index')
    },
    {
      path: 'reset-password/:token',
      component: () => import('@/views/user/reset-password/index')
    },
    {
      path: 'forgot-password',
      component: () => import('@/views/user/forgot-password/index')
    }]
  },
  {
    path: '/about',
    name: i18n.t('nav.about'),
    icon: 'el-icon-info',
    component: Layout,
    redirect: '/',
    children: [{
      path: '',
      component: () => import('@/views/About')
    }]
  },
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  { path: '*', redirect: '/', hidden: true },
  { path: '/play', component: () => import('@/views/play/index'), hidden: true }
]

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: routes
})
