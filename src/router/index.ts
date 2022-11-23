import { createRouter, createWebHistory } from 'vue-router'
import Room from '../views/Room.vue';
import Page from '../views/Page.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Room',
      component: Room,
    },
    {
      path: '/page',
      name: 'Page',
      component: Page,
    },
  ]
})

export default router
