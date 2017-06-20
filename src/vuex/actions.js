import $ from '../utils/util'
console.log($.storage.fetch)

export const fetchMember = (context, { successCb, errorCb }) => {
    $.fetchMember((member) => {
        context.commit('FETCH_MEMBER', member)
    }, successCb, errorCb)
}
