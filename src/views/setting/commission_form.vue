<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/commission">佣金设定</router-link></li>
                <li class="active">{{$route.title}}</li>
            </ol>
        </div>
        <div class="alert alert-danger" v-if="!$root.permissions.includes('change_commission')">{{$t('common.errorPermission')}}</div>
        <form @submit.prevent='onSubmit'>
            <div class="alert alert-success" v-if="deleted === 1">
                <span>反水设定已删除</span>
            </div>

            <div class="alert alert-danger" v-if="deleted === -1">
                <span>{{errorMsg}}</span>
            </div>

            <div class="row m-b-sm">
                <div class="col-xs-12" v-if="commissionsetting.id">
                    <button type="button" class="md-btn md-flat pull-right t-red" @click="deleteCommission" :disabled="commissionsetting.agent_count > 0">删除佣金设定</button>
                    <span class="text-muted v-m pull-right count-label">适用代理商数量：{{commissionsetting.agent_count || 0}}</span>
                </div>
            </div>
            <div class="box">
                <div class="box-body row">
                    <div class="col-xs-4">
                        <div class="clearfix">
                            <label class="col-xs-6 text-right form-control-label">名称 </label>
                            <div class="col-xs-6">
                                <input class="form-control" v-model="commissionsetting.name" required >
                            </div>
                        </div>

                        <div class="clearfix m-t">
                            <label class="col-xs-6 text-right form-control-label">单笔存款手续费上限 </label>
                            <div class="col-xs-6">
                                <input type="number" min="0"  class="form-control" v-model="commissionsetting.deposit_fee_max" required  >
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-4">
                        <div class="clearfix">
                            <label class="col-xs-6 text-right form-control-label">有效会员最低投注额 </label>
                            <div class="col-xs-6">
                                <input type="number" min="0"  class="form-control" v-model="commissionsetting.invest_least" required  >
                            </div>
                        </div>

                        <div class="clearfix m-t">
                            <label class="col-xs-6 text-right form-control-label">单笔取款手续费 </label>
                            <div class="col-xs-6">
                                <input type="number" min="0" class="form-control" v-model="commissionsetting.withdraw_fee" required  >
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-4">
                        <div class="clearfix">
                            <label class="col-xs-6 text-right form-control-label">单笔存款手续费 </label>
                            <div class="col-xs-6">
                                <input type="number" min="0" class="form-control" v-model="commissionsetting.deposit_fee" required  >
                            </div>
                        </div>

                        <div class="clearfix m-t">
                            <label class="col-xs-6 text-right form-control-label">单笔取款手续费上限 </label>
                            <div class="col-xs-6">
                                <input  type="number" min="0"  class="form-control" v-model="commissionsetting.withdraw_fee_max" required  >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="box p-t m-b clearfix" v-for="(group, index) in commissionsetting.groups">
                <div class="clearfix b-b">
                    <div class="col-xs-4">
                        <div class="form-group">
                            <label class="col-xs-3 text-right form-control-label">派彩</label>
                            <div class="inline-form-control">
                                <input type="number" min="0"  class="form-control" v-model="group.threshold" required >
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-xs-3 text-right form-control-label">优惠</label>
                            <div class="inline-form-control">
                                <input type="number" min="0" step="0.1" class="form-control" v-model="group.discount_rate" required>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-4">
                        <div class="form-group">
                            <label class="col-xs-3 text-right form-control-label">有效会员</label>
                            <div class="inline-form-control">
                                <input type="number" min="0"  class="form-control" v-model="group.member_num" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-xs-3 text-right form-control-label">反水</label>
                            <div class="inline-form-control">
                                <input type="number" min="0" step="0.1" class="form-control" v-model="group.return_rate"  required>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-4">
                        <input type="button" v-if="index == 0 & $root.permissions.includes('change_commission')" class="md-btn grey-600 w-sm pull-right m-r" @click="addConfig()" value="新增一组"/>
                        <a v-if="index > 0" class="pull-right m-r" @click="deleteConfig(index)">删除</a>
                    </div>
                </div>
                <div class="col-xs-12 p-t-sm p-b-sm">
                    退佣比 %
                </div>

                <div v-for="rateconfig in group.rates" class="p-r m-b-sm col-xs-6" >
                    <div class="col-xs-2">
                        <label class="m-t label" :class="rateconfig.status==1 ? 'success' : ''">{{rateconfig.name}}</label>
                    </div>

                    <div class="col-xs-2" v-for="t in rateconfig.gamecategories">
                        <div class="md-form-group" >
                            <input class="md-input" type="number" step="0.1" v-model="t.rate" required min="0" max="100" />
                            <label>{{t.name}}</label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-xs-12">
                    <button :disabled="!$root.permissions.includes('change_commission')" type="submit" class="md-btn w-sm blue">{{$t('common.save')}}</button>
                    <span class="text-success m-l-md" v-show="updated">保存成功</span>
                </div>
            </div>
        </form>
    </div>
</template>
<script>
    import api from '../../api'

    export default {
        data () {
            return {
                deleted: 0,
                updated: false,
                defaultProviders: [],
                commissionsetting: {
                    name: '',
                    status: 0,
                    deposit_fee: '',
                    deposit_fee_max: '',
                    invest_least: '',
                    withdraw_fee: '',
                    withdraw_fee_max: '',
                    groups: [{
                        threshold: '',
                        discount_rate: '',
                        return_rate: '',
                        member_num: '',
                        rates: []
                    }]
                }
            }
        },
        // route: {
        //     data (transition) {
        //         this.fetchProviders()
        //         let id = transition.to.params.commissionId
        //         if (id) {
        //             this.getCommissionSetting(id)
        //         }
        //     }
        // },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                let id = to.params.commissionId
                if (id) {
                    vm.getCommissionSetting(id)
                }
            })
        },
        created () {
            this.fetchProviders()
        },
        methods: {
            deleteConfig (index) {
                this.commissionsetting.groups.splice(index, 1)
            },
            fetchProviders () {
                this.$http.get(api.provider_setting + '?opt_fields=provider,name,status,gamecategories').then(response => {
                    this.defaultProviders = response.data
                    if (!this.commissionsetting.id) {
                        this.commissionsetting.groups[0].rates = this.defaultProviders
                    }
                })
            },
            addConfig () {
                this.commissionsetting.groups.push({
                    threshold: '',
                    max: '',
                    check_amount: '',
                    rates: this.defaultProviders
                })
            },
            onSubmit (e) {
                if (this.commissionsetting.id) {
                    this.$http.put(api.commission + this.commissionsetting.id + '/', this.commissionsetting).then(response => {
                        if (response.status === 200) {
                            this.updated = true
                            setTimeout(() => {
                                this.updated = false
                            }, 3000)
                        }
                    })
                } else {
                    this.$http.post(api.commission, this.commissionsetting).then(response => {
                        if (response.status === 201) {
                            this.$router.go('/commission/' + response.data.id + '/edit')
                        }
                    })
                }
            },
            getCommissionSetting (id) {
                this.$http.get(api.commission + id + '/').then((response) => {
                    this.commissionsetting = response.data
                })
            },
            deleteCommission () {
                if (window.confirm('确定删除该佣金设定吗?')) {
                    this.$http.delete(api.commission + this.commissionsetting.id + '/').then(response => {
                        this.deleted = 1
                        setTimeout(() => {
                            this.$router.go('/commission')
                        }, 2000)
                    }, response => {
                        this.deleted = -1
                        this.errorMsg = response.data.detail
                        setTimeout(() => {
                            this.deleted = 0
                        }, 5000)
                    })
                }
            }
        }
    }

</script>
<style scoped>
.count-label {
    padding: 6px;
    margin-right: 10px;
}
.md-form-group {
    padding: 15px 0 5px 0;
}
</style>
