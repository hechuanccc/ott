<template>
    <div class="box">
        <table st-table="rowCollectionBasic" class="table table-striped">
            <thead>
                <tr>
                <th>#</th>
                <th>{{$t('common.name')}}</th>
                <th>{{$t('setting.display_name')}}</th>
                <th>{{$t('common.status')}}</th>
            </tr>
            </thead>
            <tbody>
                <tr v-for="paymentType in payment_types" >
                    <td>{{paymentType.id}}</td>
                    <td v-if="$root.permissions.includes('change_paymenttype')"><router-link :to="'/paymenttype/' + paymentType.id + '/edit'">{{paymentType.name}}</router-link></td>
                    <td v-else>{{paymentType.name}}</td>
                    <td>{{paymentType.display_name}}</td>
                    <td>
                        <span class="label success m-r" v-if="paymentType.status==1">启用</span>
                        <span class="label danger m-r" v-else>停用</span>
                        <template v-if="$root.permissions.includes('change_paymenttype')">
                            <a @click="toggleStatus(paymentType)" v-if="paymentType.status==1">停用商户</a>
                            <a @click="toggleStatus(paymentType)" v-else>启用商户</a>
                        </template>
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
            'payment_types': []
        }
    },
    // route: {
    //     data (transition) {
    //         this.getPaymentType()
    //     }
    // },
    created () {
        this.getPaymentType()
    },
    methods: {
        toggleStatus (paymentType) {
            this.$http.put(api.paymenttype + paymentType.id + '/', {
                'status': paymentType.status === 0 ? 1 : 0
            }).then((response) => {
                paymentType.status = response.data.status
            })
        },
        getPaymentType () {
            this.$http.get(api.paymenttype).then((response) => {
                this.payment_types = response.data
            })
        }
    }
}
</script>
