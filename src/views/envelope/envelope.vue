<template>
    <div>
        <div class="m-b" v-if="$root.permissions.includes('change_level')">
            <router-link tag="button" class="md-btn blue w-sm" to="/envelope/add">{{$t('envelope.add_envelope')}}</router-link>
        </div>
        <div class="box">
            <table st-table="rowCollectionBasic" class="table table-striped b-t">
                <thead>
                <tr>
                    <th>{{$t('member.list_no')}}</th>
                    <th>{{$t('envelope.envelope_name')}}</th>
                    <th>{{$t('envelope.status')}}</th>
                    <th>{{$t('envelope.min_money')}}</th>
                    <th>{{$t('envelope.max_money')}}</th>
                </tr>
                </thead>
                <tbody v-if="queryset.length > 0">
                <tr v-for="envelope in queryset">
                    <td>{{envelope.id}}</td>
                    <td>
                        <router-link :to="'/envelope/' + envelope.id + '/edit'">{{envelope.name}}</router-link>
                    </td>
                    <td>
                        <span class="label success m-r" v-if="envelope.status==1">{{$t('status.active')}}</span>
                        <span class="label danger m-r" v-else>{{$t('status.inactive')}}</span>
                    </td>
                    <td>
                        {{envelope.min_bonus}}
                    </td>
                    <td>
                        {{envelope.max_bonus}}
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="row m-b-lg">
            <pulling :queryset="queryset" :api="envelopeApi" :query="query" ref="pulling" @query-data="queryData" @query-param="queryParam"></pulling>
        </div>
    </div>
</template>

<script>
import pulling from '../../components/pulling'
import api from '../../api'

export default {
    data () {
        return {
            showAll: false,
            envelopeApi: api.envelope,
            queryset: [{}],
            query: {}
        }
    },
    // route: {
    //     data (transition) {
    //         this.$refs.pulling.rebase()
    //     }
    // },
    created () {
        this.$nextTick(() => {
            this.$refs.pulling.rebase()
        })
    },
    methods: {
        submit () {
            this.$refs.pulling.submit()
        },
        queryData (queryset) {
            this.queryset = queryset
        },
        queryParam (query) {
            this.query = query
        }
    },
    components: {
        pulling
    }
}
</script>
