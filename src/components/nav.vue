<template>
    <div id="aside" class="app-aside modal fade folded md show-text nav-dropdown" v-if="showNav">
        <div class="left navside grey dk"  v-if="$root.$data.userType !== 'agent'">
            <div class="navbar no-radius">
                <a class="navbar-brand" href="/" v-if="$root.permissions.includes('list_report_betrecord')">
                  <img src="../../static/images/logo.png" />
                  <span class="hidden-folded inline">$t{{'app_name'}}</span>
                </a>
                <a class="navbar-brand" v-else>
                    <img src="../../static/images/logo.png" />
                    <span class="hidden-folded inline">$t{{'app_name'}}</span>
                </a>
            </div>

            <div>
                <nav class="nav-stacked nav-active-blue" >
                    <ul class="nav" ui-nav="">
                        <template v-if="$root.permissions.includes('list_report_betrecord')">
                            <li><div class="b-b b m-t-sm m-b-sm"></div></li>

                            <li :class="$route.meta.group == 'overview' ? 'active' : ''" >
                                <router-link to="/" >
                                  <span class="nav-icon"><i class="material-icons">&#xe3fc;</i></span>
                                  <span class="nav-text">{{$t("nav.overview")}}</span>
                                </router-link>
                            </li>

                            <li><div class="b-b b m-t-sm"></div></li>
                        </template>
                        <li :class="$route.meta.group == 'bill' ? 'active' : ''">
                            <a>
                                <span class="nav-caret" ><i class="fa fa-caret-down"></i></span>
                                <span class="nav-icon" ><i class="material-icons">&#xE227;</i></span>
                                <span class="nav-text">{{$t("nav.bills")}}</span>
                            </a>
                            <ul class="nav-sub">
                                <li v-if="$root.permissions.includes('list_remit_online_withdraw_page')"><router-link to="/bill/remit?report_flag=True"><span class="nav-text">{{$t('bill.remit_audit')}}</span></router-link></li>
                                <li v-if="$root.permissions.includes('list_remit_online_withdraw_page')"><router-link to="/bill/online?report_flag=True"><span class="nav-text">{{$t('bill.online_payment')}}</span></router-link></li>
                                <li v-if="$root.permissions.includes('list_remit_online_withdraw_page')"><router-link to="/bill/withdraw?report_flag=True"><span class="nav-text">{{$t('bill.withdrawal_audit')}}</span></router-link></li>
                                <li><router-link to="/bill/search?report_flag=True"><span class="nav-text">{{$t('bill.transcations_query')}}</span></router-link></li>
                                <li><router-link to="/bill/returnrate"><span class="nav-text">{{$t('bill.return_report')}}</span></router-link></li>
                                <li v-if="$root.permissions.includes('calculate_commission')"><router-link to="/bill/commission" ><span class="nav-text">{{$t('bill.commission_report')}}</span></router-link></li>
                            </ul>
                        </li>

                        <li :class="$route.meta.group == 'report' ? 'active' : ''">
                            <a>
                                <span class="nav-caret">
                                  <i class="fa fa-caret-down"></i>
                                </span>
                                <span class="nav-icon">
                                  <i class="material-icons">&#xe1b8;</i>
                                </span>
                                <span class="nav-text">{{$t("nav.report")}}</span>
                            </a>
                            <ul class="nav-sub">
                                <li v-if="$root.permissions.includes('list_report_betrecord')"><router-link to="/report/game"><span class="nav-text">{{$t('nav.game_report')}}</span></router-link></li>
                                <li><router-link to="/report/login?report_flag=True"><span class="nav-text">{{$t('nav.login_record')}}</span></router-link></li>
                                <li><router-link to="/report/actionrecord"><span class="nav-text">{{$t('nav.action_record')}}</span></router-link></li>
                                <li><router-link to="/report/betrecord?report_flag=True"><span class="nav-text">{{$t('nav.bet_record')}}</span></router-link></li>
                                <li><router-link to="/report/transferrecord"><span class="nav-text">{{$t('nav.transfer_record')}}</span></router-link></li>
                            </ul>
                        </li>
                        <li><div class="b-b m-t-sm m-b-sm"></div></li>
                        <li :class="$route.meta.group == 'member' ? 'active' : ''">
                            <a>
                                <span class="nav-caret"><i class="fa fa-caret-down"></i></span>
                                <span class="nav-icon"><i class="material-icons">&#xE7FC;</i></span>
                                <span class="nav-text">{{$t("nav.member")}}</span>
                            </a>
                            <ul class="nav-sub">
                                <li>
                                    <router-link to="/member?report_flag=True">
                                        <span class="nav-text">{{$t("nav.member_list")}}</span>
                                    </router-link>
                                </li>
                                <li v-if="$root.permissions.includes('update_member_details')">
                                    <router-link  to="/member/add">
                                        <span class="nav-text">{{$t("nav.member_add")}}</span>
                                    </router-link>
                                </li>
                                <!--<li>-->
                                    <!--<router-link to="/member/applications">-->
                                        <!--<span class="nav-text">{{$t("nav.member_application")}}</span>-->
                                    <!--</router-link>-->
                                <!--</li>-->
                            </ul>
                        </li>

                        <li  :class="$route.meta.group == 'agent' ? 'active' : ''">
                            <a >
                                <span class="nav-caret"><i class="fa fa-caret-down"></i></span>
                                <span class="nav-icon"><i class="material-icons">&#xE7FB;</i></span>
                                <span class="nav-text">{{$t("nav.agent")}}</span>
                            </a>
                            <ul class="nav-sub">
                                <li><router-link to="/agent"><span class="nav-text">{{$t("nav.agent_list")}}</span></router-link></li>
                                <li v-if="$root.permissions.includes('change_agent_level_4')"><router-link to="/agent/add"><span class="nav-text">{{$t("nav.agent_add")}}</span></router-link></li>
                                <li><router-link to="/agent/applications"><span class="nav-text">{{$t("nav.agent_application")}}</span></router-link></li>
                            </ul>
                        </li>

                        <li :class="$route.meta.group == 'setting' ? 'active' : ''">
                            <a>
                                <span class="nav-caret"><i class="fa fa-caret-down"></i></span>
                                <span class="nav-icon"><i class="material-icons">&#xE8B8;</i></span>
                                <span class="nav-text">{{$t("nav.setting")}}</span>
                            </a>
                            <ul class="nav-sub">
                                <li><router-link to="/global_parameters"><span class="nav-text">{{$t("nav.global_parameters")}}</span></router-link></li>
                                <li><router-link to="/level"><span class="nav-text">{{$t("nav.setting_level")}}</span></router-link></li>
                                <li><router-link to="/online_payee"><span class="nav-text">{{$t("nav.setting_online_payee")}}</span></router-link></li>
                                <li><router-link to="/paymenttype"><span class="nav-text">{{$t("setting.setting_paymenttype")}}</span></router-link></li>
                                <li><router-link to="/remit_payee"><span class="nav-text">{{$t("nav.setting_remit_payee")}}</span></router-link></li>
                                <li><router-link to="/return"><span class="nav-text">{{$t("nav.setting_return")}}</span></router-link></li>
                                <li><router-link to="/commission"><span class="nav-text">{{$t("nav.setting_commission")}}</span></router-link></li>
                                <li><router-link to="/provider"><span class="nav-text">{{$t("nav.setting_provider")}}</span></router-link></li>
                                <li><router-link to="/staff"><span class="nav-text">{{$t("nav.staff")}}</span></router-link></li>
                                <li><router-link to="/promotion"><span class="nav-text">{{$t("nav.promotion")}}</span></router-link></li>
                            </ul>
                        </li>

                        <li><div class="b-b b m-t-sm m-b-sm"></div></li>
                        <li :class="$route.meta.group == 'envelopes' ? 'active' : ''">
                            <a>
                                <span class="nav-icon"><i class="material-icons">&#xE158</i></span>
                                <span class="nav-text">{{$t("envelope.envelope_setting")}}</span>
                            </a>
                            <ul class="nav-sub">
                                <li><router-link to="/envelope_settings"><span class="nav-text">红包设定</span></router-link></li>
                                <li><router-link to="/envelope"><span class="nav-text">红包</span></router-link></li>
                            </ul>
                        </li>

                        <li :class="$route.meta.group == 'manage' ? 'active' : ''">
                            <a>
                                <span class="nav-icon"><i class="material-icons">&#xE051;</i></span>
                                <span class="nav-text">{{$t("nav.cms")}}</span>
                            </a>
                            <ul class="nav-sub">
                                <li><router-link to="/banner"><span class="nav-text">{{$t("manage.title_banner")}}</span></router-link></li>
                                <li><router-link to="/announcement"><span class="nav-text">{{$t("manage.title_announcement")}}</span></router-link></li>
                                <li><router-link to="/website"><span class="nav-text">{{$t("manage.title_website")}}</span></router-link></li>
                                <li><router-link to="/messages"><span class="nav-text">{{$t("nav.message")}}</span></router-link></li>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
        <div class="left navside grey dk" v-else>
            <div class="navbar no-radius">

                <router-link class="navbar-brand" to="/">
                  <img src="../../static/images/logo.png" />
                  <span class="hidden-folded inline">$t{{'app_name'}}</span>
                </router-link>
            </div>

            <div flex>
              <nav class="nav-stacked nav-active-blue" flex>
                <ul class="nav" ui-nav="">
                    <li><div class="b-b b m-t-sm m-b-sm"></div></li>
                    <li :class="$route.meta.group == 'overview' ? 'active' : ''">
                        <router-link to="'/'" >
                          <span class="nav-icon"><i class="material-icons">&#xe3fc;</i></span>
                          <span class="nav-text">{{$t("nav.overview")}}</span>
                        </router-link>
                    </li>

                    <li :class="$route.meta.group == 'member' ? 'active' : ''">
                        <a>
                            <span class="nav-caret"><i class="fa fa-caret-down"></i></span>
                            <span class="nav-icon"><i class="material-icons">&#xE7FC;</i></span>
                            <span class="nav-text">{{$t("nav.member")}}</span>
                        </a>
                        <ul class="nav-sub">
                            <li>
                                <router-link to="/member">
                                    <span class="nav-text">{{$t("nav.member_list")}}</span>
                                </router-link>
                            </li>
                        </ul>
                    </li>

                    <li :class="$route.meta.group == 'bill' ? 'active' : ''">
                        <a>
                            <span class="nav-caret" ><i class="fa fa-caret-down"></i></span>
                            <span class="nav-icon" ><i class="material-icons">&#xE227;</i></span>
                            <span class="nav-text">{{$t("nav.bills")}}</span>
                        </a>
                        <ul class="nav-sub">
                            <li><router-link to="/bill/commission"><span class="nav-text">{{$t('bill.commission_report')}}</span></router-link></li>
                        </ul>
                    </li>

                    <li :class="$route.meta.group == 'report' ? 'active' : ''">
                        <a>
                            <span class="nav-caret">
                              <i class="fa fa-caret-down"></i>
                            </span>
                            <span class="nav-icon">
                              <i class="material-icons">&#xe1b8;</i>
                            </span>
                            <span class="nav-text">{{$t("nav.report")}}</span>
                        </a>
                        <ul class="nav-sub">
                            <li><router-link to="/report/game"><span class="nav-text">{{$t('nav.game_report')}}</span></router-link></li>
                            <li><router-link to="/report/transferrecord"><span class="nav-text">{{$t('nav.transfer_record')}}</span></router-link></li>
                        </ul>
                    </li>
                </ul>
                </nav>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            showNav: {
                default: true
            }
        }
    }
</script>
