<template>
    <div>
      <div class="m-b">
        <ol class="breadcrumb">
          <li class="active"><router-link to="/member?report_flag=True">会员</router-link></li>
          <li class="active">{{$route.meta.title}}</li>
        </ol>
      </div>
      <div class="alert alert-danger" v-if="!$root.permissions.includes('update_member_details')">{{$t('common.errorPermission')}}</div>
      <div class="box">
        <div class="box-header b-b ">
          <h3>{{$t('common.attention')}}：</h3>
          <small>会员登录密码预设：123456，取款密码预设：123456。</small>
        </div>
        <div class="box-body">
          <form class="form m-a" v-on:submit.prevent="onSubmit">
            <div class="row b-b p-b m-b">
              <div class="col-md-4">
                <div class="form-group">
                  <label for="account" class="label-width">{{$t('member.account')}} </label>
                  <div class="inline-form-control">
                    <input class="form-control" name="account" :placeholder="member.id!='' ? '':'用户名, 必填'" v-model="member.username" required :disabled="member.id!=''" >
                  </div>
                </div>
                <div class="form-group" v-if="member.agent.name">
                  <label for="account" class="label-width">{{$t('member.agent')}}</label>
                  <div class="inline-form-control">
                    <input class="form-control" name="account" v-model="member.agent.name" required disabled >
                  </div>
                </div>
                <div class="form-group b-b p-b">
                  <label for="agent" v-if="member.agent.name" class="label-width">{{$t('member.update_agent')}}</label>
                  <label for="agent" v-else class="label-width">{{$t('member.agent')}}</label>
                  <div class="inline-form-control dropdown" :class="{'open': hasItems}">
                    <input class="form-control" type="text"
                           placeholder="代理商"
                           autocomplete="on"
                           v-model="query"
                           @keydown.down="down"
                           @keydown.up="up"
                           @keydown.enter="hit"
                           @keydown.esc="reset"
                           @blur="checkAgent"
                           @input="update"/>
                    <div class="dropdown-menu"  v-show="hasItems">
                      <a v-for="(item, $index) in items" class="dropdown-item" :class="activeClass($index)" @click="hit" @mousemove="setActive($index)">
                        <span v-text="item.username"></span>
                      </a>
                    </div>

                  </div>
                  <span class="text-danger v-m m-l-sm" v-show="agentValid === false">&times;无此代理</span>
                  <span class="text-success fa fa-check v-m m-l-sm" v-show="agentValid"></span>
                </div>

                <div class="form-group">
                  <label for="agent" class="label-width">{{$t('common.gender')}} </label>
                  <div class="from-control inline-form-control">
                    <label class="md-check">
                      <input type="radio" value="M" name="gender" v-model="member.gender">
                      <i class="blue"></i>
                      {{$t('common.male')}}
                    </label>

                    <label class="md-check m-l-lg" >
                      <input type="radio" value="F" name="gender" v-model="member.gender">
                      <i class="blue"></i>
                      {{$t('common.female')}}
                    </label>
                  </div>
                </div>

                <div class="form-group">
                  <label for="email" class="label-width">{{$t('common.email')}}</label>
                  <div class="inline-form-control">
                    <input type="email" class="form-control" name="email" placeholder="比如：abc@example.com" v-model="member.email">
                  </div>
                </div>
                <div class="form-group">
                  <label for="birthday" class="label-width">{{$t('common.birthday')}} </label>
                  <div class="inline-form-control">
                    <date-picker width='153' v-model="member.birthday"></date-picker>
                  </div>
                </div>

                <div class="form-group">
                  <label class="label-width">{{$t('common.wechat')}} </label>
                  <div class="inline-form-control">
                    <input type="text" class="form-control" placeholder="比如：ABC234" v-model="member.wechat">
                  </div>
                </div>
                <div class="form-group">
                  <label class="label-width">QQ</label>
                  <div class="inline-form-control">
                    <input type="number" class="form-control" placeholder="比如：453087589" v-model="member.qq">
                  </div>
                </div>

                <div class="form-group m-t" >
                  <label for="memo">{{$t('common.memo')}} </label>
                  <textarea class="form-control" rows="3" placeholder="仅供管理员记录会员信息，会员无法查看" v-model="member.memo"></textarea>
                </div>
              </div>
              <div class="col-md-4 col-md-offset-1">
                <div class="form-group">
                  <label class="label-width">{{$t('member.realname')}}</label>
                  <div class="inline-form-control">
                    <input class="form-control" :placeholder="member.id!='' ? '' : '比如：张三丰'" v-model="member.real_name" :disabled="!$root.permissions.includes('update_member_name')">
                  </div>
                </div>
                <div class="form-group">
                  <label class="label-width">{{$t('common.phone')}}</label>
                  <div class="inline-form-control">
                    <input class="form-control" type="number" :placeholder="member.id!='' ? '' : '比如：13856789876'" v-model="member.phone">
                  </div>
                </div>
                <div class="form-group">
                  <label for="agent" class="label-width">{{$t('member.level')}} </label>
                  <div class="inline-form-control">
                    <level :level="member.level" @level-select="levelSelect"></level>
                  </div>
                </div>
                <div class="form-group b-b p-b">
                  <label for="agent" class="label-width">{{$t('member.return_setting')}}</label>
                  <div class="inline-form-control">
                    <returnsetting :returnsetting="member.return_settings" @myReturn="returnData"></returnsetting>
                  </div>
                </div>
                <div v-if="$root.permissions.includes('list_update_member_bank')">
                  <h5 class="m-b">{{$t('bank.bank_title')}} </h5>
                  <div class="form-group">
                    <label class="label-width">{{$t('bank.name')}}</label>
                    <bank :bank="member.bank.bank" :req="bankFilled" @bank-select="bankSelect"></bank>
                  </div>
                  <div class="form-group">
                    <label class="label-width">{{$t('bank.province')}} </label>
                    <div class="inline-form-control">
                      <input class="form-control" v-model="member.bank.province" :required="bankFilled">
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="label-width">{{$t('bank.city')}} </label>
                    <div class="inline-form-control">
                      <input class="form-control" v-model="member.bank.city" :required="bankFilled">
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="label-width">{{$t('bank.account')}} </label>
                    <div class="inline-form-control">
                      <input class="form-control w-lg" type="number" placeholder="比如：张三丰" v-model="member.bank.account" :required="bankFilled">
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div class="alert alert-danger" v-if="errorMsg">{{errorMsg}}</div>
              <button type="submit" :disabled="!$root.permissions.includes('update_member_details')" class="md-btn blue w-sm" >{{$t('common.save')}} </button>
            </div>
          </form>
        </div>
      </div>
    </div>
</template>
<script>
    import DatePicker from 'vue2-datepicker'
    import VueTypeahead from 'vue-typeahead'
    import { handleError } from '../../utils/handleError'
    import api from '../../api'
    import Vue from 'vue'
    const format = 'YYYY-MM-DD'

    export default {
        extends: VueTypeahead,
        data () {
            return {
                agentValid: '',
                limit: 5,
                minChars: 1,
                query: '',
                member: {
                    id: '',
                    username: '',
                    agent: '',
                    real_name: '',
                    phone: '',
                    birthday: '',
                    wechat: '',
                    gender: '',
                    email: '',
                    memo: '',
                    bank: {
                        bank: '',
                        province: ''
                    },
                    return_settings: '',
                    level: '',
                    password: '123456',
                    withdraw_password: '123456'
                },
                initMember: {},
                field_locales: {
                    'username': '用户名错误：',
                    'birthday': ' 生日日期错误：',
                    'level': ' 会员等级错误：',
                    'return_settings': '反水设定错误：'
                },
                done: false,
                errorMsg: ''
            }
        },
        computed: {
            bankFilled: function () {
                let bankinfo = this.member.bank
                return bankinfo.bank || bankinfo.province || bankinfo.id || bankinfo.account
            },
            src: function () {
                return api.agent + '?opt_fields=username,id,&username_q=' + this.query + '&level=4'
            }
        },
        watch: {
            'member.birthday' (newObj, old) {
                if (newObj) {
                    this.member.birthday = Vue.moment(this.member.birthday).format(format)
                }
            }
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                let id = to.params.memberId
                if (vm.member.username === '') {
                    vm.initMember = Object.assign(vm.initMember, vm.member)
                } else {
                    vm.member = vm.initMember
                }
                if (id) {
                    vm.getMember(id)
                }
            })
        },
        methods: {
            returnData (data) {
                this.member.return_settings = data
            },
            bankSelect (bank) {
                this.member.bank.bank = bank
            },
            levelSelect (val) {
                this.member.level = val
            },
            checkAgent () {
                if (this.query !== '') {
                    this.$http.get(api.agent + '?opt_fields=username,id,&username=' + this.query + '&level=4')
                    .then((response) => {
                        if (response.data.length === 1) {
                            this.agentValid = true
                            this.member.agent = response.data[0].id
                        } else {
                            this.agentValid = false
                            this.member.agent = ''
                        }
                    })
                } else {
                    this.agentValid = false
                    this.agent = ''
                }
            },
            onSubmit (e) {
                this.initMember = Object.assign(this.initMember, this.member)
                if (!this.bankFilled) {
                    delete this.initMember.bank
                }
                // transfer json to string for agent
                if (!this.member.agent) {
                    this.errorMsg = '选择一个代理'
                    return
                }

                if (this.member.id) {
                    this.$http.put(api.member + this.member.id + '/', this.initMember).then(response => {
                        if (response.status === 200) {
                            this.$router.push('/member/' + response.data.id)
                        }
                    }, response => {
                        this.errorMsg = ''
                        for (let field in this.field_locales) {
                            this.errorMsg += handleError(response, field, this.field_locales)
                        }
                    })
                } else {
                    this.$http.post(api.member, this.initMember).then(response => {
                        if (response.status === 201) {
                            this.$router.push('/member/' + response.data.id)
                        }
                    }, response => {
                        this.errorMsg = ''
                        for (let field in this.field_locales) {
                            this.errorMsg += handleError(response, field, this.field_locales)
                        }
                    })
                }
            },
            getMember (id) {
                this.$http.get(api.member + id + '/?opt_expand=1').then((response) => {
                    let data = response.data
                    if (!data.bank) {
                        data.bank = {bank: '', province: ''}
                    }
                    if (data.level) {
                        data.level = data.level.id
                    }
                    if (data.return_settings) {
                        data.return_settings = data.return_settings.id
                    }
                    this.member = Object.assign(this.member, data)
                })
            },
            reset () {
                this.checkAgent()
            },
            // for agent field typeahead
            onHit (item) {
                this.items = []
                this.query = item.username
                this.checkAgent()
            },
            // for agent field typeahead
            prepareResponseData (data) {
                return data
            }
        },
        components: {
            DatePicker,
            bank: require('../../components/bank'),
            level: require('../../components/level'),
            returnsetting: require('../../components/returnsetting')
        }
    }
</script>
<style scoped>
.dropdown-menu .active{
    background-color: #0275d8;
}
</style>
