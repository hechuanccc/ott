<template>
  <div>
    <div class="box">
        <div class="box-body clearfix form-inline form-input-sm">
            <div class="row">
                <div class="col-xs-7">
                    <label class="text-sm">{{$t('common.date')}}</label>
                    <date-picker width='140' v-model="filter.created_at_0"></date-picker>
                    <span>~</span>
                    <date-picker width='140' v-model="filter.created_at_1"></date-picker>
                    <div class="btn-group m-l">
                        <button type="button" class="btn btn-sm" :class="dateRange === 0 ? 'blue-500' : 'grey-300'" @click="toggleDate(0)">{{$t('common.today')}}</button>
                        <button type="button" class="btn btn-sm" :class="dateRange === 1 ? 'blue-500' : 'grey-300'" @click="toggleDate(1)">{{$t('common.yesterday')}}</button>
                        <button type="button" class="btn btn-sm" :class="dateRange === 7 ? 'blue-500' : 'grey-300'" @click="toggleDate(7)">{{$t('common.this_week')}}</button>
                        <button type="button" class="btn btn-sm" :class="dateRange === 8 ? 'blue-500' : 'grey-300'" @click="toggleDate(8)">{{$t('common.last_week')}}</button>
                        <button type="button" class="btn btn-sm" :class="dateRange === 31 ? 'blue-500' : 'grey-300'" @click="toggleDate(31)">{{$t('common.this_month')}}</button>
                        <button type="button" class="btn btn-sm" :class="dateRange === 32 ? 'blue-500' : 'grey-300'" @click="toggleDate(32)">{{$t('common.last_month')}}</button>
                    </div>
                </div>
                <div class="col-xs-3" v-if="$root.userType !== 'agent'">
                    <label class="text-sm">{{$t('common.agent')}}</label>
                    <div class="inline-form-control dropdown" :class="{'open': hasItems}">
                        <input class="form-control" type="text"
                           placeholder="代理商"
                           autocomplete="on"
                           v-model="query"
                           @keydown.down="down"
                           @keydown.up="up"
                           @keydown.enter="hit"
                           @keydown.esc="reset"
                           @blur="checkAgent"
                           @input="update"/>
                        <div class="dropdown-menu" v-show="hasItems">
                            <a v-for="(item, index) in items" class="dropdown-item" :class="activeClass(index)" @click="hit" @mousemove="setActive(index)">
                            <span v-text="item.username"></span>
                            </a>
                        </div>

                    </div>
                    <span class="text-danger v-m m-l-sm" v-show="agentValid === false">&times;无此代理</span>
                </div>
                <div class="col-xs-2">
                    <button class="pull-right md-btn blue-500 w-sm" @click="submit">{{$t('common.search')}}</button>
                </div>
            </div>
            <div class="row m-t">
                <div class="col-xs-6">
                    <label class="text-sm">{{$t('common.provider')}}</label>
                    <div class="btn-group">
                        <button type="button" class="btn btn-sm" :class="filter.provider === '' ? 'blue-500' : 'grey-300'" @click="toggleProvider('')">全部</button>
                        <button v-for="p in providers" type="button" class="btn btn-sm" :class="filter.provider == p.code ? 'blue-500' : 'grey-300'" @click="toggleProvider(p.code)">{{p.name}}</button>
                    </div>
                </div>
                <div class="col-xs-5">
                    <label class="text-sm">{{$t('common.gamecategory')}}</label>
                    <div class="btn-group">
                        <button type="button" class="btn btn-sm" :class="filter.category === '' ? 'blue-500' : 'grey-300'" @click="toggleCategory('')">全部</button>
                        <button v-for="c in categories" type="button" class="btn btn-sm" :class="filter.category == c.id ? 'blue-500' : 'grey-300'" @click="toggleCategory(c.id)">{{c.name}}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <h6>数据总览 - 代理：{{filter.agent}}</h6>

    <div class="box">
        <table class="table table-striped b-t">
            <thead>
                <tr>
                    <th>线上会员</th>
                    <th>单量</th>
                    <th>投注额</th>
                    <th>有效投注</th>
                    <th>损益</th>
                    <th>存款金额</th>
                </tr>
            </thead>
            <tbody v-if="!searchAgentValid">
                <tr v-if="$root.userType !== 'agent'">
                    <td>{{overall.member_count}}</td>
                    <td><router-link :to="filterLink">{{overall.betrecord_count}}</router-link></td>
                    <td><router-link :to="filterLink">{{overall.bet_amount | currency('￥')}}</router-link></td>
                    <td><router-link :to="filterLink">{{overall.valid_bet_amount | currency('￥')}}</router-link></td>
                    <td>{{overall.profit | currency('￥')}}</td>
                    <td>{{overall.deposit_amount | currency('￥')}}</td>
                </tr>
                <tr v-else>
                    <td>{{overall.member_count}}</td>
                    <td>{{overall.betrecord_count}}</td>
                    <td>{{overall.bet_amount | currency('￥')}}</td>
                    <td>{{overall.valid_bet_amount | currency('￥')}}</td>
                    <td>{{overall.profit | currency('￥')}}</td>
                    <td>{{overall.deposit_amount | currency('￥')}}</td>
                </tr>
            </tbody>
            <tbody v-else>
            <tr><td colspan="5">查无代理，请更换条件再查询</td></tr>
            </tbody>
        </table>
    </div>
    <div v-if="details.length">
      <h6>下线详细资料</h6>
      <sort
        :data="details"
        :columns="columns"
        :searchAgentValid="searchAgentValid"
        :agent_level="agentLevel"
        :member_link="memberLink">
      </sort>
    </div>
  </div>
</template>

<script>
import DatePicker from 'vue2-datepicker'
import VueTypeahead from 'vue-typeahead'
import api from '../../api'
import Vue from 'vue'
import date from '../../utils/date'
import storage from '../../utils/storage'
import sort from '../../components/sort'

const format = 'YYYY-MM-DD'
export default {
    extends: VueTypeahead,
    data () {
        return {
            query: '',
            filter: {
                agent: '',
                created_at_0: Vue.moment().subtract(7, 'days').format(format),
                created_at_1: Vue.moment().subtract(1, 'days').format(format),
                provider: '',
                category: '',
                report_flag: 'True'
            },
            dateRange: -1,
            agentValid: true,
            providers: [],
            categories: [],
            overall: '',
            details: [],
            agentLevel: 1,
            searchAgentValid: false,
            memberLink: '',
            filterLink: '',
            columns: {
            },
            agentColumns: {
                name: '代理',
                member_count: '会员',
                betrecord_count: '单量',
                bet_amount: '投注额',
                valid_bet_amount: '有效投注',
                profit: '损益',
                deposit_amount: '存款金额'
            },
            memberColumns: {
                name: '会员',
                betrecord_count: '单量',
                bet_amount: '投注额',
                valid_bet_amount: '有效投注',
                profit: '损益',
                deposit_amount: '存款金额'
            }
        }
    },
    computed: {
        src: function () {
            return api.agent + '?opt_fields=username,id,&username_q=' + this.query
        }
    },
    watch: {
        'filter': {
            handler () {
                this.memberLink = `/report/betrecord?created_at_0=${this.filter.created_at_0}&created_at_1=${this.filter.created_at_1}&member_q=`
                this.filterLink = `/report/betrecord?created_at_0=${this.filter.created_at_0}&created_at_1=${this.filter.created_at_1}&provider=${this.filter.provider}&category=${this.filter.category}&result=0,1,2`
            },
            deep: true
        },
        '$route' (to, from) {
            this.getReports()
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.$root.routerLoading = true
            let query = vm.$route.query
            let userType = storage.fetch().type
            for (let x in query) {
                if (query[x]) {
                    vm.filter[x] = query[x]
                }
            }
            vm.getDateRange(query.dateRange)
            vm.filter.dateRange = ''
            vm.getReports()
            if (userType === 'agent') {
                vm.filter.agent = vm.$root.username
            }
        })
    },
    mounted: function () {
        this.$nextTick(function () {
            this.columns = this.agentColumns
            this.getFilters()
        })
    },
    methods: {
        toggleSequence (num) {
            this.sequenceNum = num
        },
        getDateRange (flag) {
            switch (flag) {
            case 'today':
                this.dateRange = 0
                break
            case 'yesterday':
                this.dateRange = 1
                break
            case 'this_week':
                this.dateRange = 7
                break
            case 'last_week':
                this.dateRange = 8
                break
            case 'this_month':
                this.dateRange = 31
                break
            case 'last_month':
                this.dateRange = 32
                break
            }
        },
        submit () {
            let query = this.filter
            this.filter.created_at_0 = Vue.moment(this.filter.created_at_0).format(format)
            this.filter.created_at_1 = Vue.moment(this.filter.created_at_1).format(format)
            this.$router.push({
                path: this.$route.path,
                query: query
            })
        },
        resetAgent (username) {
            if (this.agentLevel === 4) {
                let query = this.filter
                query.member_q = username
                this.$router.push({
                    name: 'report_betrecord',
                    query: query
                })
            } else {
                this.filter.agent = username
                this.submit()
            }
        },
        checkAgent () {
            if (this.query !== '') {
                this.$http.get(api.agent + '?opt_fields=username,id,&username=' + this.query)
                .then((response) => {
                    if (response.data.length === 1) {
                        this.agentValid = true
                        this.filter.agent = response.data[0].username
                        this.submit()
                    } else {
                        this.agentValid = false
                        this.filter.agent = ''
                    }
                })
            } else {
                this.agentValid = true
                this.filter.agent = ''
            }
        },
        toggleProvider (name) {
            this.filter.provider = name
            this.submit()
        },
        toggleCategory (id) {
            this.filter.category = id
            this.submit()
        },
        toggleDate (flag) {
            this.dateRange = flag
            switch (flag) {
            case 0:
                this.filter.created_at_0 = date.today[0]
                this.filter.created_at_1 = date.today[1]
                break
            case 1:
                this.filter.created_at_0 = date.yesterday[0]
                this.filter.created_at_1 = date.yesterday[1]
                break
            case 7:
                this.filter.created_at_0 = date.this_week[0]
                this.filter.created_at_1 = date.this_week[1]
                break
            case 8:
                this.filter.created_at_0 = date.last_week[0]
                this.filter.created_at_1 = date.last_week[1]
                break
            case 31:
                this.filter.created_at_0 = date.this_month[0]
                this.filter.created_at_1 = date.this_month[1]
                break
            case 32:
                this.filter.created_at_0 = date.last_month[0]
                this.filter.created_at_1 = date.last_month[1]
                break
            }
            this.submit()
        },
        getFilters () {
            this.$http.get(api.gameprovider).then(response => {
                this.providers = response.data
            })
            this.$http.get(api.gamecategory).then(response => {
                this.categories = response.data
            })
        },
        getReports () {
            if (!this.agentValid) {
                return
            }
            let params = []
            for (let x in this.filter) {
                if (this.filter[x]) {
                    params.push(x + '=' + this.filter[x])
                }
            }
            this.$http.get(api.game_report + '?' + params.join('&')).then(response => {
                let data = response.data[0]
                this.searchAgentValid = !data
                if (!data) {
                    this.details = ''
                    return
                } else {
                    this.agentLevel = data.agent_level
                    this.query = data.agent_name
                    this.filter.agent = data.agent_name
                    this.overall = data.overall
                    this.details = data.details
                    if (this.agentLevel < 4) {
                        this.columns = this.agentColumns
                    } else {
                        this.columns = this.memberColumns
                    }
                    this.$root.routerLoading = false
                }
            })
        },
        reset () {
            this.checkAgent()
        },
        // for agent field typeahead
        onHit (item) {
            this.items = []
            this.query = item.username
            this.checkAgent()
        },
        // for agent field typeahead
        prepareResponseData (data) {
            return data
        }
    },
    components: {
        DatePicker,
        sort
    }
}
</script>

