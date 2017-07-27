<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/paymenttype">支付类型管理</router-link></li>
                <li class="active">{{$route.meta.title}}</li>
            </ol>
        </div>
        <div class="alert alert-danger" v-if="!$root.permissions.includes('change_paymenttype')">{{$t('common.errorPermission')}}</div>
        <div class="box">
            <div class="box-body">
                <form class="form m-a" v-on:submit.prevent="onSubmit">
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="form-group">
                                <label  class="label-width">{{$t('common.name')}}</label>
                                <div class="inline-form-control">
                                    <input type="text" class="form-control" placeholder="名称" v-model="payment.name" disabled >
                                </div>
                            </div>
                            <div class="form-group">
                                <label  class="label-width">{{$t('setting.display_name')}}</label>
                                <div class="inline-form-control">
                                    <input  type="text" class="form-control" placeholder="显示名称" v-model="payment.display_name" disabled>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="form-group">
                                <label  class="label-width">{{$t('setting.payment_gateway')}}</label>
                                <div>
                                    <label class="ui-check ui-check-md m-r"   v-for="detail in payment.detail">
                                        <input :disabled="!$root.permissions.includes('change_paymenttype')" type="checkbox" name="payees" :checked="detail.activate" :value="detail.payee_id" v-model="payment.payees">
                                        <i class="dark-white"></i>
                                        {{detail.name}}
                                    </label>
                                </div>
                            </div>
                            <div class="form-group" >
                                <label for="memo">{{$t('common.memo')}}</label>
                                <textarea :disabled="!$root.permissions.includes('change_paymenttype')" class="form-control" name="memo" rows="2" cols="4" v-model="payment.description"></textarea>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button :disabled="!$root.permissions.includes('change_paymenttype')" type="submit" class="md-btn w-sm blue">{{$t('common.save')}}</button>
                        <span class="text-success m-l-md" v-show="updated">{{$t('common.saved_successfully')}}</span>
                     </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
    import api from '../../api'

    export default {
        data () {
            return {
                payment: {
                    description: '',
                    payees: [],
                    detail: [],
                    display_name: '',
                    name: '',
                    status: ''
                },
                updated: false
            }
        },
        // route: {
        //     data (transition) {
        //         let id = transition.to.params.id
        //         if (id) {
        //             this.getPaymentType(id)
        //         }
        //     }
        // },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                let id = to.params.id
                if (id) {
                    vm.getPaymentType(id)
                }
            })
        },
        watch: {
            updated (newObj, old) {
                setTimeout(() => {
                    this.updated = false
                }, 2500)
            }
        },
        methods: {
            onSubmit (e) {
                if (this.payment.id) {
                    this.$http.put(api.paymenttype + this.payment.id + '/', this.payment).then(response => {
                        if (response.status === 200) {
                            this.updated = true
                        }
                    })
                }
            },
            getPaymentType (id) {
                this.$http.get(api.paymenttype + id + '?opt_expand=1').then((response) => {
                    this.payment = Object.assign(this.payment, response.data)
                })
            }
        },
        components: {
            level: require('../../components/level')
        }
    }

</script>
