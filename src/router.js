import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
    scrollBehavior: () => ({ y: 0 }),
    routes: [{
        name: 'login',
        path: '/login',
        component: function (resolve) {
            require(['./views/login.vue'], resolve)
        },
        meta: {
            agentPermission: 'true',
            auth: false
        }
    }, {
        path: '/ban',
        name: 'ban',
        component: function (resolve) {
            require(['./views/ban.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true
        }
    }]
})
