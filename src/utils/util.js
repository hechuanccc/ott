import Vue from 'vue'
import VueResource from 'vue-resource'
import urls from '../api'

const STORAGE_KEY = 'data-storage'

Vue.use(VueResource)
export default class $ {

    static fetchMember (cb, successCb, errorCb) {
        return Vue.http.get(urls.member + '?opt_expand=1').then((response) => {
            cb(response.data)
            if (successCb) {
                successCb(response.data)
            }
        }, (response) => {
            if (errorCb) {
                errorCb(response)
            }
        })
    }

    static setIndicator (onActivate, onInactivate) {
        let hidden = 'hidden'

        // Standards:
        if (hidden in document) {
            document.addEventListener('visibilitychange', onchange)
        } else if ((hidden = 'mozHidden') in document) {
            document.addEventListener('mozvisibilitychange', onchange)
        } else if ((hidden = 'webkitHidden') in document) {
            document.addEventListener('webkitvisibilitychange', onchange)
        } else if ((hidden = 'msHidden') in document) {
            document.addEventListener('msvisibilitychange', onchange)
        } else if ('onfocusin' in document) { // IE 9 and lower:
            document.onfocusin = document.onfocusout = onchange
        } else { // All others:
            window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange
        }

        function onchange (evt) {
            let v = 'visible'
            let h = 'hidden'
            let status = ''
            let evtMap = {
                focus: v,
                focusin: v,
                pageshow: v,
                blur: h,
                focusout: h,
                pagehide: h
            }

            evt = evt || window.event
            if (evt.type in evtMap) {
                status = evtMap[evt.type]
            } else {
                status = this[hidden] ? 'hidden' : 'visible'
            }
            if (status === v && onActivate) {
                onActivate()
            } else if (status === h && onInactivate) {
                onInactivate()
            }
        }

        // set the initial state (but only if browser supports the Page Visibility API)
        if (document[hidden] !== undefined) {
            onchange({type: document[hidden] ? 'blur' : 'focus'})
        }
    }

    static handleError (response, field, fields) {
        let errors = response.data.error
        let responseError = ''
        let gettype = Object.prototype.toString

        let utility = {
            isObj: function (o) {
                return gettype.call(o) === '[object Object]'
            }
        }

        if (Array.isArray(errors)) {
            for (let item in errors) {
                if (errors[item].hasOwnProperty(field)) {
                    responseError += fields[field] + errors[item][field]
                    return responseError
                }
            }
        } else if (utility.isObj(errors)) {
            for (let item in errors.error) {
                if (item === field) {
                    responseError += fields[field] + errors.error[item]
                    return responseError
                }
            }
        }
        return ''
    }

    static storage = {
        fetch () {
            return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
        },
        save (items) {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
        }
    }

    static formatError (list) {
        let result = []
        for (let i = 0; i < list.length; i++) {
            let error = list[i]
            let errorKey = Object.keys(error)[0]
            result.push(error[errorKey])
        }
        return result.join(', ')
    }

    static isJsonString (str) {
        try {
            var o = JSON.parse(str)
            if (o && typeof o === 'object') {
                return o
            }
        } catch (e) {
            return false
        }
    }
}
