import { useUserStore } from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'

// createRouter创建路由实例
const router = createRouter({
  // 配置路由模式
  // 1.history模式：createWebHistory        地址栏不带#
  // 2.hash模式：createWebHashHistory    地址栏带#
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') }, //登录页
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'), //首页（布局
      redirect: '/article/manage',
      children: [
        {
          path: '/article/manage',
          component: () => import('@/views/article/ArticleManage.vue')
        },
        {
          path: '/article/category',
          component: () => import('@/views/article/ArticleCategory.vue')
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        },
        {
          path: '/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue')
        }
      ]
    }
  ]
})

// 登录访问拦截(路由守卫)
// 默认是直接放行的根据返回值决定，是放行还是拦截
// 返回值:
// 1.undefined / true 直接放行
//  2.false 拦回from的地址页面
//  3.具体路径或路径对象拦截到对应的地址
//    '/login'    { name: 'login'}
router.beforeEach((to) => {
  // 判断本地是否有token，且是否在不应该到达的页面（非登录页
  // 若没有token，就要强制回到登录页
  const userStore = useUserStore() //注意加括号！！！！
  if (!userStore.token && to.path !== '/login') return '/login'
  return true
})

export default router
