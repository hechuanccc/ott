<template>
    <div class="box">
        <table st-table="rowCollectionBasic" class="table table-striped b-t">
            <thead>
                <tr>
                    <th>#</th>
                    <th>{{$t('member.application_time')}}</th>
                    <th>{{$t('common.phone')}}</th>
                    <th>IP</th>
                    <th>{{$t('common.status')}}</th>
                    <th>{{$t('common.username')}}</th>
                    <th>{{$t('member.operation_log')}}</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="member in applications">
                    <td>{{member.id}}</td>
                    <td>{{member.created_at | moment("YYYY-MM-DD HH:mm")}}</td>
                    <td>{{member.phone}}</td>
                    <td>{{member.register_ip}}</td>
                    <td>
                        <span class="label" v-if="member.status==3">{{$t('status.ongoing')}}</span>
                        <span class="label success" v-else>{{$t('status.confirmed')}}</span>
                    </td>
                    <td>{{member.username}} / {show password here}</td>
                    <td>{{member.updated_at | moment("YYYY-MM-DD HH:mm")}}</td>
                    <td>
                        <div v-if="member.status == 3">
                            <button class="btn btn-sm btn-primary" @click="toggleStatus(member)">Confirm</button>
                            <button class="btn btn-sm" @click="toggleStatus(member)">Cancel</button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
    import api from '../../api'

    export default {
        data () {
            return {
                'applications': []
            }
        },
        created () {
            this.$nextTick(() => {
                this.getApplications()
            })
        },
        methods: {
            getApplications () {
                this.$http.get(api.memberapplication)
                .then((response) => {
                    this.applications = response.data
                })
            },
            toggleStatus (member) {
                this.$http.put(api.memberapplication + member.id + '/', {'status': member.status === 3 ? 1 : 3})
                .then((response) => {
                    member.status = response.data.status
                })
            }
        }
    }
</script>
