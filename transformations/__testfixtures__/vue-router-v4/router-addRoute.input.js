import router from './router'
import store from './store'
import permission from './permission'
import routes from './config/routes'

router.addRoutes(routes)

router.beforeEach((to,from, next) => {
  if(permission){
    router.addRoute(store.getters.addRouters)
  }
})

