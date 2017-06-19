<template>
    <div id="aside" class="app-aside modal fade folded md show-text nav-dropdown" v-if="showNav">
        <div class="left navside grey dk" >
            <div class="navbar no-radius">
                <a class="navbar-brand" href="/" >
                  <img src="../../static/images/logo.png" />
                  <span class="hidden-folded inline">222</span>
                </a>
            </div>

            <div>

            </div>
        </div>
        <!--<div class="left navside grey dk" v-else>-->
            <!--<div class="navbar no-radius">-->

                <!--<a class="navbar-brand" href="/">-->
                  <!--<img src="../../static/images/logo.png" />-->
                  <!--<span class="hidden-folded inline">$t{{'app_name'}}</span>-->
                <!--</a>-->
            <!--</div>-->

            <!--<div flex>-->
              <!--<nav class="nav-stacked nav-active-blue" flex>-->
                <!--<ul class="nav" ui-nav="">-->
                    <!--<li><div class="b-b b m-t-sm m-b-sm"></div></li>-->
                    <!--<li :class="$route.group == 'overview' ? 'active' : ''">-->
                        <!--<a v-link="'/'" >-->
                          <!--<span class="nav-icon"><i class="material-icons">&#xe3fc;</i></span>-->
                          <!--<span class="nav-text">{{$t("nav.overview")}}</span>-->
                        <!--</a>-->
                    <!--</li>-->

                    <!--<li :class="$route.group == 'member' ? 'active' : ''">-->
                        <!--<a>-->
                            <!--<span class="nav-caret"><i class="fa fa-caret-down"></i></span>-->
                            <!--<span class="nav-icon"><i class="material-icons">&#xE7FC;</i></span>-->
                            <!--<span class="nav-text">{{$t("nav.member")}}</span>-->
                        <!--</a>-->
                        <!--<ul class="nav-sub">-->
                            <!--<li>-->
                                <!--<a v-link="'/member'">-->
                                    <!--<span class="nav-text">{{$t("nav.member_list")}}</span>-->
                                <!--</a>-->
                            <!--</li>-->
                        <!--</ul>-->
                    <!--</li>-->

                    <!--<li :class="$route.group == 'bill' ? 'active' : ''">-->
                        <!--<a>-->
                            <!--<span class="nav-caret" ><i class="fa fa-caret-down"></i></span>-->
                            <!--<span class="nav-icon" ><i class="material-icons">&#xE227;</i></span>-->
                            <!--<span class="nav-text">{{$t("nav.bills")}}</span>-->
                        <!--</a>-->
                        <!--<ul class="nav-sub">-->
                            <!--<li><a v-link="'/bill/search'"><span class="nav-text">{{$t('bill.transcations_query')}}</span></a></li>-->
                            <!--<li><a v-link="'/bill/commission'"><span class="nav-text">{{$t('bill.commission_report')}}</span></a></li>-->
                        <!--</ul>-->
                    <!--</li>-->

                    <!--<li :class="$route.group == 'report' ? 'active' : ''">-->
                        <!--<a>-->
                            <!--<span class="nav-caret">-->
                              <!--<i class="fa fa-caret-down"></i>-->
                            <!--</span>-->
                            <!--<span class="nav-icon">-->
                              <!--<i class="material-icons">&#xe1b8;</i>-->
                            <!--</span>-->
                            <!--<span class="nav-text">{{$t("nav.report")}}</span>-->
                        <!--</a>-->
                        <!--<ul class="nav-sub">-->
                            <!--<li><a v-link="'/report/betrecord'"><span class="nav-text">{{$t('nav.bet_record')}}</span></a></li>-->
                            <!--<li><a v-link="'/report/transferrecord'"><span class="nav-text">{{$t('nav.transfer_record')}}</span></a></li>-->
                        <!--</ul>-->
                    <!--</li>-->
                <!--</ul>-->
                <!--</nav>-->
            <!--</div>-->
        <!--</div>-->
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
