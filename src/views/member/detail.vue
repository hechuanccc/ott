<template>
    <div>
      <div class="m-b">
        <ol class="breadcrumb">
          <li class="active"><router-link to="/member?report_flag=True">会员</router-link></li>
          <li class="active">{{$route.meta.title}}</li>
        </ol>
      </div>
      <div class="box">
        <div class="box-header b-b">
          <div class="alert alert-success" v-if="passwordChanged >= 1">
            <span v-if="passwordChanged === 1">登录密码已修改为：</span>
            <span v-if="passwordChanged === 2">取款密码已修改为：</span>
            <strong>{{newPassword}}</strong>
          </div>

          <div class="alert alert-danger" v-if="passwordChanged === -1">
            修改失败：{{errorMsg}}
          </div>
          <div class="alert alert-success" v-if="balanceUpdated === 1">
            <span>{{$t('common.refresh_successfully')}}</span>
          </div>
          <div class="row">
            <div class="col-xs-2">
              <h2><strong>{{member.username}}</strong></h2>
              <span class="text-muted text-sm" v-if="member.created_at">于 {{ member.created_at | moment("YYYY-MM-DD HH:mm")}} {{$t('common.register')}}</span>
            </div>
            <div class="col-xs-10 text-right">
              <div>
                <router-link class="md-btn md-flat m-r-sm"  :to="'/report/actionrecord?username=' + member.username">{{$t('action.view_action_record')}}</router-link>
                <a class="md-btn md-flat m-r-sm" @click="getAccountUpdate(member.id)">
                  <i v-if="balanceLoading" class="fa fa-spin fa-spinner"></i>
                  <i v-else></i>
                  <span> {{$t('action.refresh_balance')}} </span>
                </a>
                <router-link class="md-btn md-flat m-r-sm"  :to="'/report/betrecord?member=' + member.username + '&created_at_0=' + today + '&created_at_1=' + today">{{$t('action.view_today_bet_recoard')}}</router-link>
                <template v-if="$root.permissions.includes('update_member_details')">
                  <a class="md-btn md-flat m-r-sm" v-if="$root.permissions.includes('reset_member_password')" @click="resetPassword(1, $event)">{{$t('action.reset_password')}}</a>
                  <a class="md-btn md-flat m-r-sm" v-if="$root.permissions.includes('reset_member_withdraw_password')" @click="resetPassword(2, $event)">{{$t('action.reset_withdraw_password')}}</a>
                  <router-link class="md-btn md-flat" :to="'/member/' + member.id + '/edit'">{{$t('action.update_member')}}</router-link>
                  <a class="md-btn md-flat" @click="changeAudit">{{$t('action.change_audit_status')}}</a>
                </template>
              </div>
            </div>
          </div>
        </div>
        <div class="box-body">
          <div class="row b-b p-b m-b" v-if="member.balance">
            <div class="col-xs-2">
              <span class="text-muted">{{$t('member.balance')}}</span>
              <div>
                <strong class="text-lg text-success">{{member.balance.balance | currency('￥')}}</strong>
              </div>
            </div>
            <div class="col-xs-2">
              <span class="text-muted">{{$t('member.balance_providers')}}</span>
              <div>
                <strong class="text-lg text-success">{{gameAccounts | currency('￥')}}</strong>
              </div>
            </div>
            <div class="col-xs-2">
              <span class="text-muted">{{$t('member.sug_balance')}}</span>
              <div>
                <strong class="text-lg text-danger">{{member.suggested_balance | currency('￥')}}</strong>
              </div>
            </div>
            <div class="col-xs-5">
              <div class="m-b">
                <span class="text-muted">当前稽核：</span>
                <span class="t-red" v-if="member.balance.bet_amount < member.balance.audit_amount">未通过</span>
                <span class="t-green" v-else>通过</span>
                <strong class="t-red m-l-lg">{{member.balance.bet_amount}} / {{member.balance.audit_amount}}</strong>
              </div>
              <router-link :to="'/bill/operation?member=' + member.username" v-if="$root.permissions.includes('manual_deposit_withdraw')" class="m-r">{{$t('member.manual_adjust')}}</router-link>
              <a @click="showAccounts = !showAccounts">
                <span v-if="!showAccounts">{{$t('member.view_all_accounts')}} <i class="fa fa-angle-down"></i></span>
                <span v-else>{{$t('member.hide_all_accounts')}} <i class="fa fa-angle-up"></i></span>
              </a>
            </div>

            <div class="col-xs-12">
              <div class="lh-md m-t-sm label-width-eq m-b-sm" v-if="showAccounts">
                <div class="row">
                <div class="loading" v-if="loading"><i class='fa fa-circle-o-notch fa-spin'></i></div>
                <div class="col-xs-3 m-t" v-else v-for="account in accounts">
                  <providerform :account="account" :member="member" :getmember="getMember" :getaccounts="getAccounts" :balanceloading="balanceLoading" :isactive="providerActive" @click.native="toggleProvider(account.provider.name)"></providerform>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row m-b b-b p-b">
            <div class="col-xs-4">
              <strong class="text-muted">{{$t('member.fund_summary')}}</strong>
              <div class="label-width-eq m-t-sm">
                <div v-for="t in member.transaction_info.confirmed">
                  <span class="text-muted">{{t.transaction_type__display_name}}</span>
                  <span class="pull-right">
                      <span class="t-red" v-if="t.transaction_type__code === 'withdraw' || parseFloat(t.amount__sum) < 0"> {{t.amount__sum}}</span>
                      <span class="t-green" v-else> + {{t.amount__sum}}</span>
                      <router-link class="link-width" :to="'/bill/search?member=' + member.username + '&status=1&transaction_type=' + t.transaction_type__code" >{{t.id__count}} 次 </router-link>
                  </span>
                </div>
                <div v-if="!member.transaction_info.confirmed || member.transaction_info.confirmed.length === 0" class="text-muted">{{$t('member.no_confirmed_transactions')}}</div>
                <div v-if="sumAmount" class="b-t p-t-sm m-t-sm">
                  <span>{{$t('member.fund_sum')}}</span>
                  <span class="pull-right">
                      <strong class="t-green">{{sumAmount | currency('￥')}}</strong>
                      <a class="link-width">&nbsp;</a>
                  </span>
                </div>
              </div>
            </div>
            <div class="col-xs-4 col-md-offset-1">
              <strong class="text-muted title">{{$t('member.audit_list')}}</strong>
              <div class="label-width-eq m-t-sm">
                <div v-for="t in member.transaction_info.ongoing">
                  <span class="text-muted">{{t.transaction_type__display_name}}</span>
                  <span class="pull-right">
                      <span class="t-grey">{{t.amount__sum | currency('￥')}}</span>
                      <router-link class="link-width" :to="'/bill/search?member=' + member.username + '&status=3&transaction_type=' + t.transaction_type__code" >{{t.id__count}} 次 </router-link>
                  </span>
                </div>
                <div v-if="!member.transaction_info.ongoing || member.transaction_info.ongoing.length === 0" class="text-muted">{{$t('member.no_ongoing_transactions')}}</div>
              </div>
            </div>

          </div>
          <div class="row p-b b-b">
            <div class="col-xs-5">
              <span class="text-muted title">{{$t('member.status')}}</span>
              <div>
                <span class="label success" v-if="member.status==1" >{{$t('status.active')}}</span>
                <span class="label" v-else >{{$t('status.inactive')}}</span>
                <template v-if="$root.permissions.includes('update_member_details')">
                  <a class="text-sm m-l" @click="toggleStatus" v-if="member.status==1" >禁用</a>
                  <a class="text-sm m-l" @click="toggleStatus" v-else >启用</a>
                  <span class="text-success text-sm m-l" v-show="statusUpdated" @click="toggleStatus">状态已更新</span>
                </template>
              </div>
            </div>
            <div class="col-md-5">
              <div class="row">
                <div class="col-md-5">
                  <span class="text-muted">{{$t('betrecord.win')}}</span>
                  <div><router-link :to="'/report/betrecord?member=' + member.username + '&result=1'">{{member.total_gain | currency('￥')}}</router-link></div>
                </div>
                <div class="col-md-5">
                  <span class="text-muted">{{$t('betrecord.bet')}}</span>
                  <div><router-link :to="'/report/betrecord?member=' + member.username + '&result=0'">{{member.total_loss | currency('￥')}}</router-link></div>
                </div>
              </div>
            </div>
          </div>
          <div class="row p-b b-b p-t">
            <div class="col-xs-5">
              <span class="text-muted">{{$t('member.return_setting')}}</span>
              <div v-if="member.return_settings">
                <router-link :to="'/return/' + member.return_settings.id + '/edit'">{{member.return_settings.name}}</router-link>
              </div>
              <div v-else class="text-muted">
                  无设定
              </div>
            </div>
            <div class="col-md-5">
              <span class="text-muted">{{$t('member.agent')}}</span>
              <div><router-link :to="'/agent/' + member.agent.id">{{member.agent.name}}</router-link></div>
            </div>
          </div>

          <div class="row m-b p-t p-b b-b">
            <div class="col-xs-5">
              <span class="text-muted">{{$t('common.basic_info')}}</span>
              <div  v-if="!showDetail">
                {{$t('member.realname')}} :
                <span v-if="member.real_name">{{member.real_name}}</span>
                <span class="label" v-else>{{$t('common.unfilled')}}</span>，{{$t('member.phone_is')}}：
                <span v-if="member.phone">{{member.phone}}</span>
                <span class="label" v-else>{{$t('common.unfilled')}}</span>
              </div>
              <div class="p-a grey-50 lh-md m-t-sm label-width-eq m-b-sm" v-else>
                <div>
                  <span class="text-muted title">{{$t('common.real_name')}}</span>
                  <span v-if="member.real_name">{{member.real_name}}</span>
                  <span v-else class="text-muted">{{$t('common.unfilled')}}</span>
                </div>
                <div>
                  <span class="text-muted title">{{$t('common.phone')}}</span>
                  <span v-if="member.phone">{{member.phone}}</span>
                  <span v-else class="text-muted">{{$t('common.unfilled')}}</span>
                </div>
                <div>
                  <span class="text-muted title">{{$t('common.gender')}}</span>
                  <span v-if="member.gender">{{member.gender}}</span>
                  <span v-else class="text-muted">{{$t('common.unfilled')}}</span>
                </div>
                <div>
                  <span class="text-muted title">{{$t('common.email')}}</span>
                  <span v-if="member.email">{{member.email}}</span>
                  <span v-else class="text-muted">{{$t('common.unfilled')}}</span>
                </div>
                <div>
                  <span class="text-muted title">{{$t('common.birthday')}}</span>
                  <span v-if="member.birthday">{{member.birthday}}</span>
                  <span v-else class="text-muted">{{$t('common.unfilled')}}</span>
                </div>
                <div>
                  <span class="text-muted title">{{$t('common.wechat')}}</span>
                  <span v-if="member.wechat">{{member.wechat}}</span>
                  <span v-else class="text-muted">{{$t('common.unfilled')}}</span>
                </div>
                <div>
                  <span class="text-muted title">QQ</span>
                  <span v-if="member.qq">{{member.qq}}</span>
                  <span v-else class="text-muted">{{$t('common.unfilled')}}</span>
                </div>
              </div>
              <a @click="showDetail = !showDetail">
                <span v-if="showDetail">{{$t('action.close_detailed_infos')}} <i class="fa fa-angle-up"></i></span>
                <span v-else>{{$t('action.view_detailed_infos')}} <i class="fa fa-angle-down"></i></span>
              </a>
            </div>
            <div class="col-xs-5" v-if="member.level">
              <span class="text-muted">{{$t('member.level')}}</span>
              <div>
                <router-link :to="'/level/' + member.level.id">{{member.level.name}}</router-link>
              </div>
            </div>
          </div>
          <div class="row m-b b-b p-b"  v-if="$root.permissions.includes('list_update_member_bank')">
            <div class="col-xs-5">
              <span class="text-muted">{{$t('bank.bank_title')}}</span>
              <div v-if="!member.bank">
                <span class="label">尚未建立</span>
              </div>
              <div class="grey-50 p-a m-t" v-else>
                <div>{{$t('bank.name')}}：<span >{{member.bank.bank.name}}</span></div>
                <div>{{$t('bank.province')}}：<span >{{member.bank.province}}</span></div>
                <div>{{$t('bank.city')}}：<span >{{member.bank.city}}</span></div>
                <div>{{$t('bank.account')}}：<span >{{member.bank.account}}</span></div>
              </div>
            </div>
            <div class="col-xs-4">
              <router-link :to="'/member/' + member.id + '/edit'" v-if="!member.bank">建立银行资讯</router-link>
              <router-link :to="'/member/' + member.id + '/edit'" v-else>编辑银行资讯</router-link>
            </div>
          </div>

          <div class="row m-b b-b p-b">
            <div class="col-xs-5">
              <span class="text-muted">最近登录</span>
              <div v-if="member.last_login">
                <div> IP : {{member.last_login.ipaddr}}</div>
                <div>{{member.last_login.country}} {{member.last_login.city}} {{member.last_login.isp}} </div>
                <div>{{member.last_login.login_at | moment("YYYY-MM-DD HH:mm:ss")}}</div>
              </div>
              <div v-else class="text-muted">无记录</div>
            </div>
            <div class="col-xs-5">
              <router-link v-if="member.last_login" class="m-r" :to="'/report/login?member=' + member.username">{{$t('member.view_all_login')}}</router-link>
              <router-link v-if="member.last_login" :to="'/report/login?ipaddr=' + member.last_login.ipaddr">{{$t('member.view_login_by_ip')}}</router-link>
            </div>
          </div>

          <div class="row m-b b-b p-b">
            <div class="col-xs-12">
              <span class="text-muted">最近操作</span>
              <table class="table table-striped b-t m-t" v-if="member.action.detail.length">
                <thead>
                <tr>
                  <th>{{$t('actionrecord.action_time')}}</th>
                  <th>{{$t('actionrecord.action_username')}}</th>
                  <th>{{$t('actionrecord.username')}}</th>
                  <th>{{$t('actionrecord.ipaddr')}}</th>
                  <th>{{$t('actionrecord.action_type')}}</th>
                  <th>{{$t('actionrecord.provider')}}</th>
                  <th>{{$t('actionrecord.game_name')}}</th>
                  <th>{{$t('actionrecord.action_result')}}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="action in member.action.detail" >
                  <td>{{action.action_time | moment("YYYY-MM-DD HH:mm:ss")}}</td>
                  <td>{{action.action_username || '-'}}</td>
                  <td><router-link :to="'/report/actionrecord?username=' + action.username">{{action.username}}</router-link></td>
                  <td>{{action.ipaddr}}</td>
                  <td>
                    <span v-if="action.action_type == '0'">登入</span>
                    <span v-if="action.action_type == '1'">修改密码</span>
                    <span v-if="action.action_type == '2'">修改取款密码</span>
                    <span v-if="action.action_type == '3'">登入游戏</span>
                  </td>
                  <td>
                    <span v-if="action.provider">{{action.provider || ''}}</span>
                    <span v-else>-</span>
                  </td>
                  <td>
                    <span v-if="action.game_name">{{action.game_name}}</span>
                    <span v-else>-</span>
                  </td>
                  <td>
                    <span v-if="action.action_result" class="label success">成功</span>

                    <span v-else class="label  danger">失败</span>
                  </td>
                </tr>
                </tbody>
              </table>
              <div class="text-muted" v-else>暂无记录</div>
            </div>
          </div>

          <div class="row">
            <div class="col-xs-5">
              <span class="text-muted">备注</span>
              <div v-if="member.memo">{{member.memo}}</div>
              <div class="text-muted" v-else>暂无备注</div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    import api from '../../api'
    import providerform from '../../components/providerform'
    import Vue from 'vue'
    const format = 'YYYY-MM-DD'

    export default {
        data () {
            return {
                showDetail: false,
                showAccounts: false,
                statusUpdated: false,
                passwordChanged: false,
                balanceUpdated: false,
                newPassword: '',
                today: '',
                member: {
                    id: '',
                    return_settings: {},
                    level: {},
                    balance: {
                        balance: ''
                    },
                    status: '',
                    agent: {},
                    transaction_info: {
                        ongoing: [],
                        confirmed: []
                    },
                    last_login: {},
                    action: {
                        detail: []
                    }
                },
                gameAccounts: '',
                accounts: [],
                loading: true,
                balanceLoading: true,
                providerActive: ''
            }
        },
        computed: {
            sumAmount () {
                let items = this.member.transaction_info.confirmed
                let amount = 0
                for (let x in items) {
                    if (items[x].transaction_type__code === 'withdraw') {
                        amount -= parseFloat(items[x].amount__sum)
                    } else {
                        amount += parseFloat(items[x].amount__sum)
                    }
                }
                return Math.round(amount * 100) / 100
            }
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                let id = to.params.memberId
                vm.getMember(id)
                vm.getAccounts(id)
                vm.today = Vue.moment(new Date()).format(format)
            })
        },
        watch: {
            passwordChanged (newObj, old) {
                setTimeout(() => {
                    this.passwordChanged = 0
                }, 8000)
            },
            balanceUpdated (newObj, old) {
                setTimeout(() => {
                    this.balanceUpdated = 0
                }, 3000)
            }
        },
        methods: {
            toggleProvider (account) {
                this.providerActive = account
            },
            toggleStatus () {
                this.statusUpdated = false
                this.$http.put(api.member + this.member.id + '/?opt_fields=status', {
                    status: this.member.status === 1 ? 0 : 1
                }).then((response) => {
                    if (response.status === 200) {
                        this.member.status = response.data.status
                        this.statusUpdated = true
                        setTimeout(() => {
                            this.statusUpdated = false
                        }, 2000)
                    }
                })
            },
            resetPassword (type, event) {
                // type = 1 for reset login password
                // type = 2 for reset withdraw password
                if (!window.confirm(this.$t('member.reset_confirm', {
                    action: event.target.innerText
                }))) {
                    return
                }
                let url = type === 1 ? api.resetmember : api.resetwithdraw
                this.$http.post(url, {
                    'account_id': this.member.id
                }, {emulateJSON: true}).then(response => {
                    this.passwordChanged = type
                    this.newPassword = response.data.new_password || response.data.new_withdraw_password
                }, response => {
                    this.passwordChanged = -1
                    this.errorMsg = response.data.error
                })
            },
            getMember (id) {
                this.$http.get(api.member + id + '/?opt_expand=bank&action').then((response) => {
                    this.member = response.data
                    this.gameAccounts = response.data.sum_balance - response.data.balance.balance
                    this.member_id = {'account_id': response.data.id}
                }, response => {
                    if (('' + response.status).indexOf('4') === 0) {
                        this.$router.push('/login?next=' + this.$route.path)
                    }
                })
            },
            getAccounts (id) {
                this.$http.get(api.gameaccounts + '?opt_expand=provider&member=' + id).then((response) => {
                    this.loading = false
                    this.balanceLoading = false
                    this.accounts = response.data
                })
            },
            getAccountUpdate (id) {
                this.balanceLoading = true
                this.$http.get(api.gameaccounts + '?opt_expand=provider&update=1&member=' + id).then((response) => {
                    this.loading = false
                    this.balanceLoading = false
                    this.accounts = response.data
                    let sunBalance = 0
                    for (let index in response.data) {
                        sunBalance += response.data[index].balance
                    }
                    this.gameAccounts = sunBalance
                    this.balanceUpdated = 1
                })
            },
            changeAudit () {
                let id = this.$route.params.memberId
                if (!this.member.balance.bet_amount && !this.member.balance.audit_amount) {
                    window.alert('成功修改该会员稽核!')
                    return
                } else {
                    if (!window.confirm('确定要修改该会员的稽核吗')) {
                        return
                    }
                }
                this.$http.put(api.member + id + '/?audit=' + id).then((response) => {
                    this.member.balance.bet_amount = response.data.balance.bet_amount
                    this.member.balance.audit_amount = response.data.balance.audit_amount
                })
            }
        },
        components: {
            providerform
        }
    }
</script>

<style scoped lang="scss">
.label-width-eq {
    line-height: 1.8;
    .title {
        display: inline-block;
        width: 80px;
    }
    .link-width {
        text-align: right;
        display: inline-block;
        width: 40px;
    }
}
.loading {
    text-align: center;
}
.table-striped > tbody > tr:nth-child(odd) {
  background: none;
}
.table {
  background-color: #fafafa
}
</style>
