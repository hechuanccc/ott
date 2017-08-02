<template>
    <div>
            <div class="m-b">
                <ol class="breadcrumb">
                    <li class="active"><router-link to="/level">会员等级</router-link></li>
                    <li class="active">{{$route.meta.title}}</li>
                </ol>
            </div>
            <div class="alert alert-danger" v-show="!$root.permissions.includes('change_level')">{{$t('common.errorPermission')}}</div>
            <div class="box">
            <div class="box-body">
                <form class="form m-a" v-on:submit.prevent="onSubmit">
                    <div class="row b-b p-b m-b">
                        <div class="col-xs-5">
                            <div class="form-group p-b">
                                <label for="level-name" class="label-width">名称 </label>
                                <div class="inline-form-control">
                                    <input class="form-control w-sm" v-model="name" required  id="level-name">
                                </div>
                            </div>
                            <div class="form-group p-b">
                                <label for="agent" class="label-width">公司入款限额 </label>
                                <input  class="form-control w-sm inline" type="number" placeholder="下限或留空" v-model="remit_limit.lower"  >
                                <span> ~ </span>
                                <input  class="form-control w-sm inline" type="number" name="agent" placeholder="上限或留空" v-model="remit_limit.upper"  >
                            </div>

                            <div class="form-group p-b">
                              <label for="agent" class="label-width">线上支付限额 </label>
                                <input  class="form-control w-sm inline" type="number" placeholder="下限或留空" v-model="online_limit.lower"  >
                                <span> ~ </span>
                                <input  class="form-control w-sm inline" type="number" name="agent" placeholder="上限或留空" v-model="online_limit.upper">
                            </div>
                            <div class="form-group b-b p-b">
                              <label for="agent" class="label-width">单次取款限额 </label>
                                <input  class="form-control w-sm inline" type="number" placeholder="下限或留空" v-model="withdraw_limit.lower"  >
                                <span> ~ </span>
                                <input  class="form-control w-sm inline" type="number" name="agent" placeholder="上限或留空" v-model="withdraw_limit.upper" >
                            </div>
                            <div class="form-group">
                                <label for="realname" class="label-width">取款手续费</label>
                                <div class="inline-form-control">
                                    <input class="form-control w-sm" type="number" name="realname" placeholder="比如：100" v-model="withdraw_fee.rate" required>
                                </div>
                            </div>
                            <div class="form-group p-b b-b ">
                                <label for="phone" >取款手续费收取方式</label>
                                <div>
                                    <label class="radio md-check md-check-md m-b text-muted">
                                        <input type="radio" value="0" name="gender" v-model="withdraw_fee.type">
                                        <i class="blue"></i>
                                        免手续费
                                    </label>
                                </div>
                                <div>
                                    <label class="radio md-check md-check-md m-b text-muted" >
                                        <input type="radio" value="2" name="gender" v-model="withdraw_fee.type">
                                        <i class="blue"></i>
                                        视具体情况
                                    </label>
                                    <div class="w-auto inline m-l-md m-b-md text-muted">
                                        <input type="number" class="form-control xsm-input inline" v-model="withdraw_fee.hour" :disabled="withdraw_fee.type!=2"/>
                                        <span> &nbsp;小时内取款&nbsp; </span>
                                        <input type="number" class="form-control xsm-input inline" v-model="withdraw_fee.times" :disabled="withdraw_fee.type!=2"/>
                                        <span> &nbsp;次免收 </span>
                                    </div>
                                </div>
                                <div>
                                    <label class="radio md-check md-check-md m-b text-muted" >
                                        <input type="radio" value="1" name="gender" v-model="withdraw_fee.type">
                                        <i class="blue"></i>
                                        每次皆收
                                    </label>
                                </div>

                                <div class="text-danger">会员申请取款时，若有任何一笔存款稽核未通过，都将强制收取手续费。</div>

                            </div>
                            <div class="row m-b p-b b-b">
                                <div class="col-xs-8">
                                    <span class="text-muted">是否显示该等级会员的所有报表</span>
                                    <div class="m-t">
                                        <span class="label success" v-show="report_flag">显示</span>
                                        <span class="label danger" v-show="!report_flag">隐藏</span>
                                        <a class="text-sm m-l" @click="report_flag = !report_flag" v-show="report_flag" >隐藏</a>
                                        <a class="text-sm m-l" @click="report_flag = !report_flag" v-show="!report_flag" >显示</a>
                                    </div>
                                </div>
                            </div>


                            <div class="form-group m-t-md">
                                <label for="serviceRate" class="label-width">行政费用比</label>
                                <div class="inline-form-control">
                                    <input type="number" class="form-control w-lg inline" placeholder="存款稽核没有通过时，行政费用的金额比例" required v-model="service_rate">
                                    <span class="inline"> &nbsp; %</span>
                                </div>
                            </div>


                            <div class="form-group" >
                              <label for="memo">备注</label>
                              <textarea class="form-control" rows="2" v-model="memo"></textarea>
                            </div>
                        </div>
                        <div class="col-xs-6 col-xs-offset-1">
                            <div class="form-group p-b b-b">
                                <label for="birthday" class="label-width">公司入款优惠</label>
                                <input type="button" class="btn grey-600 btn-sm pull-right" @click="addDiscounts(remit_discounts, 1)" value="新增一组"/>
                                <div class="row text-muted">
                                    <label class="col-xs-2">存款金额</label>
                                    <label class="col-xs-2">优惠比例</label>
                                    <label class="col-xs-2">稽核倍数</label>
                                    <label class="col-xs-2">优惠上限</label>
                                </div>
                                <div class="form-group row " v-for="(remit_discount, index) in remit_discounts">
                                    <div class="col-xs-2">
                                        <input type="number" :required="isRequired(remit_discount)" class="form-control" v-model="remit_discount.threshold">
                                    </div>
                                    <div class="col-xs-2">
                                        <input type="number" :required="isRequired(remit_discount)" class="form-control" v-model="remit_discount.rate">
                                    </div>
                                    <div class="col-xs-2">
                                        <input type="number" :required="isRequired(remit_discount)" class="form-control" v-model="remit_discount.check_rate">
                                    </div>
                                    <div class="col-xs-2">
                                        <input type="number" placeholder="可留空" class="form-control input-sm" v-model="remit_discount.limit">
                                    </div>
                                    <div class="col-xs-4">
                                        <a class="pull-right" v-if="index > 0"  @click="deleteDiscount(remit_discounts, index)">删除</a>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group m-t-md p-b b-b">
                                <label for="birthday" class="label-width">线上支付优惠</label>
                                <input type="button" class="btn grey-600 btn-sm pull-right" @click="addDiscounts(online_discounts, 2)" value="新增一组"/>
                                <div class="row text-muted">
                                    <label class="col-xs-2">存款金额</label>
                                    <label class="col-xs-2">优惠比例</label>
                                    <label class="col-xs-2">稽核倍数</label>
                                    <label class="col-xs-2">优惠上限</label>
                                </div>
                                <div class="form-group row" v-for="(online_discount, index) in online_discounts">
                                    <div class="col-xs-2">
                                        <input type="number" :required="isRequired(online_discount)" v-model="online_discount.threshold" class="form-control" >
                                    </div>
                                    <div class="col-xs-2">
                                        <input type="number" :required="isRequired(online_discount)" v-model="online_discount.rate" class="form-control">
                                    </div>
                                    <div class="col-xs-2">
                                        <input type="number" :required="isRequired(online_discount)" v-model="online_discount.check_rate" class="form-control">
                                    </div>
                                    <div class="col-xs-2">
                                        <input type="number" v-model="online_discount.limit" placeholder="可留空" class="form-control input-sm">
                                    </div>
                                    <div class="col-xs-4 block">
                                        <a class="pull-right" v-if="index > 0" @click="deleteDiscount(online_discounts, index)">删除</a>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group m-t-md ">
                                <label for="birthday" class="label-width">注册送彩金</label>
                                <div class="row text-muted">
                                    <label class="col-xs-2">是否启用</label>
                                    <label class="col-xs-2">管端新增</label>
                                    <label class="col-xs-2">赠送金额</label>
                                    <label class="col-xs-2">稽核金额</label>
                                </div>
                                <div class="form-group row p-b-md b-b">
                                    <div class="col-xs-2">
                                        <label class="ui-switch info m-t-xs m-r">
                                            <input type="checkbox" v-model="reg_present.status">
                                            <i class="grey-200"></i>
                                        </label>
                                    </div>
                                    <div class="col-xs-2">
                                        <label class="ui-switch info m-t-xs m-r">
                                            <input type="checkbox" v-model="reg_present.allow_add">
                                            <i></i>
                                        </label>
                                    </div>
                                    <div class="col-xs-2">
                                        <input type="number" class="form-control"  v-model="reg_present.amount">
                                    </div>
                                    <div class="col-xs-2">
                                        <input type="number" class="form-control input-sm" v-model="reg_present.check_amount">
                                    </div>
                                </div>
                            </div>
                            <div class="form-group m-t-md ">
                                <label for="birthday" class="label-width">存款稽核比</label>
                                <div class="form-group row text-muted">
                                    <div class="col-xs-3">
                                        <label >公司入款  %</label>
                                        <input type="number" class="form-control" v-model="deposit_check.remit_pay">
                                    </div>
                                    <div class="col-xs-3">
                                        <label >线上支付 %</label>
                                        <input type="number" class="form-control"  v-model="deposit_check.online_pay">
                                    </div>
                                    <div class="col-xs-3">
                                        <label >点卡支付 %</label>
                                        <input type="number" class="form-control"  v-model="deposit_check.card_pay">
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div>
                        <div class="alert alert-danger" v-show="responseError">{{responseError}}</div>
                        <button :disabled="!$root.permissions.includes('change_level')" type="submit" class="md-btn w-sm blue">{{$t('common.save')}}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

</template>
<script>
import api from '../../api'
import { handleError } from '../../utils/handleError'

export default {
    data () {
        return {
            id: '',
            remit_discounts: [{
                type: 1
            }],
            online_discounts: [{
                type: 2
            }],
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
                value: '',
                type: '',
                hour: '',
                times: ''
            },
            field_locales: {
                'remit_limit_upper': '公司支付限额有误：',
                'online_limit_upper': '线上支付限额有误：',
                'withdraw_limit_upper': '单次取款限额有误：',
                'service_rate': '行政费用比例：'
            },
            responseError: '',
            memo: '',
            service_rate: '',
            reg_present: {
                status: 0,
                allow_add: 0,
                amount: 0,
                check_amount: 0
            },
            deposit_check: {
                remit_pay: '',
                online_pay: '',
                card_pay: ''
            },
            report_flag: true
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            let id = to.params.levelId
            if (id) {
                vm.getLevel(id)
            }
        })
    },
    methods: {
        isRequired (discount) {
            if ((discount.rate || discount.threshold || discount.check_rate) === '') {
                return false
            }
            return discount.rate || discount.threshold || discount.check_rate
        },
        verifyDiscounts (discounts) {
            for (let idx in discounts) {
                let d = discounts[idx]
                if (!d.rate && !d.threshold & !d.check_rate) {
                    discounts.splice(idx, 1)
                }
            }
        },
        addDiscounts (target, type) {
            if (target.length <= 5) {
                target.push({
                    type: type
                })
            }
        },
        deleteDiscount (target, index) {
            target.splice(index, 1)
        },
        onSubmit (e) {
            if (this.$data.id) {
                this.verifyDiscounts(this.remit_discounts)
                this.verifyDiscounts(this.online_discounts)
                this.$http.put(api.level + this.$data.id + '/', this.$data).then(response => {
                    if (response.status === 200) {
                        this.$router.push('/level/' + response.data.id)
                    }
                }, response => {
                    this.responseError = ''
                    for (let field in this.field_locales) {
                        this.responseError += handleError(response, field, this.field_locales)
                    }
                })
            } else {
                this.verifyDiscounts(this.remit_discounts)
                this.verifyDiscounts(this.online_discounts)
                this.$http.post(api.level, this.$data).then(response => {
                    if (response.status === 201) {
                        this.$router.push('/level/' + response.data.id)
                    }
                }, response => {
                    this.responseError = ''
                    for (let field in this.field_locales) {
                        this.responseError += handleError(response, field, this.field_locales)
                    }
                })
            }
        },
        getLevel (id) {
            this.$http.get(api.level + id + '/').then((response) => {
                let data = response.data
                let onlineDiscounts = data.online_discounts
                if (onlineDiscounts.length === 0) {
                    data.online_discounts = [{
                        type: 2
                    }]
                }

                let regPresent = data.reg_present
                if (regPresent === null) {
                    data.reg_present = this.$data.reg_present
                }

                let remitDiscounts = data.remit_discounts
                if (remitDiscounts.length === 0) {
                    data.remit_discounts = [{
                        type: 1
                    }]
                }
                this.$data = Object.assign(this.$data, data)
            })
        }
    }
}
</script>
