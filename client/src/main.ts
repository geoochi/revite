import { ViteSSG } from 'vite-ssg'
import routes from '~pages'
import App from './App.vue'
import { createPinia } from 'pinia'

export const createApp = ViteSSG(
  App,
  {
    base: import.meta.env.BASE_URL,
    routes: [
      ...routes,
      {
        path: '/:pathMatch(.*)*',
        component: () => import('@/pages/404.vue'),
      },
    ],
  },
  ({ app, router, initialState }) => {
    const pinia = createPinia()
    app.use(pinia)

    pinia.state.value = initialState?.pinia || {}

    router.beforeEach((to, from, next) => {
      next()
    })
  }
)
