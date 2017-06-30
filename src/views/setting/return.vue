<template>
    <div>
        <div class="m-b" v-if="$root.permissions.includes('change_returnrate')" >
            <router-link tag="button" class="md-btn w-sm blue" to="/return/add">新增反水设定</router-link>
        </div>
        <div class="box">
            <table class="table table-striped b-t">
                <thead>
                    <tr>
                        <th>名称</th>
                        <th>状态</th>
                        <th>反水比组数</th>
                        <th>适用会员数量</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="setting in returnsettings" >
                        <td><router-link :to="'/return/' + setting.id + '/edit'">{{setting.name}}</router-link></td>
                        <td>
                            <span class="label success" v-if="setting.status==1" >启用</span>
                            <span class="label danger" v-if="setting.status==0">停用</span>
                            <template v-if="$root.permissions.includes('change_returnrate')" >
                                <a class="text-sm m-l" @click="toggleStatus(setting)" v-if="setting.status==1" >禁用</a>
                                <a class="text-sm m-l" @click="toggleStatus(setting)" v-else >启用</a>
                            </template>
                        </td>
                        <td>{{setting.group_count}}</td>
                        <td>
                            <router-link v-if="setting.member_count !== 0" :to="'/member/?return_settings=' + setting.id ">{{setting.member_count}}</router-link>
                            <span v-else>{{setting.member_count}}</span>
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
            'returnsettings': []
        }
    },
    // route: {
    //     data (transition) {
    //         this.getReturnsettings()
    //     }
    // },
    created () {
        this.getReturnsettings()
    },
    methods: {
        toggleStatus (setting) {
            this.$http.put(api.return + setting.id + '/', {
                'status': setting.status === 0 ? 1 : 0
            }).then((response) => {
                setting.status = response.data.status
            })
        },
        getReturnsettings () {
            this.$http.get(api.return + '?opt_fields=id,name,status,member_count,group_count').then((response) => {
                this.returnsettings = response.data
            })
        }
    }
}
</script>
