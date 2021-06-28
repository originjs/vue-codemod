import router from './router'
import store from './store'
import permission from './permission'
import routes from './config/routes'

routes.forEach(item => router.addRoute(item))

router.beforeEach((to,from, next) => {
  if(permission){
    if (Array.isArray(store.getters.addRouters)) {
      store.getters.addRouters.forEach(item => router.addRoute(item));
    } else {
      router.addRoute(store.getters.addRouters);
    };
  }
})

