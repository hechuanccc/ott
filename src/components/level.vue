<template>
    <select class="form-control w-sm c-select" v-model="level" @change="onChange" v-if="mode==='select'" :required="req" :disabled="!disabled">
        <option value="">{{$t('common.please_select')}}</option>
        <option class="form-control" :value="l.id" v-for="l in levels">{{l.name}}</option>
    </select>
    <div v-else>
        <label class="ui-check ui-check-md m-r"  v-for="l in levels">
            <input type="checkbox" name="paymenttype" :value="l.id" v-model="myLevel">
            <i class="dark-white"></i>
            {{l.name}}
        </label>
    </div>
</template>

<script>
import api from '../api'
export default {
    props: {
        req: {
            default: false
        },
        level: [String, Number, Array],
        default: [String, Number],
        mode: {
            default: 'select'
        },
        disabled: {
            default: true
        }
    },
    data () {
        return {
            levels: [],
            myLevel: this.level
        }
    },
    watch: {
        level (val) {
            this.myLevel = val
        },
        myLevel (val) {
            this.$emit('level-select', val)
        }
    },
    created () {
        console.log('level api request ' + api.level)
        this.$http.get(api.level)
        .then(response => {
            this.levels = response.data
            if (this.default) {
                this.level = this.default
            }
        })
    },
    methods: {
        onChange: function () {
            this.$emit('level-select', this.level)
        }
    }
}
</script>

