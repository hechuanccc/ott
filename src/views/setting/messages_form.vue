<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/messages">站内信</router-link></li>
                <li class="active">{{$route.meta.title}}</li>
            </ol>
        </div>
        <div class="box">
            <div class="box-body">
                <form class="form m-a" v-on:submit.prevent="onSubmit">
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="form-group">
                                <label  class="label-width">{{$t('messages.title')}}</label>
                                <div class="inline-form-control">
                                    <input type="text" class="form-control" placeholder="标题不能超过100个字节" v-model="message.title"  >
                                </div>
                            </div>
                            <div class="form-group">
                                <label  class="label-width">{{$t('messages.transaction')}}</label>
                                <div class="inline-form-control">
                                    <input  type="text" class="form-control" placeholder="" v-model="message.transaction" >
                                </div>
                            </div>
                            <div class="form-group">
                                <label  class="label-width">{{$t('messages.receiver')}}</label>
                                <div class="inline-form-control">
                                    <input  type="text" class="form-control" @blur='checkMember' v-model="message.receiver" :disabled="!(!message.member_level)">
                                </div>
                                <label class="text-danger m-l">  * 接收人或群发只能选择一个，接收人可以同时填写多个（以英文 "," 隔开）</label>
                            </div>
                            <div class="form-group">
                                <label  class="label-width">{{$t('messages.members')}} </label>
                                <div class="inline-form-control">
                                    <level :level="message.member_level" :disabled="!message.receiver" @level-choose="changeFromLevel"></level>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-6">
                            <div class="form-group">
                                <label  class="label-width">{{$t('messages.text')}} </label>
                                <textarea v-model="message.content" class="form-control" rows="3" placeholder="内容不能超过500个字节"></textarea>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="alert alert-danger" v-if="responseError">{{responseError}}</div>
                        <button type="submit" class="md-btn w-sm blue">{{$t('common.send')}}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
    import api from '../../api'
    import { handleError } from '../../utils/handleError'

    export default {
        data () {
            return {
                message: {
                    id: '',
                    content: '',
                    receiver: '',
                    sent_at: '',
                    title: '',
                    transaction: '',
                    member_level: ''
                },
                responseError: '',
                field_locales: {
                    'content': '发送内容有误：',
                    'receiver': '群发或接收人有误：',
                    'title': '标题有误：'
                },
                checkMembers: true
            }
        },
        methods: {
            onSubmit (e) {
                if (this.message.member_level || this.message.receiver) {
                    if (!this.checkMembers) {
                        this.checkMember()
                        return
                    }
                    this.$http.post(api.messages, this.message).then(response => {
                        if (response.status === 201) {
                            this.$router.push('/messages/')
                        }
                    }, response => {
                        this.responseError = ''
                        for (let field in this.field_locales) {
                            this.responseError += handleError(response, field, this.field_locales)
                        }
                    })
                } else {
                    this.responseError = '群发或接收人必须填写一个'
                }
            },
            checkMember () {
                this.responseError = ''
                if (this.message.receiver) {
                    this.$http.get(api.checkMember + '?username=' + this.message.receiver).then((response) => {
                        if (response.data.length > 0) {
                            this.responseError = response.data + ' 会员名输入有误，请从新填写(接收人请用英文","隔开)'
                            this.checkMembers = false
                        } else {
                            this.checkMembers = true
                        }
                    })
                }
            },
            changeFromLevel (val, index) {
                this.message.member_level = val
            }
        },
        components: {
            level: require('../../components/level')
        }
    }

</script>
