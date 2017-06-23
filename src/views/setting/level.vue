<template>
    <div>
        <div class="m-b" v-show="$root.permissions.includes('change_level')">
            <router-link class="md-btn blue w-sm" tag="button" to="/level/add">新增等级</router-link>
        </div>
        <div class="box">
            <table st-table="rowCollectionBasic" class="table table-striped b-t">
              <thead>
              <tr>
                <th>名称</th>
                <th>状态</th>
                <th>公司入款限额</th>
                <th>线上支付限额</th>
                <th>单次取款限额</th>
                <th>取款手续费</th>
                <th >取款手续费收取方式</th>
                <th>入款优惠</th>
                <th>显示会员报表</th>
                <th>会员数量</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="l in levels" >
                <td><router-link :to="'/level/' + l.id">{{l.name}}</router-link></td>
                <td>
                    <span v-if="l.status==1" class="label success">安全</span>
                    <span v-else-if="l.status==0" class="label danger">危险</span>
                </td>
                <td>
                    <div v-show="l.remit_limit">
                        <div  v-show="!l.remit_limit.lower">{{l.remit_limit.upper}} 以下</div>
                        <div  v-show="!l.remit_limit.upper">{{l.remit_limit.lower}} 以上</div>
                        <div v-show="l.remit_limit.upper && l.remit_limit.lower">{{l.remit_limit.lower}} 至 {{l.remit_limit.upper}}</div>
                    </div>
                </td>
                <td>
                    <div v-show="l.online_limit">
                        <div  v-show="!l.online_limit.lower">{{l.online_limit.upper}} 以下</div>
                        <div  v-show="!l.online_limit.upper">{{l.online_limit.lower}} 以上</div>
                        <div v-show="l.online_limit.upper && l.online_limit.lower">{{l.online_limit.lower}} 至 {{l.online_limit.upper}}</div>
                    </div>
                </td>
                <td>
                    <div v-show="l.withdraw_limit">
                        <div  v-show="!l.withdraw_limit.lower">{{l.withdraw_limit.upper}} 以下</div>
                        <div  v-show="!l.withdraw_limit.upper">{{l.withdraw_limit.lower}} 以上</div>
                        <div v-show="l.withdraw_limit.upper && l.withdraw_limit.lower">{{l.withdraw_limit.lower}} 至 {{l.withdraw_limit.upper}}</div>
                    </div>
                </td>
                <td>
                    {{l.withdraw_fee.rate}}
                </td>
                <td>
                    <div v-if="l.withdraw_fee.type == 2">{{l.withdraw_fee.hour}} 小时内取款 {{l.withdraw_fee.times}} 次免收</div>
                    <div v-else-if="l.withdraw_fee.type == 0">免收</div>
                    <div v-else-if="l.withdraw_fee.type == 1">每次皆收</div>
                </td>
                <td class="text-sm">
                    <router-link tag="div" v-show="l.online_discounts" :to="'/level/' + l.id">公司入款：
                        <a v-if="l.remit_discounts">{{l.remit_discounts.length}} 组设定</a>
                        <span class="text-muted" v-else>未设置</span>
                    </router-link>
                    <router-link tag="div" v-show="l.online_discounts" :to="'/level/' + l.id">线上支付：
                        <a v-if="l.online_discounts">{{l.online_discounts.length}} 组设定</a>
                        <span class="text-muted" v-else>未设置</span>
                    </router-link>
                </td>
                <td>
                  <span class="label success" v-if="l.report_flag">启用</span>
                  <span class="label danger" v-else>禁用</span>
                </td>
                <td>
                    <router-link v-if="l.member_count !== 0" :to="'/member/?level=' + l.id ">{{l.member_count }}</router-link>
                    <span v-else>{{l.member_count }}</span>
                </td>
              </tr>
              </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import api from '../../api'

export default {
    data () {
        return {
            'levels': []
        }
    },
    created () {
        console.log('in level page')
        this.getLevels()
    },
    methods: {
        getLevels () {
            this.$http.get(api.level).then((response) => {
                this.levels = response.data
            })
        }
    }
}
</script>
