import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const state = {
    user: {
        level: {}
    }
}

const mutations = {
    FETCH_MEMBER (state, member) {
        state.user = member[0]
    },
    CLEAR_MEMBER (state) {
        state.user = {}
    }
}

console.log('actions')
console.log(actions)

export default new Vuex.Store({
    state,
    mutations,
    actions,
    strict: debug
})
