<template>
<div>
    <div class="m-l m-r m-t alert alert-danger" v-if="error">{{error}}</div>
    <div class="box" v-if="queryset.length > 0">
        <table st-table="rowCollectionBasic" class="table table-striped b-t v-m">
            <thead>
                <tr>
                    <th width="15%" class="text-center">{{ $t('global_parameters.name') }}</th>
                    <th>{{ $t('global_parameters.value') }}</th>
                    <th
                        width="7%"
                        class="text-center"
                    >{{ $t('global_parameters.operating') }}
                    </th>
                </tr>
            </thead>
            <tbody v-if="!loading">
                <tr
                    v-for="(preference, index) in queryset"
                    :key="index"
                    class="align-middle"
                >
                    <td class="text-center align-middle">{{ preference.display_name }}</td>
                    <td class="text-break-all">
                        <div v-if="preference.type === 1 && typeof preference.value === 'object'">
                            <span
                                v-for="(e, i) in preference.value"
                                :key="e.key"
                                class="m-b-0"
                            >
                                <span>{{ `${!i ? '' : ' , '}${e.display_name}: ` }}</span>
                                <span
                                    :class="e.value == 1 ? 'success' : 'danger'"
                                    class="label"
                                    v-if="e.type === 2"
                                >
                                    {{ e.value ? $t('status.active') : $t('status.inactive') }}
                                </span>
                                <span v-else>{{ e.value }}</span>
                            </span>
                        </div>
                        <span
                            :class="preference.value ? 'success' : 'danger'"
                            class="label m-r-sm"
                            v-else-if="preference.type === 3"
                        >
                            {{ preference.value ? $t('status.active') : $t('status.inactive') }}
                        </span>
                        <span v-else>{{ preference.value }}</span>
                        <label
                            class="md-switch m-r m-t-xs"
                            v-if="preference.type === 3"
                        >
                            <input
                                type="checkbox"
                                v-model="preference.value"
                                @change="updatePreference(Object.assign({}, preference, {
                                    displayName: preference.display_name,
                                    index
                                }))"
                            />
                            <i class="success"></i>
                        </label>
                    </td>
                    <td class="text-center align-middle">
                        <a @click="openModal(index, preference)" v-if="preference.type !== 3">{{ $t('action.update') }}</a>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="row" v-if="loading">
            <div class="text-center m-a">
                <i class="fa fa-spin fa-spinner"></i>
                <b>{{ $t('common.loading') }}</b>
            </div>
        </div>
        <div class="row" v-if="!loading && !queryset.length">
            <div class="text-center m-a">
                <span>{{ $t('common.no_record') }}</span>
            </div>
        </div>
    </div>
    <div class="modal" v-if="modal.showModal">
        <div class="modal-backdrop fade in" @click="modal.showModal = false"></div>
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <strong>{{ $t('action.update') }} - {{ modal.displayName }}</strong>
                    <button type="button" class="close" aria-hidden="true" @click="modal.showModal = false">×</button>
                </div>
                <div class="modal-body">
                    <form class="m-l m-r" @submit.prevent="updatePreference(modal)">
                        <div v-if="modal.type === 1 && typeof modal.value === 'object'">
                            <label
                                class="form-control-label p-b-0"
                            >{{ $t('global_parameters.value') }}
                            </label>
                            <div class="row m-t-xs" v-for="(e, index) in modal.value" :key="index">
                                <div class="col-sm-4 col-sm-offset-1 text-right">
                                    <label class="form-control-label p-r-0 text-xs">{{ e.display_name }}</label>
                                </div>
                                <div class="col-sm-5">
                                    <input
                                        class="form-control"
                                        v-model.trim="e.value"
                                        v-if="e.type !== 2"
                                    />
                                    <span
                                        class="label m-r-sm"
                                        :class="e.value ? 'success' : 'danger'"
                                        v-else-if="e.type === 2"
                                    >{{ e.value ? $t('status.active') : $t('status.inactive') }}
                                    </span>
                                    <label class="md-switch m-r m-t-xs" v-if="e.type === 2">
                                        <input type="checkbox" v-model="e.value"/>
                                        <i class="success"></i>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <label class="form-control-label p-b-0" >
                                {{ $t('global_parameters.value') }}
                            </label>
                            <textarea
                                v-model.trim="modal.value"
                                rows="8"
                                spellcheck="false"
                                class="form-control"
                                ref="modalContent"
                                v-if="modal.type === 6"
                            />
                            <input
                                v-model.trim="modal.value"
                                spellcheck="false"
                                class="form-control"
                                ref="modalContent"
                                v-else
                            />
                        </div>
                    </form>
                    <div class="m-l m-r m-t alert alert-danger" v-if="modal.error">{{modal.error}}</div>
                </div>
                <div class="modal-footer">
                    <button class="btn blue w-xs" @click="updatePreference(modal)">
                        <span v-if="!modal.loading">
                        {{ $t('common.confirmreturn') }}
                    </span>
                        <i class="fa fa-spin fa-spinner" v-else></i>
                    </button>
                    <button class="btn w-xs" @click="modal.showModal = false">
                        {{ $t('common.cancelreturn') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import api from '../../api'
import $ from '../../utils/util'
/*
TYPE_STR = 1
TYPE_IMAGE = 2
TYPE_BOOLEAN = 3
TYPE_INT = 4
TYPE_FLOAT = 5
TYPE_TEXT = 6
*/
export default {
    data () {
        return {
            queryset: [],
            modal: {
                showModal: false,
                index: '',
                key: '',
                value: '',
                loading: false,
                error: ''
            },
            error: '',
            loading: true
        }
    },
    created () {
        this.getPreference()
    },
    methods: {
        getPreference () {
            this.$http.get(`${api.global_preferences}`).then(response => {
                this.queryset = response.data
                this.queryset.forEach(e => {
                    this.typeTransform(e)
                })
                this.loading = false
            }, response => {
                this.error = Object.values(response.data.error[0]).toString()
                this.loading = false
            })
        },
        typeTransform (e) {
            if (e.type === 3) {
                Object.assign(e, {
                    value: e.value === 'True' || e.value === 'true'
                })
            }
            if ($.isJsonString(e.value)) {
                Object.assign(e, {
                    value: JSON.parse(e.value)
                })
                e.value.forEach(element => {
                    element.value = element.type === 2 ? parseInt(element.value) : element.value
                })
            }
        },
        openModal (index, {
            display_name: displayName,
            key,
            value,
            type,
            error
        }) {
            Object.assign(this.modal, {
                showModal: true,
                displayName,
                key,
                value,
                type,
                index,
                loading: false,
                error
            })
            if (type === 1 && typeof value === 'object') {
                this.modal.value = this.modal.value.map(e => Object.assign({}, e))
            } else {
                this.$nextTick(() => {
                    this.$refs.modalContent.focus()
                    this.$refs.modalContent.select()
                })
            }
        },
        updatePreference ({
            index,
            key,
            value,
            displayName: display_name,
            type
        }) {
            this.modal.loading = true
            let result = {
                display_name,
                value: ''
            }
            if (type === 1 && typeof value === 'object') {
                result.value = JSON.stringify(Object.assign({}, ...value.map(e => ({
                    [e.key]: e.type === 2
                    ? (e.value ? '1' : '0')
                    : e.value
                }))))
            } else if (type === 3) {
                result.value = value ? 'true' : 'false'
            } else {
                result.value = value
            }
            this.$http.patch(`${api.global_preferences}${key}/`, result).then(response => {
                this.typeTransform(response.data)
                Object.assign(this.queryset[index], response.data)
                this.modal.showModal = false
                this.modal.loading = false
            }, response => {
                this.modal.error = Object.values(response.data.error[0]).toString()
                this.modal.loading = false
            })
        }
    }
}
</script>
<style scoped>
.align-middle td{
  vertical-align: middle;
}

.modal-body {
  overflow-y: auto;
  max-height: 60vh;
}

.modal-backdrop, .modal{z-index: 1}
    .modal-dialog{z-index: 10;top: 10%}
        .modal{display: block;}
</style>
