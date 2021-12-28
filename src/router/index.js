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
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('../views/Settings')
      }
    ]
  },
  {
    path: '/mnemonic',
    name: 'Mnemonic',
    component: () => import('../views/Mnemonic'),
    children: [
      {
        path: 'import',
        name: 'ImportMnemonic',
        component: () => import('../views/ImportMnemonic')
      },
      {
        path: 'password',
        name: 'Password',
        component: () => import('../views/Password')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
