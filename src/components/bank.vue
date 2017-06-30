<template>
    <select v-model="myBank" class="form-control w-sm c-select" :required="req">
        <option class="form-control" value="">{{$t('common.please_select')}}</option>
        <option class="form-control" :value="b.id" v-for="b in banks">{{b.name}}</option>
    </select>
</template>

<script>
import api from '../api'
export default {
    props: ['bank', 'req'],
    data () {
        return {
            banks: [],
            myBank: this.bank
        }
    },
    watch: {
        myBank (val) {
            this.$emit('bank-select', val)
        }
    },
    created () {
        console.log('in bank.vue')
        this.$http.get(api.bank)
        .then(response => {
            console.log('banks')
            console.log(response.data)
            this.banks = response.data
        })
    }
}
</script>

