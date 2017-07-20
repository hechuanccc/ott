<template>
    <div>
      <div class="m-b-sm">
          <h6 class="inline">焦点资讯</h6>
          <button class="m-l md-btn md-flat p-l p-r text-muted" :class="{'text-blue': active === 'chart'}" @click="toggle('chart')">图表</button>
          <button class="md-btn md-flat p-l p-r text-muted" :class="{'text-blue': active === 'table'}" @click="toggle('table')">表格</button>
      </div>
      <div class="box m-b-lg">
          <div class="chart-box" v-show="active === 'chart'">
              <div class="row">
                  <div class="col-xs-6 p-a">
                      <canvas id="profit-chart" width="400" height="200"></canvas>
                  </div>
                  <div class="col-xs-6 p-a" >
                      <canvas id="bet-chart" width="400" height="200"></canvas>
                  </div>
              </div>
              <div class="row">
                  <div class="col-xs-6 p-a">
                      <canvas id="member-chart" width="400" height="200"></canvas>
                  </div>
                  <div class="col-xs-6 p-a" >
                      <canvas id="betnumbers-chart" width="400" height="200"></canvas>
                  </div>
              </div>
          </div>
          <div class="table-box" v-show="active === 'table'">
              <table class="table table-striped b-t">
                  <thead>
                      <tr>
                          <th>日期</th>
                          <th>线上会员</th>
                          <th>投注单量</th>
                          <th>有效投注</th>
                          <th>损益</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr v-for="d in daily">
                          <td>{{d.date | moment('YYYY-MM-DD')}}</td>
                          <td>{{d.member_count}}</td>
                          <td>{{d.bet_numbers}}</td>
                          <td>{{d.valid_bet | currency('￥')}}</td>
                          <td>{{d.profit | currency('￥')}}</td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </div>

      <h6>焦点资讯</h6>
      <div class="box">
        <table class="table table-striped b-t" v-if="$root.$data.userType !== 'agent'">
            <thead>
                <tr>
                    <th>&nbsp;</th>
                    <th >代理</th>
                    <th>新会员数</th>
                    <th>存款新会员数</th>
                    <th>存款总额</th>
                    <th>取款总额</th>
                    <th>有效投注</th>
                    <th>损益</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="d in periodic" >
                    <td>{{$t('common.' + d.report_age)}}</td>
                    <td>{{d.active_agent}}</td>
                    <td><router-link to="'/member?created_at_0=' + dateSet[d.report_age][0] + '=&created_at_1=' + dateSet[d.report_age][1] + '&report_flag=True'">{{d.new_member_count}}</router-link></td>
                    <td>{{d.deposit_member_count}}</td>
                    <td><router-link to="'/bill/search?transaction_type[]=remit&transaction_type[]=online_pay&created_at_0=' + dateSet[d.report_age][0] + '=&created_at_1=' + dateSet[d.report_age][1] + '&report_flag=True'">{{d.deposit_amount | currency('￥')}}</router-link></td>
                    <td><router-link to="'/bill/search?transaction_type[]=withdraw&created_at_0=' + dateSet[d.report_age][0] + '=&created_at_1=' + dateSet[d.report_age][1] + '&report_flag=True'">{{d.withdraw_amount | currency('￥')}}</router-link></td>
                    <td><router-link to="'/report/game?date_0=' + dateSet[d.report_age][0] + '=&date_1=' + dateSet[d.report_age][1] + '&dateRange=' + d.report_age">{{d.valid_bet | currency('￥')}}</router-link></td>
                    <td><router-link to="'/report/game?date_0=' + dateSet[d.report_age][0] + '=&date_1=' + dateSet[d.report_age][1] + '&dateRange=' + d.report_age">{{d.profit | currency('￥')}}</router-link></td>
                </tr>

            </tbody>
        </table>
        <table class="table table-striped b-t" v-else>
            <thead>
                <tr>
                    <th>&nbsp;</th>
                    <th>新会员数</th>
                    <th>存款新会员数</th>
                    <th>存款总额</th>
                    <th>取款总额</th>
                    <th>有效投注</th>
                    <th>损益</th>
                </tr>
            </thead>
            <tbody>
              <tr v-for="d in periodic">
                <td>{{$t('common.' + d.report_age)}}</td>
                <td>{{d.new_member_count}}</td>
                <td>{{d.deposit_member_count}}</td>
                <td>{{d.deposit_amount | currency('￥')}}</td>
                <td>{{d.withdraw_amount | currency('￥')}}</td>
                <td>{{d.valid_bet | currency('￥')}}</td>
                <td>{{d.profit | currency('￥')}}</td>
              </tr>
            </tbody>
        </table>
    </div>
    </div>
</template>
<script>
import api from '../api'
import Vue from 'vue'
import date from '../utils/date'
import Chart from 'chart.js'
export default {
    data () {
        return {
            active: 'chart',
            daily: [],
            periodic: [],
            dateSet: date,
            dateRange: ''
        }
    },
    created () {
        this.getReports()
        console.log('in overview')
    },
    methods: {
        toggle (target) {
            this.active = target
        },
        generateChart (target, title, data, backgroundColor) {
            /* eslint-disable no-new */
            let dateLabel = this.daily.map(obj => {
                return obj.date
            })
            let options = {
                tooltips: {
                    enabled: false
                },
                scales: {
                    xAxes: [{
                        barPercentage: 0.6
                    }]
                },
                animation: {
                    duration: 1,
                    onComplete: function () {
                        // show numbers in top of the bar
                        let chartInstance = this.chart
                        let ctx = chartInstance.ctx
                        ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily)
                        ctx.textAlign = 'center'
                        ctx.textBaseline = 'bottom'

                        this.data.datasets.forEach(function (dataset, i) {
                            var meta = chartInstance.controller.getDatasetMeta(i)
                            meta.data.forEach(function (bar, index) {
                                var data = dataset.data[index]
                                ctx.fillText(data, bar._model.x, bar._model.y - 5)
                            })
                        })
                    }
                }
            }
            new Chart(document.getElementById(target), {
                type: 'bar',
                data: {
                    labels: dateLabel,
                    datasets: [
                        {
                            label: title,
                            borderWidth: 0,
                            backgroundColor: backgroundColor,
                            data: data
                        }
                    ]
                },
                options: options
            })
        },
        getReports () {
            this.$http.get(api.platform_report).then(response => {
                this.periodic = response.data
            })
            let start = Vue.moment().subtract(7, 'days').format('YYYY-MM-DD')
            let end = Vue.moment().subtract(1, 'days').format('YYYY-MM-DD')

            this.$http.get(api.platform_report + `?mode=daily&date_0=${start}&date_1=${end}`).then(response => {
                this.daily = response.data
            }).then(() => {
                this.generateChart('profit-chart', '损益', this.daily.map(obj => {
                    return obj.profit
                }), '#6cc788')
                this.generateChart('bet-chart', '有效投注', this.daily.map(obj => {
                    return obj.valid_bet
                }), '#fcc100')
                this.generateChart('member-chart', '在线会员', this.daily.map(obj => {
                    return obj.member_count
                }), '#6887ff')
                this.generateChart('betnumbers-chart', '投注单量', this.daily.map(obj => {
                    return obj.bet_numbers
                }), '#0bb69f')
            })
        }
    }
}
</script>
