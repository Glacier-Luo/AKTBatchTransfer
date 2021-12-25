import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Main',
    component: () => import('../views/Main'),
    children: [
      {
        path: '/',
        name: 'Transfer',
        component: () => import('../views/Transfer')
      },
      {
        path: 'explorer',
        name: 'Explorer',
        component: () => import('../views/Explorer')
      }
    ]
  },
  {
    path: '/import',
    name: 'ImportMnemonic',
    component: () => import('../views/ImportMnemonic')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
