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
                  <option value="">{{$t('common.please_select')}}</option>
                  <option class="form-control" :value="c.id" v-for="c in categories">{{c.name}}</option>
                </select>
              </div>
              <div class="col-xs-4">
                <label class="m-r ">{{$t('common.betdate')}}</label>
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
            <td class="" colspan="5">总计</td>
            <td colspan="3">{{total_amount | currency('￥')}}</td>
            <td colspan="2">{{total_profit | currency('￥')}}</td>
          </tr>
          <tr v-for="t in queryset">
            <td>
              <router-link :to="'/report/betrecord/' + t.id">{{t.betrecord_id}}</router-link>
            </td>
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
          @param="queryParam"
          @amount="totalAmount"
          @profit="totalProfit"
          :api="betApi"
          ref="pulling">
        </pulling>
      </div>
    </div>
</template>
<script>
    import api from '../../api'
    import pulling from '../../components/pulling'
    import Datepicker from 'vuejs-datepicker'
    export default {
        data () {
            return {
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
                    result: []
                },
                result: [],
                total_amount: '',
                total_profit: ''
            }
        },
        mounted: function () {
            this.$nextTick(function () {
                if (this.$route.query.result) {
                    this.result = this.$route.query.result
                }
            })
        },
        created () {
            this.$nextTick(() => {
                this.$refs.pulling.rebase()
                this.getGameFilter()
            })
        },
        watch: {
            result: function (old, newObj) {
                this.query.result = old
            },
            '$route': 'nextTickFetch'
        },
        methods: {
            nextTickFetch () {
                let _this = this
                this.queryset = []
                setTimeout(() => {
                    _this.$refs.pulling.rebase()
                }, 100)
            },
            queryData (queryset) {
                this.queryset = queryset
            },
            queryParam (query) {
                this.query = query
            },
            totalAmount (amount) {
                this.total_amount = amount
            },
            totalProfit (profit) {
                this.total_profit = profit
            },
            submit () {
                this.$refs.pulling.submit()
            },
            getGameFilter () {
                this.$http.get(api.gameprovider).then(response => {
                    this.providers = response.data
                })
                this.$http.get(api.gamecategory).then(response => {
                    this.categories = response.data
                })
            }
        },
        components: {
            pulling,
            Datepicker
        }
    }
</script>
