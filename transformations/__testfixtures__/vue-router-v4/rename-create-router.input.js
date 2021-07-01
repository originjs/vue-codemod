import VueRouter from 'vue-router';
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
const createRouter = () => new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

const router = createRouter()

export default router;
