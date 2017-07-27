<template>
    <div>
      <form class="form text-sm" v-on:submit.prevent="submit">
        <div class="box">
          <div class="box-body clearfix form-inline form-input-sm">
            <div class="row ">
              <div class="col-xs-2">
                <label class="text-sm m-r">{{$t('actionrecord.action_username')}}</label>
                <input type="text" v-model="query.action_username_q" class="form-control w-sm" />
              </div>

              <div class="col-xs-2">
                <label class="text-sm m-r">{{$t('actionrecord.username')}}</label>
                <input type="text" v-model="query.username_q"  class="form-control w-sm" />
              </div>
              <div class="col-xs-5">
                <label class="text-sm m-r">{{$t('actionrecord.action_time')}}</label>
                <!--<datepicker :width="'110px'"-->
                <!--:value.sync="query.action_time_0"-->
                <!--:disabled-days-of-Week="disabled"-->
                <!--format="yyyy-MM-dd">-->
                <!--</datepicker>-->
                <!--<span>~</span>-->
                <!--<datepicker :width="'110px'"-->
                <!--:value.sync="query.action_time_1"-->
                <!--:disabled-days-of-Week="disabled"-->
                <!--format="yyyy-MM-dd">-->
                <!--</datepicker>-->
              </div>


              <div class="col-xs-3">
                <button class="pull-right md-btn blue-500 w-sm" type="submit">{{$t('common.search')}}</button>
              </div>
            </div>
            <div class="row m-t">
              <div class="col-xs-2">
                <label class="text-sm m-r">{{$t('actionrecord.ipaddr')}}</label>
                <input type="text" v-model="query.ipaddr"  class="form-control w-sm" />
              </div>
              <div class="col-xs-2">
                <label class="text-sm m-r">{{$t('actionrecord.action_type')}}</label>
                <select class="form-control c-select" v-model="query.action_type">
                  <option value="">{{$t('common.please_select')}}</option>
                  <option class="form-control" value="0">登入</option>
                  <option class="form-control" value="1">修改密码</option>
                  <option class="form-control" value="2">修改取款密码</option>
                  <option class="form-control" value="3">登入游戏</option>
                </select>
              </div>
              <div class="col-xs-2">
                <label class="text-sm m-r">{{$t('actionrecord.provider')}}</label>
                <select class="form-control c-select" v-model="query.provider">
                  <option value="">{{$t('common.please_select')}}</option>
                  <option class="form-control" :value="p.code" v-for="p in providers">{{p.name}}</option>
                </select>
              </div>
              <div class="col-xs-4">
                <label class="text-sm">{{$t('actionrecord.action_result')}}</label>
                <label class="md-check md-check-md m-r">
                  <input type="checkbox" value="1" name="status" v-model="action_result">
                  <i class="blue"></i>
                  {{$t('status.success')}}
                </label>
                <label class="md-check m-r">
                  <input type="checkbox" value="0" name="status" v-model="action_result">
                  <i class="blue"></i>
                  {{$t('status.failed')}}
                </label>
              </div>
            </div>
          </div>
        </div>
      </form>
      <div class="box">
        <table class="table table-striped b-t">
          <thead>
          <tr>
            <th>{{$t('actionrecord.id')}}</th>
            <th>{{$t('actionrecord.action_username')}}</th>
            <th>{{$t('actionrecord.username')}}</th>
            <th>{{$t('actionrecord.action_time')}}</th>
            <th>{{$t('actionrecord.ipaddr')}}</th>
            <th>{{$t('actionrecord.action_type')}}</th>
            <th>{{$t('actionrecord.provider')}}</th>
            <th>{{$t('actionrecord.game_name')}}</th>
            <th>{{$t('actionrecord.action_result')}}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="report in queryset" >
            <td>{{report.id}}</td>
            <td>{{report.action_username || '-'}}</td>
            <td>{{report.username}}</td>
            <td>{{report.action_time | moment("YYYY-MM-DD HH:mm:ss")}}</td>
            <td>{{report.ipaddr}}</td>
            <td>
              <span v-if="report.action_type == '0'">登入</span>
              <span v-if="report.action_type == '1'">修改密码</span>
              <span v-if="report.action_type == '2'">修改取款密码</span>
              <span v-if="report.action_type == '3'">登入游戏</span>
            </td>
            <td>
              <span v-if="report.provider">{{report.provider || ''}}</span>
              <span v-else>-</span>
            </td>
            <td>
              <span v-if="report.game_name">{{report.game_name}}</span>
              <span v-else>-</span>
            </td>
            <td>
              <span v-if="report.action_result" class="label success">成功</span>

              <span v-else class="label  danger">失败</span>
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
          :api="actionrecordApi"
          ref="pulling">
        </pulling>
      </div>
    </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import api from '../../api'
import pulling from '../../components/pulling'

export default {
    data () {
        return {
            actionrecordApi: api.action_record,
            query: {
                action_username_q: '',
                username_q: '',
                action_time_0: '',
                action_time_1: '',
                ipaddr: '',
                game_name: '',
                action_result: [],
                action_type: []
            },
            queryset: [],
            providers: '',
            action_result: [],
            action_type: ''
        }
    },
    created () {
        this.$nextTick(() => {
            this.$refs.pulling.rebase()
            this.getProvider()
        })
    },
    mounted: function () {
        this.$nextTick(function () {
            if (this.$route.query.action_result) {
                this.action_result = this.$route.query.action_result
            }
        })
    },
    watch: {
        action_result: function (old, newObj) {
            this.query.action_result = old
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
        submit () {
            this.$refs.pulling.submit()
        },
        getProvider () {
            this.$http.get(api.gameprovider).then(response => {
                this.providers = response.data
            })
        }
    },
    components: {
        Datepicker,
        pulling
    }
}
</script>
