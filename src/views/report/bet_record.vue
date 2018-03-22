<template>
  <div>
    <form class="form text-sm" v-on:submit.prevent="submit">
      <div class="box">
        <div class="box-body clearfix form-inline form-input-sm">
          <div class="row">
            <div class="col-xs-2">
              <label class="text-sm m-r">{{$t('common.member')}}</label>
              <input type="text" v-model="query.member_q" class="form-control w-sm" />
            </div>
            <div class="col-xs-2">
              <label class="text-sm m-r">{{$t('common.game')}}</label>
              <input type="text" v-model="query.game_q" class="form-control w-sm" />
            </div>
            <div class="col-xs-6">
              <label class="text-sm">{{$t('common.status')}}</label>
              <label class="md-check md-check-md m-r">
                <input type="checkbox" value="0" name="status" v-model="result">
                <i class="blue"></i>
                {{$t('betrecord.bet')}}
              </label>
              <label class="md-check md-check-md m-r">
                <input type="checkbox" value="1" name="status" v-model="result">
                <i class="blue"></i>
                {{$t('betrecord.win')}}
              </label>
              <label class="md-check md-check-md m-r">
                <input type="checkbox" value="2" name="status" v-model="result">
                <i class="blue"></i>
                {{$t('betrecord.tie')}}
              </label>
              <label class="md-check md-check-md m-r">
                <input type="checkbox" value="3" name="status" v-model="result">
                <i class="blue"></i>
                {{$t('betrecord.ongoing')}}
              </label>
              <label class="md-check md-check-md m-r">
                <input type="checkbox" value="4" name="status" v-model="result">
                <i class="blue"></i>
                {{$t('betrecord.refund')}}
              </label>
              <label class="md-check md-check-md m-r">
                <input type="checkbox" value="5" name="status" v-model="result">
                <i class="blue"></i>
                {{$t('betrecord.void')}}
              </label>
              <label class="md-check md-check-md m-r">
                <input type="checkbox" value="6" name="status" v-model="result">
                <i class="blue"></i>
                {{$t('betrecord.reject')}}
              </label>
              <label class="md-check md-check-md m-r">
                <input type="checkbox" value="7" name="status" v-model="result">
                <i class="blue"></i>
                {{$t('betrecord.waiting')}}
              </label>
            </div>
            <div class="col-xs-2">
              <button class="md-btn w-sm blue pull-right" type="submit">{{$t('common.search')}}</button>
            </div>
          </div>
          <div class="row m-t">
            <div class="col-xs-2">
              <label class="text-sm m-r">{{$t('common.provider')}}</label>
              <select class="form-control c-select" v-model="query.provider">
                <option value="">{{$t('common.please_select')}}</option>
                <option class="form-control" :value="p.code" v-for="p in providers">{{p.name}}</option>
              </select>
            </div>
            <div class="col-xs-2">
              <label class="text-sm m-r">{{$t('common.gamecategory')}}</label>
              <select class="form-control c-select" v-model="query.category">
                <!-- <option value="">{{$t('common.please_select')}}</option>
                <option class="form-control" :value="c.id" v-for="c in categories">{{c.name}}</option> -->
              </select>
            </div>
            <div class="col-xs-4">
              <label class="m-r ">{{$t('common.betdate')}}</label>
              <date-picker width='140' v-model="created_at_0"></date-picker>
              <span>~</span>
              <date-picker width='140' v-model="created_at_1"></date-picker>
            </div>
            <div class="col-xs-4">
              <label class="m-r">{{$t('common.betamount')}}</label>
              <input type="text" v-model="query.bet_gte" class="form-control inline w-sm" />
              <span>~</span>
              <input type="text" v-model="query.bet_lte" class="form-control inline w-sm" />
            </div>
          </div>
        </div>
      </div>
    </form>
    <div class="box">
      <table class="table table-striped">
        <thead>
        <tr>
          <th>注单号</th>
          <th>{{$t('common.member')}}</th>
          <th>{{$t('common.game')}}</th>
          <th>{{$t('common.provider')}}</th>
          <th>{{$t('common.settledat')}}</th>
          <th>{{$t('common.betamount')}}</th>
          <th>{{$t('common.valid_bet_amount')}}</th>
          <th>{{$t('common.settlementamount')}}</th>
          <th>{{$t('common.profit')}}</th>
          <th>{{$t('common.status')}}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="total_amount || total_profit" class="table-amount">
          <td class="" colspan="6">总计</td>
          <td colspan="2">{{total_amount | currency('￥')}}</td>
          <td colspan="2">{{total_profit | currency('￥')}}</td>
        </tr>
        <tr v-for="t in queryset">
          <td @click="oModal(t.id)">
            <a >{{t.betrecord_id}}</a>
          </td>
          <!--<td>-->
          <!--<router-link :to="'/report/betrecord/' + t.id">{{t.betrecord_id}}</router-link>-->
          <!--</td>-->
          <td>
            <router-link :to="'/member/' + t.member.id">{{t.member.username}}</router-link>
          </td>
          <td>
            {{t.game.name}}
          </td>
          <td>
            {{t.provider.name}}
          </td>
          <td>
            {{t.created_at | moment("YYYY-MM-DD HH:mm")}}
          </td>
          <td>
            {{t.bet_amount | currency('￥')}}
          </td>
          <td>
            {{t.valid_bet_amount | currency('￥')}}
          </td>
          <td>
            {{t.settlement_amount | currency('￥')}}
          </td>
          <td>
            {{t.profit | currency('￥')}}
          </td>
          <td>
            <div class="flex-value status">
              <span class="label danger" v-if="t.result === 0">{{$t('betrecord.bet')}}</span>
              <span class="label success" v-if="t.result === 1">{{$t('betrecord.win')}}</span>
              <span class="label" v-if="t.result === 2">{{$t('betrecord.tie')}}</span>
              <span class="label ongoing" v-if="t.result === 3">{{$t('betrecord.ongoing')}}</span>
              <span class="label" v-if="t.result === 4">{{$t('betrecord.refund')}}</span>
              <span class="label ongoing" v-if="t.result === 5">{{$t('betrecord.void')}}</span>
              <span class="label ongoing" v-if="t.result === 6">{{$t('betrecord.reject')}}</span>
              <span class="label ongoing" v-if="t.result === 7">{{$t('betrecord.waiting')}}</span>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="row m-b-lg">
      <pulling
        :queryset="queryset"
        :query="query"
        @query-data="queryData"
        @query-param="queryParam"
        :api="betApi"
        ref="pulling">
      </pulling>
    </div>
    <div class="box">
      <sweet-modal ref="alt" overlay-theme="dark" width="80%" height="800" :isInvited="true">
        <div class="m-b">
          <ol class="breadcrumb">
            <li class="active" @click="$refs.alt.close()"><router-link to="/report/betrecord" >投注详情</router-link></li>
            <li class="active">{{$route.meta.title}}</li>
          </ol>
        </div>
        <div class="box">
          <div class="box-header b-b">
            <div class="row">
              <div class="col-md-4">

                <h2 class="v-m m-t-sm">
                  订单号：
                  <span>{{betrecords.betrecord_id}}</span>
                </h2>
              </div>
            </div>
          </div>
          <div class="box-body">
            <div class="row b-b p-b m-b">
              <div class="col-xs-6">
                <div class="row">
                  <div class="col-xs-3 text-right">{{$t('common.member')}}</div>
                  <div class="col-xs-8">
                    <span v-if="betrecords.member" class="text-md v-m m-r"><router-link :to="'/member/' + betrecords.member.id">{{betrecords.member.username}}</router-link></span>
                  </div>
                </div>

                <div class="row m-t" v-if="betrecords.game">
                  <div class="col-xs-3 text-right">{{$t('common.game')}}</div>
                  <div class="col-xs-8"><span class="text-muted"> {{betrecords.game.name}}</span></div>
                </div>

                <div class="row m-t" v-if="betrecords.provider">
                  <div class="col-xs-3 text-right">{{$t('common.provider')}}</div>
                  <div class="col-xs-8"><span class="text-muted"> {{betrecords.provider.name}}</span></div>
                </div>

                <div class="row m-t">
                  <div class="col-xs-3 text-right">{{$t('common.settledat')}}</div>
                  <div class="col-xs-8"><span class="text-muted">{{betrecords.created_at | moment("YYYY-MM-DD HH:mm")}}</span></div>
                </div>


              </div>
              <div class="col-xs-6">
                <div class="row m-t">
                  <div class="col-xs-3 text-right">{{$t('common.betamount')}}</div>
                  <div class="col-xs-8"><span class="text-muted"> {{betrecords.bet_amount | currency('￥')}}</span></div>
                </div>
                <div class="row m-t">
                  <div class="col-xs-3 text-right v-m">{{$t('common.settlementamount')}}</div>
                  <div class="col-xs-8">
                    <span class="text-muted">{{betrecords.settlement_amount | currency('￥')}}</span>
                  </div>
                </div>
                <div class="row m-t">
                  <div class="col-xs-3 text-right v-m">{{$t('common.profit')}}</div>
                  <div class="col-xs-8">
                    <span class="text-muted">{{betrecords.profit | currency('￥')}}</span>
                  </div>
                </div>

                <div class="row m-t">
                  <div class="col-xs-3 text-right">{{$t('common.status')}}</div>
                  <div class="col-xs-8">
                            <span class="text-muted">
                                <div class="flex-value status">
                                    <span class="label danger" v-if="betrecords.result === 0">{{$t('betrecord.bet')}}</span>
                                    <span class="label success" v-if="betrecords.result === 1">{{$t('betrecord.win')}}</span>
                                    <span class="label" v-if="betrecords.result === 2">{{$t('betrecord.tie')}}</span>
                                    <span class="label ongoing" v-if="betrecords.result === 3">{{$t('betrecord.ongoing')}}</span>
                                    <span class="label" v-if="betrecords.result === 4">{{$t('betrecord.refund')}}</span>
                                    <span class="label ongoing" v-if="betrecords.result === 5">{{$t('betrecord.void')}}</span>
                                    <span class="label ongoing" v-if="betrecords.result === 6">{{$t('betrecord.reject')}}</span>
                                    <span class="label ongoing" v-if="betrecords.result === 7">{{$t('betrecord.waiting')}}</span>
                                </div>
                            </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row ">
              <div class="col-xs-8">
                <div class="text m-b">投注记录详情</div>
                <div v-if="betrecords.details" class="details-box">
                  <table class="table b-a m-t-sm" >
                    <tbody >
                    <tr v-for="(betrecord, index) in betrecords.details">
                      <th class="grey-50" width="200" >{{$t(`details.${index}`)}}</th>
                      <td v-if='isArray(betrecord)'>
                        <div v-for="card in betrecord" :class="isArray(card)?'':'img-box'">
                          <img v-if='!isArray(card)' :src="card">
                          <img v-else v-for="(src, index, $index) in card" :src="src" :class="$index">
                        </div>
                      </td>
                      <td v-else>{{betrecord}}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
                <div v-else >无投注详细信息</div>
              </div>
            </div>
          </div>
        </div>
        <div class="row" v-if="errorMsg">
          <div class="col-xs-3">
            <div class="alert alert-danger">
              {{errorMsg}}
            </div>
          </div>
        </div>
      </sweet-modal>
    </div>
  </div>
</template>
<script>
  import api from '../../api'
  import pulling from '../../components/pulling'
  import DatePicker from 'vue2-datepicker'
  export default {
      data () {
          return {
              created_at_0: '',
              created_at_1: '',
              queryset: [],
              betApi: api.betrecords,
              providers: [],
              categories: [],
              query: {
                  member_q: '',
                  provider: '',
                  category: '',
                  game_q: '',
                  bet_gte: '',
                  bet_lte: '',
                  created_at_0: '',
                  created_at_1: '',
                  settlement_gte: '',
                  settlement_lte: '',
                  result: [],
                  report_flag: true
              },
              filter: {},
              result: [],
              total_amount: '',
              total_profit: '',
              total_bet_amount: '',
              betrecords: [],
              errorMsg: ''
          }
      },
      created () {
          let results = this.$route.query.result
          if (results) {
              this.result = results.split(',')
          }
          this.getGameFilter()
          this.$nextTick(() => {
              this.$refs.pulling.rebase()
              this.getSummary()
          })
      },
      watch: {
          result: function (newObj, old) {
              this.query.result = newObj
          },
          '$route': {
              handler () {
                  this.queryset = []
                  this.$refs.pulling.rebase()
                  this.getSummary()
              },
              deep: true
          },
          created_at_0 (newObj, old) {
              this.query.created_at_0 = newObj
          },
          created_at_1 (newObj, old) {
              this.query.created_at_1 = newObj
          }
      },
      methods: {
          isArray (o) {
              return Object.prototype.toString.call(o) === '[object Array]'
          },
          oModal (id) {
              this.$http.get(api.betrecords + id + '/?opt_expand=details').then((response) => {
                  this.betrecords = response.data
              })
              this.$refs.alt.open()
          },
          queryData (queryset) {
              this.query = Object.assign({}, this.filter)
              if (this.query.created_at_0) {
                  this.created_at_0 = this.query.created_at_0
              }
              if (this.query.created_at_1) {
                  this.created_at_1 = this.query.created_at_1
              }
              this.queryset = queryset
          },
          queryParam (query) {
              this.filter = query
          },
          submit () {
              this.$refs.pulling.submit()
          },
          getGameFilter () {
              this.$http.get(api.gameprovider + '?opt_fields=code,name').then(response => {
                  this.providers = response.data
              })
              this.$http.get(api.gamecategory + '?opt_fields=id,name').then(response => {
                  this.categories = response.data
              })
          },
          getSummary () {
              this.queryKeys = []
              for (let queryItem in this.$route.query) {
                  this.queryKey = queryItem + '=' + this.$route.query[queryItem]
                  this.queryKeys.push(this.queryKey)
              }
              this.queryKeys = this.queryKeys.join('&')
              this.$http.get(api.betSummary + '?' + this.queryKeys).then(response => {
                  this.total_amount = response.data.total_amount
                  this.total_profit = response.data.total_profit
              })
          }
      },
      components: {
          pulling,
          DatePicker
      }
  }
</script>
<style scoped lang="scss">
  .qr-code {
    max-width: 120px;
  }
  .img-box{
    float: left;
    margin-right: 10px;
  }
  .details-box img {
    max-width: 70px;
  }
</style>
