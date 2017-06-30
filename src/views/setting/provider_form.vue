<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/provider">娱乐城管理</router-link></li>
                <li class="active"><router-link  :to="'/provider/' + provider.id">娱乐城详细资料</router-link></li>
                <li class="active">{{$route.title}}</li>
            </ol>
        </div>
        <div class="alert alert-danger" v-if="!$root.permissions.includes('change_provider')">{{$t('common.errorPermission')}}</div>
        <div class="box">
            <div class="box-body">
                <form class="form m-a" v-on:submit.prevent="onSubmit" enctype="multipart/form-data">
                    <div class="row">
                        <div class="col-md-9">
                            <div>
                                <div class="form-group">
                                    <label  class="col-xs-1 label-width">{{$t('common.name')}} </label>
                                    <div class="inline-form-control">
                                        <input class="form-control" placeholder="Name" v-model="provider.name" required/>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label  class="col-xs-1 label-width">{{$t('provider.icon')}}</label>
                                    <div class="inline-form-control" v-if="!hasImage">
                                        <img :src="provider.icon" width="60">
                                    </div>
                                    <div class="inline-form-control">
                                        <input type="file" class="form-control" accept="image/*" @change="syncImage">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="agent" class="col-xs-1 label-width">{{$t('common.status')}} </label>
                                    <div class="from-control inline-form-control">
                                    <label class="md-check">
                                        <input type="radio" value="1" name="status" v-model="provider.status">
                                        <i class="blue"></i>
                                        {{$t('status.active')}}
                                    </label>

                                    <label class="md-check m-l-lg" >
                                        <input type="radio" value="0" name="status" v-model="provider.status">
                                        <i class="blue"></i>
                                         {{$t('status.inactive')}}
                                    </label>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label  class=" col-xs-1 label-width">{{$t('provider.rank')}} </label>
                                    <div class="inline-form-control  ">
                                        <input class="form-control" placeholder="Rank" v-model="provider.rank" />
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label  class=" col-xs-1 label-width ">{{$t('provider.maintenance_msg')}} </label>
                                    <div class="inline-form-control  col-md-8 padding-0">
                                        <textarea  class="form-control " rows="6" placeholder=""  v-model="provider.maintenance_msg"></textarea>
                                    </div>
                                </div>

                            </div>

                            <div class="row b-b p-b m-b">
                                <div class="col-md-9 ">

                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="alert alert-danger" v-if="responseError">{{responseError}}</div>
                        <button :disabled="!$root.permissions.includes('change_provider')" type="submit" class="md-btn w-sm blue">{{$t('common.save')}}</button>
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
                provider: {
                    id: '',
                    name: '',
                    icon: [],
                    status: '',
                    rank: '',
                    code: '',
                    module_name: '',
                    module_class: '',
                    host_name: '',
                    maintenance_msg: ''
                },
                hasImage: false,
                responseError: ''
            }
        },
        // route: {
        //     data (transition) {
        //         let id = transition.to.params.providerId
        //         if (id) {
        //             this.getProvider(id)
        //         }
        //     }
        // },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                let id = to.params.providerId
                if (id) {
                    vm.getProvider(id)
                }
            })
        },
        methods: {
            onSubmit () {
                let formData = new window.FormData()
                formData.append('name', this.provider.name)
                formData.append('code', this.provider.code)
                formData.append('module_name', this.provider.module_name)
                formData.append('module_class', this.provider.module_class)
                formData.append('status', this.provider.status)
                formData.append('host_name', this.provider.host_name)
                formData.append('rank', this.provider.rank)
                formData.append('maintenance_msg', this.provider.maintenance_msg)
                if (this.hasImage) {
                    formData.append('icon', this.provider.icon)
                }

                if (this.provider.id) {
                    this.$http.put(api.provider + this.provider.id + '/', formData).then(response => {
                        if (response.status === 200) {
                            this.$router.go('/provider/' + response.data.id)
                        }
                    }, response => {
                        this.responseError = response.data.error
                    })
                } else {
                    this.$http.post(api.provider, formData).then(response => {
                        if (response.status === 201) {
                            this.$router.go('/provider/' + response.data.id)
                        }
                    }, response => {
                        this.responseError = response.data.error
                    })
                }
            },
            getProvider (id) {
                this.$http.get(api.provider + id + '/').then((response) => {
                    this.provider = response.data
                })
            },
            syncImage (e) {
                this.provider.icon = e.target.files[0]
                this.hasImage = true
            }
        }
    }
</script>
<style scoped lang="scss">
    .padding-0{
        padding: 0;
    }
</style>
