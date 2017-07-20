<template>
    <div class="box">
        <div class="box-body clearfix form-inline form-input-sm">
            <div class="row">
                <div class="col-xs-10">
                    <label class="m-r">{{$t('common.date')}}</label>
                    <!--<datepicker :width="'110px'"-->
                                <!--:value.sync="date_0"-->
                                <!--:disabled-days-of-Week="disabled"-->
                                <!--format="yyyy-MM-dd">-->
                    <!--</datepicker>-->
                    <!--<span>~</span>-->
                    <!--<datepicker :width="'110px'"-->
                                <!--:value.sync="date_1"-->
                                <!--:disabled-days-of-Week="disabled"-->
                                <!--format="yyyy-MM-dd">-->
                    <!--</datepicker>-->
                </div>
                <div class="col-xs-12 m-t">
                    <a :href="href" class="md-btn w-sm blue a-btn" :disabled="!hasDates">{{$t('returnrate.export')}}</a>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import api from '../../api'
    import { datepicker } from 'vue-strap'
    import VueCookie from 'vue-cookie'
    import Vue from 'vue'
    const format = 'YYYY-MM-DD'

    export default {
        data () {
            return {
                date_0: Vue.moment().format(format),
                date_1: Vue.moment().format(format),
                url: '',
                href: '',
                isDateAvailable: false
            }
        },
        computed: {
            hasDates () {
                let test = this.date_0 !== '' && this.date_1 !== ''
                this.href = `${api.returnreport}?token=${VueCookie.get('access_token')}&report=commission&date_0=${this.date_0}&date_1=${this.date_1}`
                return test
            }
        },
        components: {
            datepicker
        }
    }
</script>
<style>
    a.a-btn, a.a-btn:hover {
        color: #fff;
    }
</style>
