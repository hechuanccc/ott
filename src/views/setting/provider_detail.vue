<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/provider">娱乐城管理</router-link></li>
                <li class="active">{{$route.meta.title}}</li>
            </ol>
        </div>
        <div class="box">
            <div class="box-header b-b">
                <div class="row">
                    <div class="col-md-4">
                        <h2 class="v-m m-t-sm">{{provider.name}}</h2>
                    </div>
                    <div class="col-md-5 col-md-offset-3 text-right">
                        <router-link class="md-btn md-flat m-r-sm" v-if="$root.permissions.includes('change_provider')"  :to="'/provider/' + provider.id + '/edit'">{{$t('action.update')}}</router-link>
                    </div>
                </div>
            </div>
            <div class="box-body">
                <div class="row m-b p-b b-b">
                    <div class="col-xs-4">
                        <span class="text-muted">{{$t('common.name')}}</span>
                        <div>{{provider.name}}</div>
                    </div>
                    <div class="col-xs-4">
                        <span class="text-muted">{{$t('common.status')}}</span>
                        <div>
                            <span class="label success m-r" v-if="provider.status === 1">{{$t('status.active')}}</span>
                            <span class="label m-r" v-else>{{$t('status.inactive')}}</span>
                            <template v-if="$root.permissions.includes('change_provider')">
                                <a @click="toggleStatus(provider)" v-if="provider.status==1">停用</a>
                                <a @click="toggleStatus(provider)" v-else>启用</a>
                            </template>
                        </div>
                    </div>
                </div>
                <div class="row m-b b-b">
                    <div class="col-xs-4">
                        <span class="text-muted">{{$t('provider.rank')}}</span>
                        <div>{{provider.rank}}</div>
                    </div>
                    <div class="col-xs-4">
                        <span class="text-muted">{{$t('provider.icon')}}</span>
                        <div>
                            <img :src="provider.icon" v-if="provider.icon !== null" width="80">
                        </div>
                    </div>
                </div>
                <div class="row m-b">
                    <div class="col-xs-4">
                        <span class="text-muted">{{$t('provider.maintenance_msg')}} </span>
                        <div v-if="provider.maintenance_msg">{{provider.maintenance_msg}}</div>
                        <div v-else> 未填写 </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import api from '../../api'
    export default {
        data () {
            return {
                provider: [],
                queryset: []
            }
        },
        // route: {
        //     data (transition) {
        //         let id = transition.to.params.providerId
        //         this.getProvider(id)
        //     }
        // },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                let id = to.params.providerId
                if (id) {
                    vm.getProvider(id)
                }
            })
        },
        methods: {
            getProvider (id) {
                this.$http.get(api.provider + id + '/?opt_expand=1').then(response => {
                    this.provider = response.data
                })
            },
            toggleStatus (provider) {
                this.$http.put(api.provider + provider.id + '/', {
                    'status': provider.status === 0 ? 1 : 0
                }).then((response) => {
                    provider.status = response.data.status
                })
            }
        }
    }

</script>

<style>

</style>
