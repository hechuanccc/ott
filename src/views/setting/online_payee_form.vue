<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/online_payee">线上支付管理</router-link></li>
                <li class="active">{{$route.meta.title}}</li>
            </ol>
        </div>
        <div class="alert alert-danger" v-if="!$root.permissions.includes('change_onlinepayee')">{{$t('common.errorPermission')}}</div>
        <div class="box">
            <div class="box-body">
                <form class="form m-a" v-on:submit.prevent="onSubmit">
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="form-group">
                                <label  class="label-width">{{$t('common.name')}}</label>
                                <div class="inline-form-control">
                                    <input type="text" class="form-control" placeholder="名称" v-model="payee.name" required >
                                </div>
                            </div>
                            <div class="form-group">
                                <label  class="label-width">{{$t('setting.display_name')}}</label>
                                <div class="inline-form-control">
                                    <input type="text" class="form-control" placeholder="显示名称" v-model="payee.display_name" >
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="label-width">{{$t('setting.type')}}</label>
                                <div class="inline-form-control">
                                    <select class="form-control c-select" v-model="payee.payment_gateway" required>
                                        <option :value="p.id" v-for="p in paymenttypes">{{p.name}}</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="label-width">{{$t('setting.merchant_num')}}</label>
                                <div class="inline-form-control">
                                    <input class="form-control" type="text" v-model="payee.merchant_num" required />
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="label-width">{{$t('setting.certificate')}}</label>
                                <div class="inline-form-control">
                                    <input type="text" class="form-control" v-model="payee.certificate"  />
                                </div>
                            </div>

                            <div class="form-group">
                                <label  class="label-width">{{$t('setting.board_url')}}</label>
                                <div class="inline-form-control">
                                    <input  class="form-control" placeholder="Board URL" v-model="payee.board_url"  required/>
                                </div>
                            </div>

                            <div class="form-group">
                                <label  class="label-width">{{$t('setting.payment_domain')}}</label>
                                <div class="inline-form-control">
                                    <input  class="form-control" v-model="payee.domain_url"/>
                                </div>
                            </div>

                            <div class="form-group">
                                <label  class="label-width">{{$t('setting.expired_in')}}</label>
                                <div class="inline-form-control">
                                    <input  class="form-control" placeholder="Expiration" v-model="payee.expired_in" required>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="form-group">
                                <label  class="label-width">{{$t('member.level')}}</label>
                                <level :level="payee.level" :mode="'checkbox'" @level-select="levelSelect"></level>
                            </div>


                            <input type="hidden" v-model="payee.updated_by">

                            <div class="form-group" >
                                <label for="memo">{{$t('common.memo')}}</label>
                                <textarea class="form-control" name="memo" rows="2" cols="4" v-model="payee.memo"></textarea>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="alert alert-danger" v-if="responseError">{{responseError}}</div>
                        <button :disabled="!$root.permissions.includes('change_onlinepayee')" type="submit" class="md-btn w-sm blue">{{$t('common.save')}}</button>
                     </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
    import api from '../../api'
    import { handleError } from '../../utils/handleError'
    import $ from '../../utils/util'

    export default {
        data () {
            return {
                payee: {
                    name: '',
                    merchant_num: '',
                    certificate: '',
                    board_url: '',
                    level: [],
                    expired_in: '',
                    memo: '',
                    payment_gateway: '',
                    domain_url: ''
                },
                field_locales: {
                    'display_name': '显示名称有误：'
                },
                responseError: '',
                paymenttypes: []
            }
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                let id = to.params.online_payeeId
                if (id) {
                    vm.getPayee(id)
                }
                vm.getPaymentTypes()
            })
        },
        methods: {
            onSubmit (e) {
                let formData = new window.FormData()
                formData.append('name', this.payee.name)
                formData.append('display_name', this.payee.display_name)
                formData.append('payment_gateway', this.payee.payment_gateway)
                formData.append('merchant_num', this.payee.merchant_num)
                formData.append('certificate', this.payee.certificate)
                formData.append('board_url', this.payee.board_url)
                formData.append('level', this.payee.level)
                formData.append('expired_in', this.payee.expired_in)
                formData.append('payment_gateway', this.payee.payment_gateway)
                formData.append('domain_url', this.payee.domain_url)

                if (this.payee.id) {
                    console.log('this.payee.id 存在')
                    this.$http.put(api.onlinepayee + this.payee.id + '/', formData).then(response => {
                        if (response.status === 200) {
                            this.$router.go('/online_payee/' + response.data.id)
                        }
                    })
                } else {
                    this.$http.post(api.onlinepayee, this.payee).then(response => {
                        if (response.status === 201) {
                            this.$router.go('/online_payee/' + response.data.id)
                        }
                    }, response => {
                        console.log('this.payee.id no存在')
                        this.responseError = ''
                        for (let field in this.field_locales) {
                            this.responseError += handleError(response, field, this.field_locales)
                        }
                        if (!this.responseError) {
                            console.log(23323232)
                            this.responseError = $.formatError(response.data.error)
                        }
                    })
                }
            },
            getPaymentTypes () {
                console.log('getPaymentTypes ' + api.paymentgateway)
                this.$http.get(api.paymentgateway).then((response) => {
                    this.paymenttypes = response.data
                })
            },
            getPayee (id) {
                console.log('getPayee form ' + api.onlinepayee + id + '/')
                this.$http.get(api.onlinepayee + id + '/').then((response) => {
                    this.payee = Object.assign(this.payee, response.data)
                })
            },
            levelSelect (val) {
                this.level = val
            }
        },
        components: {
            level: require('../../components/level')
        }
    }

</script>

<style>
</style>
