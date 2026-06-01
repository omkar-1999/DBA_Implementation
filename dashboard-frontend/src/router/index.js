import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/views/Dashboard.vue'),
  },

  {
    path: '/deploy',
    name: 'deploy',
    component: () => import('@/views/DeploymentForm.vue'),
  },

  {
    path: '/history',
    name: 'history',
    component: () => import('@/views/DeploymentHistory.vue'),
  },

  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/SearchPage.vue'),
  },

  {
    path: '/new-deployment',
    name: 'new-deployment',
    component: () => import('@/views/NewDeployment.vue'),
  },

  {
    path: '/amend-deployment/:id',
    name: 'amend-deployment',
    component: () => import('@/views/NewDeployment.vue'),
    props: true,
  },

  {
    path: '/share-deployment',
    name: 'share-deployment',
    component: () => import('@/views/ShareDeploymentPage.vue'),
  },

  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
