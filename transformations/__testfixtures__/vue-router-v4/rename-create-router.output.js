import { createRouter as newCreateRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
];
const createRouter = () => newCreateRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

const router = createRouter()

export default router;
