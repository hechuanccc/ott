<template>
    <div>
        <div class="box">
            <table st-table="rowCollectionBasic" class="table table-striped">
                <thead>
                    <tr>
                    <th>#</th>
                    <th>{{$t('common.name')}}</th>
                    <th>{{$t('common.status')}}</th>
                    <th>{{$t('provider.rank')}}</th>
                </tr>
                </thead>
                <tbody v-if="queryset.length > 0">
                    <tr v-for="provider in queryset" >
                        <td>{{provider.id}}</td>
                        <td><router-link :to="'/provider/' + provider.id">{{provider.name}}</router-link></td>
                        <td>
                            <span class="label success" v-if="provider.status === 1">{{$t('status.active')}}</span>
                            <span class="label" v-else>{{$t('status.inactive')}}</span>
                        </td>
                        <td>{{provider.rank}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="row m-b-lg">
            <pulling :queryset="queryset" :api="providerApi" :query="query" ref="pulling" @query-data="queryData" @query-param="queryParam"></pulling>
        </div>
    </div>
</template>
<script>
    import api from '../../api'
    import pulling from '../../components/pulling'

    export default {
        data () {
            return {
                providers: {
                    id: '',
                    name: '',
                    status: '',
                    icon: '',
                    rank: ''
                },
                staticurl: api.static,
                providerApi: api.provider,
                query: {},
                queryset: []
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
