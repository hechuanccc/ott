<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/level">会员等级</router-link></li>
                <li class="active">{{$route.meta.title}}</li>
            </ol>
        </div>
        <div class="box">
            <div class="box-header b-b">
                <div class="row">
                    <div class="col-md-3">
                        <h2 class="v-m  m-t-sm">会员等级：{{name}}</h2>
                    </div>
                    <div class="col-md-6 col-md-offset-3 text-right">
                        <router-link class="md-btn md-flat m-r-sm" to="/level/add"  v-if="$root.permissions.includes('change_level')">新增会员等级</router-link>
                        <router-link class="md-btn md-flat" v-if="$root.permissions.includes('change_level')" :to="'/level/' + id + '/edit'">修改会员等级</router-link>
                        <a class="md-btn md-flat" v-if="$root.permissions.includes('change_level')" @click="deleteLevel(id, $event)">删除会员等级</a>
                    </div>
                </div>
                <div class="alert alert-danger" v-if="responseError">{{responseError}}</div>
            </div>
            <div class="box-body">
                <div class="row m-b p-b b-b">
                    <div class="col-md-4">
                        <span class="text-muted">公司入款限额</span>
                        <div  v-if="remit_limit.lower == ''">不高于{{remit_limit.upper}}</div>
                        <div  v-if="remit_limit.upper == ''">不低于{{remit_limit.lower}}</div>
                        <div v-if="(remit_limit.upper != '') && (remit_limit.lower != '')">{{remit_limit.lower}} 至 {{remit_limit.upper}}</div>
                    </div>
                    <div class="col-md-4">
                        <span class="text-muted">线上支付限额</span>
                        <div  v-if="!online_limit.lower">不高于{{online_limit.upper}}</div>
                        <div  v-if="!online_limit.upper">不低于{{online_limit.lower}}</div>
                        <div v-if="online_limit.upper && online_limit.lower">{{online_limit.lower}} 至 {{online_limit.upper}}</div>
                    </div>
                    <div class="col-xs-4">
                        <span class="text-muted">单次取款限额</span>
                        <div  v-if="!withdraw_limit.lower">不高于{{withdraw_limit.upper}}</div>
                        <div  v-if="!withdraw_limit.upper">不低于{{withdraw_limit.lower}}</div>
                        <div v-if="withdraw_limit.upper && withdraw_limit.lower">{{withdraw_limit.lower}} 至 {{withdraw_limit.upper}}</div>
                    </div>
                </div>
                <div class="row m-b p-b b-b">
                    <div class="col-xs-5">
                        <span class="text-muted">取款手续费</span>
                        <div>{{'¥' + withdraw_fee.rate}}</div>
                    </div>
                    <div class="col-xs-5">
                        <span class="text-muted">取款手续费收取方式</span>
                        <div v-if="withdraw_fee.type==1">免收手续费</div>
                        <div v-if="withdraw_fee.type==2">{{withdraw_fee.hour}} 小时内取款 {{withdraw_fee.times}} 次免收</div>
                        <div v-if="withdraw_fee.type==3">每次皆收</div>
                    </div>
                </div>
                <div class="row m-b p-b b-b">
                    <div class="col-xs-5">
                        <span class="text-muted">是否显示该等级会员的所有报表</span>
                        <div>
                            <span class="label success" v-if="report_flag">启用</span>
                            <span class="label danger" v-else>禁用</span>
                        </div>
                    </div>
                </div>

                <div class="row m-b b-b p-b" >
                    <div class="col-xs-5" >
                        <span class="text-muted">公司入款优惠</span>
                        <table class="table table-sm  light-blue-50 m-t" v-if="remit_discounts.length > 0">
                            <thead>
                                <tr>
                                    <th>存款金额</th>
                                    <th>优惠比例</th>
                                    <th>稽核倍数</th>
                                    <th>优惠上限</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="d in remit_discounts" >
                                    <td>{{d.threshold}}</td>
                                    <td>{{d.rate}}</td>
                                    <td>{{d.check_rate}}</td>
                                    <td><span v-if="d.limit">{{d.limit}}</span><span v-else class="text-muted">无上限</span></td>
                                </tr>
                            </tbody>
                        </table>
                        <div v-else>
                            <span class="label" >未设置公司入款优惠</span>
                        </div>
                    </div>

                    <div class="col-xs-5">
                        <span class="text-muted">线上支付优惠</span>
                        <table class="table table-sm light-blue-50 m-t" v-if="online_discounts.length > 0">
                            <thead>
                                <tr>
                                    <th>存款金额</th>
                                    <th>优惠比例</th>
                                    <th>稽核倍数</th>
                                    <th>优惠上限</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="d in online_discounts" >
                                    <td>{{d.threshold}}</td>
                                    <td>{{d.rate}}</td>
                                    <td>{{d.check_rate}}</td>
                                    <td><span v-if="d.limit">{{d.limit}}</span><span v-else class="text-muted">无上限</span></td>
                                </tr>
                            </tbody>
                        </table>
                        <div v-else ><span class="label">未设定线上支付优惠</span></div>
                    </div>

                </div>

                <div class="row m-b b-b p-b">
                    <div class="col-xs-5">
                        <span class="text-muted">注册送彩金</span>
                        <table class="table table-sm  light-blue-50 m-t" v-if="reg_present">
                            <thead>
                                <tr>
                                    <th>是否启用</th>
                                    <th>管端新增</th>
                                    <th>赠送金额</th>
                                    <th>稽核金额</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr >
                                    <td>
                                        <span class="label rounded success" v-if="reg_present.status ==1">启用</span>
                                        <span class="label rounded danger" v-else>停用</span>
                                    </td>
                                    <td>
                                        <span class="label rounded success" v-if="reg_present.allow_add ==1">允许</span>
                                        <span class="label rounded danger" v-else>不允许</span>
                                    </td>
                                    <td>{{reg_present.amount}}</td>
                                    <td>{{reg_present.check_amount}}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div v-else>
                            <span class="label">未设定</span>
                        </div>
                    </div>
                    <div class="col-xs-5">
                        <span class="text-muted">存款稽核比</span>
                        <table class="table table-sm light-blue-50 m-t" v-if="deposit_check">
                            <thead>
                                <tr>
                                    <th>公司存款</th>
                                    <th>线上支付</th>
                                    <th>点卡支付</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr >
                                    <td>
                                        <span v-if="deposit_check.remit_pay">{{deposit_check.remit_pay}}%</span>
                                        <span v-else class="label">未设定</span>
                                    </td>
                                    <td>
                                        <span v-if="deposit_check.online_pay">{{deposit_check.online_pay}}%</span>
                                        <span v-else class="label">未设定</span>
                                    </td>
                                    <td>
                                        <span v-if="deposit_check.card_pay">{{deposit_check.card_pay}}%</span>
                                        <span v-else class="label">未设定</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div v-else>
                            <span class="label">未设定</span>
                        </div>
                    </div>
                </div>

                <div class="row m-b b-b p-b">
                    <div class="col-xs-5">
                        <span class="text-muted">行政费用比例</span>
                        <div  v-if="service_rate">{{service_rate}}%</div>
                    </div>
                    <div class="col-xs-5">
                        <span class="text-muted">备注</span>
                        <div  v-if="memo">{{memo}}</div>
                        <div  v-else>暂无备注</div>
                    </div>
                </div>

                <div class="row p-b b-b">
                    <div class="col-xs-5">
                        <span class="text-muted">可使用的公司入款账号 共 {{remit_payee.length}} 个</span>
                        <div>
                            <router-link :to="'/remit_payee/' + p.id" v-for="p in remit_payee" class="m-r text-blue">{{p.payee_name}}</router-link>
                        </div>
                    </div>
                    <div class="col-xs-4">
                        <span class="text-muted">可使用的线上支付商户 共 {{online_payee.length}}  个</span>
                        <div>
                            <router-link :to="'/online_payee/' + p.id" v-for="p in online_payee" class="m-r text-blue">{{p.name}}</router-link>
                        </div>
                    </div>
                </div>

                <div class="row p-t">
                    <div class="col-xs-5">
                        <span class="text-muted">目前会员人数：{{member_count}} </span>
                        <div>
                            <router-link to="/member?level=1">查看该等级所有会员</router-link>
                        </div>
                    </div>
                    <div class="col-xs-5">
                        <span class="text-muted">目前代理人数：{{agent_count}}</span>
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
            remit_discounts: [{
                threshold: '',
                rate: '',
                checkRate: '',
                limit: ''
            }],
            online_discounts: [{
                threshold: '',
                rate: '',
                checkRate: '',
                limit: ''
            }],
            online_discount: [],
            id: '',
            name: '',
            remit_limit: {
                lower: '',
                upper: ''
            },
            online_limit: {
                lower: '',
                upper: ''
            },
            withdraw_limit: {
                lower: '',
                upper: ''
            },
            withdraw_fee: {
                rate: '',
                type: '',
                hour: '',
                times: ''
            },
            memo: '',
            service_rate: '',
            reg_present: {
                status: 0,
                allowAdd: 0,
                amount: '',
                checkAmount: ''
            },
            deposit_check: {
                company: '',
                online: '',
                card: ''
            },
            remit_payee: [],
            responseError: '',
            online_payee: [],
            report_flag: '',
            member_count: '',
            agent_count: ''
        }
    },
    // route: {
    //     data (transition) {
    //         this.id = transition.to.params.levelId
    //         this.getLevel(this.id)
    //     }
    // },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.id = to.params.levelId
            console.log('id ' + vm.id)
            vm.getLevel(vm.id)
        })
    },
    methods: {
        deleteLevel (id, event) {
            if (!window.confirm(this.$t('common.confirm', {
                action: event.target.innerText
            }))) {
                return
            }
            this.$http.delete(api.level + id).then((response) => {
                this.$router.push('/level')
            }, response => {
                this.responseError = response.data.error[0].level
            })
        },
        getLevel (id) {
            this.$http.get(api.level + id).then((response) => {
                let keys = Object.keys(response.data)
                for (let i = 0; i < keys.length; i++) {
                    this[keys[i]] = response.data[keys[i]]
                }
                // this.data = Object.assign(this.$data, response.data)
                // this.member_count = response.data.member_count || this.$data.member_count
                // this.agent_count = response.data.agent_count || this.$data.agent_count
                console.log(response.data)
            }, response => {
                if (('' + response.status).indexOf('4') === 0) {
                    this.$router.push('/login?next=' + this.$route.path)
                }
            })
        }
    }
}
</script>
