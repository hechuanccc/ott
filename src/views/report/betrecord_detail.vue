<template>
  <div>
    <div class="m-b">
      <ol class="breadcrumb">
        <li class="active"><router-link to="/report/betrecord">投注详情</router-link></li>
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
  </div>
</template>

<script>
    import api from '../../api'
    export default {
        data () {
            return {
                betrecords: [],
                errorMsg: ''
            }
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                let id = to.params.betrecordId
                vm.getBetRecord(id)
            })
        },
        methods: {
            getBetRecord (id) {
                this.$http.get(api.betrecords + id + '/?opt_expand=details').then((response) => {
                    this.betrecords = response.data
                })
            },
            isArray (o) {
                return Object.prototype.toString.call(o) === '[object Array]'
            }
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
