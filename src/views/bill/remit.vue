<template>
    <div>
      <form class="form" v-on:submit.prevent="submit">
        <div class="box">
            <div class="box-body clearfix form-inline form-input-sm">
                <div class="row">
                    <div class="col-xs-2">
                        <label class="text-sm">{{$t('bill.order_id')}}</label>
                        <input type="text" v-model="query.id" @keyup="removeSpace()" class="form-control w-sm" />
                    </div>
                    <div class="col-xs-2">
                        <label class="text-sm">{{$t('common.member')}}</label>
                        <input type="text" v-model="query.member_q" class="form-control w-sm" />
                    </div>
                    <div class="col-xs-6">
                        <label class="text-sm">{{$t('common.status')}}</label>
                        <label class="md-check md-check-md m-r">
                            <input type="checkbox" value="1" name="status" v-model="status">
                            <i class="blue"></i>
                            {{$t('status.success')}}
                        </label>
                        <label class="md-check m-r">
                            <input type="checkbox" value="2" name="status" v-model="status">
                            <i class="blue"></i>
                            {{$t('status.failed')}}
                        </label>
                        <label class="md-check m-r">
                            <input type="checkbox" value="3" name="status" v-model="status">
                            <i class="blue"></i>
                            {{$t('status.ongoing')}}
                        </label>
                        <label class="md-check m-r">
                            <input type="checkbox" value="4" name="status" v-model="status">
                            <i class="blue"></i>
                            {{$t('status.canceled')}}
                        </label>
                        <label class="md-check m-r">
                            <input type="checkbox" value="5" name="status" v-model="status">
                            <i class="blue"></i>
                            {{$t('status.declined')}}
                        </label>
                    </div>
                    <div class="col-xs-2">
                        <button class="md-btn w-sm blue pull-right" type="submit">{{$t('common.search')}}</button>
                    </div>
                </div>
                <div class="row m-t">
                    <div class="col-xs-2">
                        <label class="text-sm">{{$t('common.operator')}}</label>
                        <input type="text" v-model="query.updated_by" class="form-control w-sm" />
                    </div>
                    <div class="col-xs-2">
                        <label class="text-sm">{{$t('member.level')}}</label>
                        <level
                          :level="query.member_level"
                          @level-choose="changeFromLevel">
                        </level>
                    </div>
                    <div class="col-xs-4">
                        <label class="text-sm">{{$t('common.applied_at')}}</label>
                        <!--<datepicker :width="'110px'"-->
                                    <!--:value="query.created_at_0"-->
                                    <!--:disabled-days-of-Week="disabled"-->
                                    <!--format="yyyy-MM-dd">-->
                        <!--</datepicker>-->
                        <!--<span>~</span>-->
                        <!--<datepicker :width="'110px'"-->
                                    <!--:value="query.created_at_1"-->
                                    <!--:disabled-days-of-Week="disabled"-->
                                    <!--format="yyyy-MM-dd">-->
                        <!--</datepicker>-->
                    </div>
                    <div class="col-xs-4">
                        <label class="text-sm">{{$t('common.amount')}}</label>
                        <input type="text" v-model="query.amount_gte" class="form-control inline w-sm" /> <span>~</span>
                        <input type="text" v-model="query.amount_lte" class="form-control inline w-sm" />
                    </div>
                </div>
            </div>
        </div>
    </form>
      <div class="box">
          <table class="table table-striped">
              <thead>
                  <tr>
                      <th>{{$t('bill.order_id')}}</th>
                      <th>{{$t('common.member')}}</th>
                      <th>{{$t('member.level')}}</th>
                      <th>{{$t('bill.depositor')}}</th>
                      <th>{{$t('bill.deposited_at')}}</th>
                      <th>{{$t('bank.name')}} - {{$t('bill.remit_payee')}}</th>
                      <th>{{$t('common.amount')}}</th>
                      <th>{{$t('common.operator')}}</th>
                      <th>{{$t('common.status_updated_at')}}</th>
                      <th>{{$t('common.status')}}</th>
                  </tr>
              </thead>
              <tbody v-if="queryset.length >0">
                  <tr v-if="total_amount" class="table-amount">
                      <td colspan="6">总计</td>
                      <td colspan="4">{{total_amount | currency('￥')}}</td>
                  </tr>
                  <tr v-for="t in queryset" >
                      <td>
                        <router-link :to="'/transaction/' + t.id">{{t.id}}</router-link>
                      </td>
                      <td>
                        <router-link :to="'/member/' + t.member.id">{{t.member.username}}</router-link>
                      </td>
                      <td>
                        <router-link :to="'/level/' + t.member.level.id">{{t.member.level.name}}</router-link>
                      </td>
                      <td>{{t.remit_info.depositor}}</td>
                      <td>{{t.remit_info.deposited_at | moment("YYYY-MM-DD HH:mm")}}</td>
                      <td>
                        <router-link :to="'/remit_payee/' + t.remit_info.remit_payee.id" v-if="t.remit_info.remit_payee" >{{t.remit_info.remit_payee.bank.name}} - {{t.remit_info.remit_payee.payee_name}}</router-link>
                          <span v-else> - </span>
                      </td>
                      <td>{{t.amount | currency('￥')}}</td>

                      <td>
                          <span v-if="t.updated_by">{{t.updated_by.username}}</span>
                          <span v-else>-</span>
                      </td>
                      <td>{{t.updated_at | moment("YYYY-MM-DD HH:mm")}}</td>

                      <td>
                          <span class="label success" v-if="t.status===1">{{$t('status.success')}}</span>
                          <span class="label danger" v-if="t.status===5">{{$t('status.declined')}}</span>
                          <span v-if="t.status===3">
                              <button type="button" class="btn btn-xs blue sm-btn m-b-sm f-b" @click="update(t, 1, true, $event)">{{$t('bill.audit')}}</button> <br>
                              <button type="button" class="btn btn-xs  sm-btn f-b label " v-if="$root.permissions.includes('decline_payment')" @click="update(t, 5, true, $event)">{{$t('bill.audit_deny')}}</button>
                          </span>
                      </td>
                  </tr>
              </tbody>
          </table>
          <div class="report-button" v-if="queryset.length">
              <div class="col-xs-2 pull-right">
                  <a :href="href" class="grey-400 md-btn w-sm" :getReport="getReport">{{$t('returnrate.export')}}</a>
              </div>
          </div>
      </div>
      <div class="row m-b-lg">
          <pulling
            :queryset="queryset"
            :extra="'transaction_type=remit'"
            :api="billApi"
            :query="query"
            :amount="total_amount"
            :export_query="export_query"
            @query-data="queryData"
            @param="queryParam"
            @amount="totalAmount"
            @export-query="exportQuery"
            ref="pulling" >
          </pulling>
      </div>
    </div>
</template>
<script>
    import api from '../../api'
    import Datepicker from 'vuejs-datepicker'
    import pulling from '../../components/pulling'
    import transactionStatus from '../../components/transaction_status'
    import { handleError } from '../../utils/handleError'
    import VueCookie from 'vue-cookie'

    export default {
        data () {
            return {
                queryset: [],
                billApi: api.bill,
                query: {
                    id: '',
                    member_q: '',
                    created_at_0: '',
                    created_at_1: '',
                    amount_gte: '',
                    amount_lte: '',
                    status: [],
                    member_level: '',
                    online_payee: '',
                    updated_by: ''
                },
                status: [],
                total_amount: '',
                href: '',
                export_query: []
            }
        },
        watch: {
            status: function (old, newObj) {
                this.query.status = old
            },
            '$root.remit_count' (newObj, old) {
                this.$refs.pulling.rebase()
            },
            '$route': 'nextTickFetch'
        },
        mounted: function () {
            this.$nextTick(function () {
                if (this.$route.query.status) {
                    this.status = this.$route.query.status
                }
            })
        },
        created () {
            this.$nextTick(() => {
                this.$refs.pulling.rebase()
                this.$refs.pulling.getExportQuery()
            })
        },
        computed: {
            getReport () {
                this.href = `${api.report_deposit}?token=${VueCookie.get('access_token')}&report=remit&${this.export_query}`
                return this.queryset.length
            }
        },
        methods: {
            nextTickFetch () {
                let _this = this
                this.queryset = []
                setTimeout(() => {
                    _this.$refs.pulling.rebase()
                    _this.$refs.pulling.getExportQuery()
                }, 100)
            },
            changeFromLevel (val) {
                this.query.member_level = val
                console.log(this.query.member_level)
            },
            queryData (queryset) {
                this.queryset = queryset
            },
            queryParam (query) {
                this.query = query
            },
            totalAmount (amount) {
                console.log(amount)
                console.log('amount' + amount)
                this.total_amount = amount
            },
            exportQuery (expor) {
                console.log(expor)
                this.export_query = expor
            },
            submit () {
                this.$refs.pulling.submit()
                this.$refs.pulling.getExportQuery()
            },
            removeSpace () {
                this.query.id = this.query.id.replace(/[^\d]+/g, '')
            },
            update (transaction, status, confirm, event) {
                // type remit, onlinepay, withdraw
                if (confirm) {
                    if (!window.confirm(this.$t('bill.confirm_declined', {
                        action: event.target.innerText
                    }))) {
                        return
                    }
                }
                if (transaction.id) {
                    this.$http.put(api.bill + transaction.id + '/', {
                        status: status
                    }).then(response => {
                        transaction.status = response.data.status
                    }, response => {
                        this.errorMsg = ''
                        for (let field in this.field_locales) {
                            this.errorMsg += handleError(response, field, this.field_locales)
                        }
                    })
                }
            }
        },
        components: {
            Datepicker,
            pulling,
            transactionStatus,
            level: require('../../components/level')
        }
    }
</script>

<style scoped lang="scss">
    .f-b{font-weight: bold}
</style>
