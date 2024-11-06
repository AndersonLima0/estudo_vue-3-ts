import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import TodoVy from '@/components/TodoVy.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: TodoVy
    },
    
  ]
})

export default router