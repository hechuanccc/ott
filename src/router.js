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
    },
    {
        path: '/ban',
        name: 'ban',
        component: function (resolve) {
            require(['./views/ban.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true
        }
    },
    {
        path: '/',
        name: 'overview',
        component: function (resolve) {
            require(['./views/overview.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true
        }
    },
    {
        path: '/bill/remit',
        name: 'bill-remit',
        component: function (resolve) {
            require(['./views/bill/remit.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: 'bill.remit_audit',
            permission: 'list_remit_online_withdraw_page'
        }
    },
    {
        path: '/bill/online',
        name: 'bill-online',
        component: function (resolve) {
            require(['./views/bill/online.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: 'bill.online_payment',
            group: 'bill',
            permission: 'list_remit_online_withdraw_page'
        }
    },
    {
        path: '/bill/withdraw',
        name: 'bill-withdraw',
        component: function (resolve) {
            require(['./views/bill/withdraw.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: 'bill.withdrawal_audit',
            group: 'bill',
            permission: 'list_remit_online_withdraw_page'
        }
    },
    {
        path: '/bill/search',
        name: 'bill-search',
        component: function (resolve) {
            require(['./views/bill/search.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            group: 'bill',
            title: 'bill.transcations_query'
        }
    },
    {
        path: '/transaction/:id',
        name: 'transaction',
        component: function (resolve) {
            require(['./views/bill/detail.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            group: 'bill',
            title: 'nav.transaction'
        }
    },
    {
        path: '/bill/returnrate',
        name: 'bill-returnrate',
        component: function (resolve) {
            require(['./views/bill/returnrate.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: 'bill.return_report',
            group: 'bill'
        }
    },
    {
        path: '/bill/returnrate/:returnId',
        name: 'bill-returnrate',
        component: function (resolve) {
            require(['./views/bill/returnrate_detail.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: 'nav.returnrate',
            group: 'bill'
        }
    },
    {
        path: '/bill/operation',
        name: 'bill-operation',
        component: function (resolve) {
            require(['./views/bill/operation.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: 'nav.operation',
            permission: 'manual_deposit_withdraw',
            group: 'bill'
        }
    },
    {
        path: '/bill/commission',
        name: 'bill-commission',
        component: function (resolve) {
            require(['./views/bill/commission.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: 'nav.commission',
            permission: 'calculate_commission',
            group: 'bill'
        }
    },
    {
        path: '/report/game',
        name: 'report_game',
        component: function (resolve) {
            require(['./views/report/game_report.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: 'nav.game_report',
            group: 'report'
        }
    },
    {
        path: '/test',
        name: 'test',
        component: function (resolve) {
            require(['./views/ban.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            permission: 'sex'
        }
    },
    {
        path: '/level',
        component: function (resolve) {
            require(['./views/setting/level.vue'], resolve)
        },
        meta: {
            auth: true,
            group: 'setting'
        }
    },
    {
        path: '/level/add',
        component: function (resolve) {
            require(['./views/setting/level_form.vue'], resolve)
        },
        meta: {
            auth: true,
            group: 'setting'
        }
    },
    {
        path: '/level/:levelId',
        component: function (resolve) {
            require(['./views/setting/level_detail.vue'], resolve)
        },
        meta: {
            auth: true,
            group: 'setting'
        }
    },
    {
        path: '/level/:levelId/edit',
        component: function (resolve) {
            require(['./views/setting/level_form.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true
        }
    },
    {
        path: '/online_payee',
        component: function (resolve) {
            require(['./views/setting/online_payee.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true
        }
    },
    {
        path: '/online_payee/add',
        component: function (resolve) {
            require(['./views/setting/online_payee_form.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true
        }
    },
    {
        path: '/online_payee/:online_payeeId',
        component: function (resolve) {
            require(['./views/setting/online_payee_detail.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true
        }
    },
    {
        path: '/online_payee/:online_payeeId/edit',
        component: function (resolve) {
            require(['./views/setting/online_payee_form.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true
        }
    },
    {
        path: '/paymenttype',
        component: function (resolve) {
            require(['./views/setting/payment_type.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true
        }
    },
    {
        path: '/paymenttype/:id/edit',
        component: function (resolve) {
            require(['./views/setting/payment_form.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true,
            permission: 'change_paymenttype'
        }
    },
    {
        path: '/remit_payee',
        component: function (resolve) {
            require(['./views/setting/payee.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true
        }
    },
    {
        path: '/remit_payee/add',
        component: function (resolve) {
            require(['./views/setting/payee_form.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true
        }
    },
    {
        path: '/remit_payee/:payeeId',
        component: function (resolve) {
            require(['./views/setting/payee_detail.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true
        }
    },
    {
        path: '/remit_payee/:payeeId/edit',
        component: function (resolve) {
            require(['./views/setting/payee_form.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true
        }
    },
    {
        path: '/return',
        component: function (resolve) {
            require(['./views/setting/return.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true
        }
    },
    {
        path: '/return/add',
        component: function (resolve) {
            require(['./views/setting/return_form.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true
        }
    },
    {
        path: '/return/:returnId/edit',
        component: function (resolve) {
            require(['./views/setting/return_form.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true
        }
    },
    {
        path: '/commission',
        component: function (resolve) {
            require(['./views/setting/commission.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true
        }
    },
    {
        path: '/commission/add',
        component: function (resolve) {
            require(['./views/setting/commission_form.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true
        }
    },
    {
        path: '/commission/:commissionId/edit',
        component: function (resolve) {
            require(['./views/setting/commission_form.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true
        }
    },
    {
        path: '/provider',
        component: function (resolve) {
            require(['./views/setting/provider.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true
        }
    }, {
        path: '/provider/:providerId',
        component: function (resolve) {
            require(['./views/setting/provider_detail.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true
        }
    }, {
        path: '/provider/:providerId/edit',
        component: function (resolve) {
            require(['./views/setting/provider_form.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true
        }
    }, {
        path: '/provider/add',
        component: function (resolve) {
            require(['./views/setting/provider_form.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true
        }
    }, {
        path: '/staff',
        component: function (resolve) {
            require(['./views/setting/staff.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true
        }
    }, {
        path: '/staff/add',
        component: function (resolve) {
            require(['./views/setting/staff_form.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true
        }
    }, {
        path: '/staff/:staffId',
        component: function (resolve) {
            require(['./views/setting/staff_detail.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true
        }
    }, {
        path: '/staff/:staffId/edit',
        component: function (resolve) {
            require(['./views/setting/staff_form.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true
        }
    }, {
        path: '/envelope_settings',
        component: function (resolve) {
            require(['./views/envelope/envelope_config.vue'], resolve)
        },
        meta: {
            group: 'envelopes',
            auth: true,
            title: '红包设定'
        }
    }, {
        path: '/envelope_settings/add',
        component: function (resolve) {
            require(['./views/envelope/envelope_config_form.vue'], resolve)
        },
        meta: {
            group: 'envelopes',
            auth: true,
            title: '新增红包组'
        }
    }, {
        path: '/envelope_settings/:envelopeId/edit',
        component: function (resolve) {
            require(['./views/envelope/envelope_config_form.vue'], resolve)
        },
        meta: {
            group: 'envelopes',
            auth: true,
            title: '编辑红包组'
        }
    }, {
        path: '/envelope',
        component: function (resolve) {
            require(['./views/envelope/envelope.vue'], resolve)
        },
        meta: {
            group: 'envelopes',
            auth: true,
            title: '红包'
        }
    }, {
        path: '/envelope/add',
        component: function (resolve) {
            require(['./views/envelope/envelope_form.vue'], resolve)
        },
        meta: {
            group: 'envelopes',
            auth: true,
            title: '新增红包'
        }
    }, {
        path: '/envelope/:envelopeId/edit',
        component: function (resolve) {
            require(['./views/envelope/envelope_form.vue'], resolve)
        },
        meta: {
            group: 'envelopes',
            auth: true,
            title: '编辑红包'
        }
    }, {
        path: '/banner',
        component: function (resolve) {
            require(['./views/manage/banner.vue'], resolve)
        },
        meta: {
            group: 'manage',
            auth: true
        }
    }, {
        path: '/announcement',
        component: function (resolve) {
            require(['./views/manage/announcement.vue'], resolve)
        },
        meta: {
            group: 'manage',
            auth: true
        }
    }, {
        path: '/website',
        component: function (resolve) {
            require(['./views/manage/website.vue'], resolve)
        },
        meta: {
            group: 'manage',
            auth: true
        }
    }]
})
