<template>
    <div>
      <form class="form text-sm" v-on:submit.prevent="submit"  v-if="$root.$data.userType !== 'agent'">
        <div class="box">
          <div class="box-body clearfix form-inline form-input-sm">
            <div class="row">
              <div class="col-xs-3">
                <label class="m-r">{{$t('common.member')}}</label>
                <input type="text" v-model="query.member_q" class="form-control w-sm" />
              </div>

              <div class="col-xs-3">
                <label class="m-r">{{$t('common.provider')}}</label>
                <select class="form-control w-sm c-select" v-model="query.provider">
                  <option value="">{{$t('common.please_select')}}</option>
                  <option class="form-control" :value="p.code" v-for="p in providers">{{p.name}}</option>
                </select>
              </div>

              <div class="col-xs-4">
                <label class="m-r">{{$t('common.amount')}}</label>
                <input type="text" v-model="query.amount_gte" class="form-control inline w-sm" /> <span>~</span>
                <input type="text" v-model="query.amount_lte" class="form-control inline w-sm" />
              </div>
              <div class="col-xs-2">
                <button class="md-btn w-sm blue pull-right" style="submit">{{$t('common.search')}}</button>
              </div>

            </div>
            <div class="row m-t">
              <div class="col-xs-8">
                <label class="m-r">{{$t('common.transferred_at')}}</label>
                <date-picker width='140' v-model="query.created_at_0"></date-picker>
                <span>~</span>
                <date-picker width='140' v-model="query.created_at_1"></date-picker>
              </div>

            </div>
          </div>
        </div>
      </form>
      <div class="box">
        <table class="table table-striped">
          <thead>
          <tr>
            <th>#</th>
            <th>{{$t('common.member')}}</th>
            <th>{{$t('common.provider')}}</th>
            <th>{{$t('common.amount')}}</th>
            <th>{{$t('common.transferred_at')}}</th>
            <th>{{$t('common.status')}}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="t in queryset">
            <td>
              {{t.id}}
            </td>
            <td v-if="$root.$data.userType !== 'agent'">
              <router-link :to="'/member/' + t.member.id">{{t.member.username}}</router-link>
            </td>
            <td v-else>{{t.member.username}} </td>
            <td v-if="$root.$data.userType !== 'agent'">
              <router-link :to="'/provider/' + t.provider.id">{{t.provider.name}}</router-link>
            </td>
            <td v-else>{{t.provider.name}}</td>
            <td>
              {{t.amount | currency('￥')}}
            </td>
            <td>
              {{t.created_at | moment("YYYY-MM-DD HH:mm") || '-'}}
            </td>
            <td>
              <span class="label danger" v-if="t.status === 0">
                <span v-if="t.transfer_type === 1">{{$t('common.withdraw')}}</span>
                <span v-if="t.transfer_type === 0">{{$t('common.deposit')}}</span>
              </span>
              <span class="label success" v-if="t.status === 1">
                <span v-if="t.transfer_type === 1">{{$t('common.withdraw')}}</span>
                <span v-if="t.transfer_type === 0">{{$t('common.deposit')}}</span>
    					</span>
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
          :api="recordApi"
          ref="pulling">
        </pulling>
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
                queryset: [],
                recordApi: api.transferrecords,
                providers: '',
                query: {
                    member_q: '',
                    provider: '',
                    amount_gte: '',
                    amount_lte: '',
                    created_at_0: '',
                    created_at_1: ''
                }
            }
        },
        watch: {
            '$route': 'nextTickFetch'
        },
        created () {
            this.$nextTick(() => {
                this.$refs.pulling.rebase()
                this.getGameProviders()
            })
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
            submit () {
                this.$refs.pulling.submit()
            },
            getGameProviders () {
                this.$http.get(api.gameprovider).then(response => {
                    this.providers = response.data
                })
            }
        },
        components: {
            pulling,
            DatePicker
        }
    }
</script>
