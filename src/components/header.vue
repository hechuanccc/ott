<template>
    <div class="app-header white box-shadow" v-if="showNav">
        <div class="navbar">
            <div class="navbar-item pull-left h5 ng-binding" id="pageTitle">{{$route.meta.title}}</div>

            <div class="dropdown pull-right my">
                <button class="btn white btn-sm dropdown-toggle" @click="$root.dropdown=!$root.dropdown">
                    <span class="dropdown-label">{{$root.username}}</span>
                    <span class="caret"></span>
                </button>
                <div class="dropdown-menu text-left text-sm" v-show="$root.dropdown">
                    <router-link  class="dropdown-item" to="/change_password/">修改密码</router-link>
                    <a class="dropdown-item" @click="logout">退出登录</a>
                </div>
            </div>
            <div class="collapse navbar-toggleable-sm" id="collapse" v-if="$root.$data.userType !== 'agent'">
                <form class="navbar-form form-inline pull-right pull-none-sm navbar-item v-m ng-pristine ng-valid" role="search">
                    <div class="form-group l-h m-a-0">
                        <div class="input-group input-group-sm">
                            <input type="text" class="form-control p-x b-a rounded" v-model="query.username_q" :placeholder="$t('common.search_member')" @focus="showResults()" @keyup="search" @blur="closeResults()">
                            <div class="search-results" v-if="hasResults">
                                <div class="search-items">
                                    <div class="search-item" v-for="r in results">
                                        <router-link :to="'/member/' + r.id">{{r.username}}</router-link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div class="navbar-nav pull-right m-r" v-if="$root.$data.userType !== 'agent'">
                <ul class="nav navbar-nav pull-left prompt">
                    <router-link tag="li" class="nav-item dropdown pos-stc-xs pointer"  :to="'/bill/remit?status=' + status" >
                        <a class="nav-link" >
                            <label class="pointer label">{{$t('header.deposit')}}</label>
                            <span v-if="remit_count" class="label label-sm up warn">{{remit_count}}</span>
                            <span v-else class="label label-sm up ">{{remit_count}}</span>
                        </a>
                    </router-link>
                    <router-link tag="li" class="nav-item dropdown pos-stc-xs pointer" :to="'/bill/withdraw?status=' + status">
                        <a class="nav-link" >
                            <label class="pointer label">{{$t('header.withdraw')}}</label>
                            <span v-if="withdraw_count" class="label label-sm up warn">{{withdraw_count}}</span>
                            <span v-else class="label label-sm up">{{withdraw_count}}</span>
                        </a>
                    </router-link>
                    <router-link tag="li" v-if="agent_application" class="nav-item dropdown pos-stc-xs pointer" to="/agent/applications?status=3">
                        <a class="nav-link" >
                            <label class="pointer label">代理申请</label>
                            <span  class="label label-sm up warn">{{agent_application}}</span>
                        </a>
                    </router-link>
                    <li class="nav-item dropdown pos-stc-xs pointer" >
                        <router-link class="nav-link" to="/member?logined=1">
                            <label class=" label pointer" >{{$t('common.onlinemembers')}}</label>
                            <span v-if="online_member" class="label label-sm up warn">{{online_member}} </span>
                            <span v-else class="label label-sm up">{{online_member}} </span>
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    import api from '../api'
    import Vue from 'vue'
    import VueCookie from 'vue-cookie'
    import $ from '../utils/util'
    import INotify from 'title-notify'

    export default {
        data () {
            return {
                memberApi: api.member,
                query: {
                    username_q: ''
                },
                results: [],
                searchlimit: 5,
                hasResults: false,
                status: [3],
                members_count: '',
                iNotify: '',
                oldTitle: '',
                online_member: '',
                num: 0,
                remit_count: '',
                withdraw_count: '',
                agent_application: ''
            }
        },
        props: {
            showNav: {
                default: true
            }
        },
        created () {
            if ($.storage.fetch().type !== 'agent') {
                this.getCount()
                setInterval(this.getCount, 5000)
            }
        },
        computed: {
            count: function () {
                return this.remit_count + this.withdraw_count + this.agent_application
            }
        },
        watch: {
            count (newObj, old) {
                let vm = this
                if ($.storage.fetch().type !== 'agent' && newObj) {
                    if (!vm.iNotify) {
                        vm.createINotify()
                    }
                    setTimeout(function () {
                        vm.iNotify.setFavicon(newObj)
                    }, 200)
                }
                if (!newObj && vm.iNotify) {
                    vm.iNotify.setTitle().title = vm.oldTitle
                    vm.iNotify.setTitle()
                    vm.iNotify.faviconClear()
                }
            },
            remit_count (newObj, old) {
                if (this.iNotify) {
                    if (newObj > old) {
                        if (old) {
                            this.$root.$data.remit_count = this.remit_count
                        }
                        this.message(newObj, 'remit')
                        this.iNotify.player()
                    } else if (old !== '') {
                        this.iNotify.setFavicon(newObj)
                    }
                }
            },
            withdraw_count (newObj, old) {
                if (newObj > old) {
                    if (old) {
                        this.$root.$data.withdraw_count = this.withdraw_count
                    }
                    this.message(newObj, 'withdraw')
                    this.iNotify.player()
                } else if (old !== '') {
                    this.iNotify.setFavicon(newObj)
                }
            },
            agent_application (newObj, old) {
                if (newObj > old) {
                    if (old) {
                        this.$root.$data.agent_application = this.agent_application
                    }
                    this.message(newObj, 'agent')
                    this.iNotify.player()
                } else if (old !== '') {
                    this.iNotify.setFavicon(newObj)
                }
            }
        },
        methods: {
            createINotify () {
                this.iNotify = new INotify().init({
                    effect: 'flash',
                    interval: 1800,
                    message: '有消息拉！',
                    updateFavicon: {
                    // favicon 字体颜色
                        textColor: '#fff',
                        // 背景颜色，设置背景颜色透明，将值设置为“transparent”
                        backgroundColor: '#ff0000'
                    },
                    audio: {
                        file: 'audio/system.wav' // 可以使用数组传多种格式的声音文件
                    }
                })
                this.iNotify.setTitle(true)
            },
            logout () {
                this.$http.post(api.logout).then((response) => {
                    this.$root.dropdown = false
                    this.loading = true
                    if (response.status === 200) {
                        this.$router.push('/login')
                        this.$cookie.delete('access_token')
                        this.$cookie.delete('refresh_token')
                    }
                }, (response) => {
                    this.loading = false
                    this.errorMsg = response.data.detail
                })
            },
            message (num, messageType) {
                let vm = this
                let url = ''
                let title = ''
                if (messageType === 'remit') {
                    url = '/bill/remit?status[]=' + vm.status
                    title = '公司入款通知'
                } else if (messageType === 'withdraw') {
                    url = '/bill/withdraw?status[]=' + vm.status
                    title = '取款通知'
                } else {
                    url = '/agent/applications'
                    title = '代理申请通知'
                }

                let titleD = vm.iNotify.setTitle()
                this.oldTitle = titleD.title
                vm.iNotify.setTitle('有消息啦！' + title)
                titleD.title = '...'
                this.iNotify.setFavicon(num)
                vm.iNotify.notify({
                    title: title,
                    body: '您有信息待处理',
                    onclick: function () {
                        vm.$router.push(url)
                    }
                })
            },
            getCount () {
                if (this.$route.name !== 'login') {
                    let authenticationCookie = Vue.http.headers.common['Authorization']
                    if (authenticationCookie) {
                        authenticationCookie = authenticationCookie.split(' ').pop()
                    }

                    let userCookie = VueCookie.get('access_token')
                    if (authenticationCookie === userCookie) {
                        let userType = $.storage.fetch().type
                        if (userType !== 'agent') {
                            this.$http.get(api.metrics_count).then(response => {
                                this.remit_count = response.data.remit_count
                                this.withdraw_count = response.data.withdraw_count
                                this.agent_application = response.data.agent_application
                                this.online_member = response.data.online_member
                            }, response => {
                                this.$router.push('/login?next=' + this.$route.path)
                            })
                        }
                    } else {
                        this.$router.push('/login?next=' + this.$route.path)
                    }
                } else if (this.iNotify) {
                    this.iNotify.faviconClear()
                    this.iNotify.setTitle().title = this.oldTitle
                    this.iNotify.setTitle()
                }
            },
            search () {
                if (this.query.username_q) {
                    this.$http.get(api.member + '?username_q=' + this.query.username_q).then((response) => {
                        this.results = response.data
                        this.results = response.data.slice(0, Number(this.searchlimit))
                        if (this.results.length) {
                            this.hasResults = true
                        }
                    }, response => {
                        this.searchErr = response.data.error
                    })
                }
            },
            showResults () {
                if (this.results.length > 0) {
                    this.hasResults = true
                }
            },
            closeResults () {
                setTimeout(() => {
                    this.results = []
                    this.query.username_q = ''
                    this.hasResults = false
                }, 300)
            }
        },
        filters: {
            limit: function (arr, limit) {
                return arr.slice(0, Number(limit))
            }
        }
    }
</script>
<style scoped lang="scss">
    .dropdown-menu {
        display: block;
    }
    .my {
        margin: 12px 0;
    }
    .search-results {
        font-size: 0.875rem;
        color: rgba(0, 0, 0, 0.87);
        border-radius: 3px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        position: absolute;
        top: 100%;
        left: 0;
        z-index: 1000;
        float: left;
        padding: 5px 0;
        margin: 2px 0 0;
        font-size: 1rem;
        color: #373a3c;
        text-align: left;
        list-style: none;
        background-color: #fff;
        width: 100%;
        display: flex;
        flex-direction: column;
    }
    .search-item {
        margin: 5px 0;
    }
    .search-item a {
        color: #2196f3;
        padding: 0px 15px;
    }
    .close {
        display: flex;
        justify-content: flex-end;
        padding: 5px 8px;
    }
    .prompt label.label{
        font-size: 13px;
        padding: 6px 8px;
    }
</style>
