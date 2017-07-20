<template>
    <div>
        <div class="loading text-center" v-if="loading"><i class='fa fa-spinner '></i>   <b class="">正在加载中...</b>   </div>
        <div v-else>
            <div class="pull-left m-l" v-if="!busy && count !== 0">
                <span class="">共 {{count}} 条，每页</span>
                <select class="form-control c-select" v-model="pageSize" style="width:80px">
                    <option value=20>20</option>
                    <option value=50>50</option>
                    <option value=100>100</option>
                    <option value=200>200</option>
                </select>
                <span>条，</span>
                <span>
                    显示第
                    <select class="form-control c-select" v-model="showPageGo" style="width:60px"  @change="pageGo()">
                        <option v-for="num in pageNum" :value="num">{{num}}</option>
                    </select>
                     页
                </span>
                </div>
            <div class="pull-center" >
                <div v-if="myQueryset.length === 0" class="text-muted">查无记录</div>
                <div v-else>
                    <button class="md-btn w-sm grey-600" @click="prevPage"  v-if="showPageGo !== 1">
                        <span v-if="!busy">上一页</span>
                        <span v-else>正在载入...</span>
                    </button>
                    <button class="md-btn w-sm grey-600" @click="nextPage" v-if="showPageGo !== countPage" :disabled="busy">
                        <span v-if="!busy">下一页</span>
                        <span v-else>正在载入...</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// to perform a pulling, parent componet need to boardcast 'rebase' event
// once the comopnent is ready, and might trigger 'rebase' everytime needed
export default {
    props: {
        queryset: {
            required: true,
            type: Array
        },
        query: {
            required: true,
            type: Object
        },
        extra: {
            default: '',
            type: String
        },
        api: {
            required: true,
            type: String
        },
        optexpand: {
            default: 1
        },
        amount: {
            default: ''
        },
        profit: {
            default: ''
        },
        export_query: {
            default: false
        }
    },
    data () {
        return {
            count: 0,
            limit: 20,
            next: '',
            busy: false,
            loading: true,
            pageSize: 20,
            showPageGo: 1,
            offset: 0,
            countPage: 0,
            pageNum: [],
            myQueryset: this.queryset
        }
    },
    watch: {
        limit (newObj, old) {
            this.loading = true
            this.getPage()
            this.rebase()
        },
        pageSize (newObj, old) {
            this.limit = newObj
            this.showPageGo = 1
            this.offset = 0
            this.getPage()
        }
    },
    methods: {
        pageGo () {
            let offset = parseInt(this.limit) * (parseInt(this.showPageGo) - 1)
            this.offset = offset
            this.loading = true
            this.rebase()
        },
        nextPage () {
            this.showPageGo = parseInt(this.showPageGo) + 1
            this.offset = this.limit * (this.showPageGo - 1)
            this.loading = true
            this.rebase()
        },
        prevPage () {
            this.showPageGo = parseInt(this.showPageGo) - 1
            this.offset = this.limit * (this.showPageGo - 1)
            this.loading = true
            this.rebase()
        },
        getPage () {
            this.countPage = Math.ceil(this.count / this.limit)
            let pageNum = []
            if (this.countPage === 1) {
                this.showPageGo = 1
            }
            for (var i = 1; i <= this.countPage; i++) {
                pageNum.push(i)
            }
            this.pageNum = pageNum
        },
        rebase () {
            console.log('re base')
            this.next = this.buildUrl(this.api, this.extra + '&opt_expand=' + this.optexpand + '&offset=' + this.offset + '&limit=' + this.limit)
            // this.queryset = []
            this.myQueryset = []
            this.pull()
        },
        // pull queryset form back-end
        pull () {
            let amount = ''
            let profit = ''
            this.busy = true
            this.loading = true
            this.$http.get(this.next).then(response => {
                console.log('pull====')
                if (response.data.total_amount) {
                    amount = response.data.total_amount
                    this.$emit('amount', amount)
                }
                if (response.data.total_profit) {
                    profit = response.data.total_profit
                    this.$emit('profit', profit)
                }
                this.busy = false
                this.count = response.data.count
                this.getPage()
                // this.queryset = this.queryset.concat(response.data.results)
                this.myQueryset = this.myQueryset.concat(response.data.results)
                this.$emit('query-data', this.myQueryset)
                this.loading = false
                this.next = response.data.next
            }, response => {
                if (response.status === 401) {
                    this.$router.push('/login?next=' + this.$route.path)
                }
            })
        },
        // build router query string through this.query
        buildUrl (api, defaultQuery) {
            let url = api + (defaultQuery ? ('?' + defaultQuery) : '')
            let params = []
            let query = this.$route.query
            for (let x in query) {
                if (query[x] === '' || query[x] === undefined) {
                    delete query[x]
                }
            }
            // sync query data with local data
            this.$emit('query-param', query)
            // this.query = query
            for (let x in query) {
                if (query[x]) {
                    params.push(x + '=' + query[x])
                }
            }
            console.log(params)
            console.log(params + '======111=')
            return url + (defaultQuery ? '&' : '?') + params.join('&')
        },
        getExportQuery () {
            let query = this.query
            for (let x in query) {
                if (query[x] === '' || query[x] === undefined) {
                    delete query[x]
                }
            }
            let params = []
            let exportQuery = this.export_query
            for (let x in query) {
                if (query[x]) {
                    params.push(x + '=' + query[x])
                }
            }
            exportQuery = params.join('&')
            this.$emit('export-query', exportQuery)
        },
        // change the route, and then parent component will know and trigger route.data
        // and broadcast 'rebase' event
        submit () {
            let query = this.query
            this.offset = 0
            this.showPageGo = 1
            for (let x in query) {
                if (query[x] === '' || query[x] === undefined) {
                    delete query[x]
                }
            }
            this.$router.push({path: this.$route.path, query: query})
        }
    }
}
</script>

