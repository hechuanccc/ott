import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'login',
            component: function (resolve) {
                require(['./views/login.vue'], resolve)
            },
            meta: {
                auth: false,
                disable_tabs: true
            }
        },
        {
            path: '/ban',
            name: 'ban',
            component: function (resolve) {
                require(['./views/ban.vue'], resolve)
            },
            meta: {
                auth: false,
                disable_tabs: true
            }
        }
    ]
})
