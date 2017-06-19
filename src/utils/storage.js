/**
 * Created by lisa on 2017/3/29.
 */
const STORAGE_KEY = 'data-storage'
export default {
    fetch () {
        return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
    },
    save (items) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    }
}
