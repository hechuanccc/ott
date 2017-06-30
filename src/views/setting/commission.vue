<template>
    <div>
        <div class="m-b" v-if="$root.permissions.includes('change_commission')">
            <router-link tag="button" class="md-btn blue w-sm" to="/commission/add">新增佣金设定</router-link>
        </div>
        <div class="box">
            <table class="table table-striped b-t">
                <thead>
                    <tr>
                        <th>名称</th>
                        <th>状态</th>
                        <th>有效会员最低投注金额</th>
                        <th>单笔存款手续费</th>
                        <th>单笔取款手续费</th>
                        <th>适用代理商数量</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="setting in commissionsettings" >
                        <td><router-link :to="'/commission/' + setting.id + '/edit'">{{setting.name}}</router-link></td>
                        <td>
                            <span class="label success" v-if="setting.status==1">启用</span>
                            <span class="label danger" v-if="setting.status==0">停用</span>
                            <template v-if="$root.permissions.includes('change_commission')">
                                <a class="text-sm m-l" @click="toggleStatus(setting)" v-if="setting.status==1" >禁用</a>
                                <a class="text-sm m-l" @click="toggleStatus(setting)" v-else >启用</a>
                            </template>
                        </td>
                        <td>{{setting.invest_least}}</td>
                        <td>{{setting.deposit_fee}} <span v-if="deposit_fee_max">上限：{{setting.deposit_fee_max}}</span></td>
                        <td>{{setting.withdraw_fee}} <span v-if="withdraw_fee_max">上限：{{setting.withdraw_fee_max}}</span></td>
                        <td>
                            <router-link v-if="setting.agent_count !== 0" :to="'/agent/?commission_settings=' + setting.id ">{{setting.agent_count}}</router-link>
                            <span v-else>{{setting.agent_count}}</span>
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
            tips: [],
            commissionsettings: [],
            deposit_fee_max: '',
            withdraw_fee_max: ''
        }
    },
    // route: {
    //     data (transition) {
    //         this.getCommissionsettings()
    //     }
    // },
    created () {
        this.getCommissionsettings()
    },
    methods: {
        toggleStatus (setting) {
            this.$http.put(api.commission + setting.id + '/', {
                'status': setting.status === 0 ? 1 : 0
            }).then((response) => {
                setting.status = response.data.status
            })
        },
        getCommissionsettings () {
            let fields = '?opt_fields=invest_least,id,name,status,deposit_fee,deposit_fee_max,withdraw_fee,withdraw_fee_max,member_count,agent_count'
            this.$http.get(api.commission + fields).then((response) => {
                console.log('return data')
                console.log(response.data)
                // this.commissionsettings = []
                // for (let i = 0; i < response.data.length; i++) {
                //     this.commissionsettings.push(response.data[i])
                // }
                this.commissionsettings = response.data
                console.log('this.commissionsettings')
                console.log(this.commissionsettings)
            })
        }
    }
}
</script>
