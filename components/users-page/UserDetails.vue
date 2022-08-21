<template>
  <section aria-labelledby="user-information-title">
    <div class="bg-white">
      <div class="px-4 py-5 bg-gray-50 sm:px-6">
        <input
          id="user-information-title"
          v-model="userObj.username"
          class="text-lg leading-6 font-medium text-gray-900 bg-gray-50"
          @blur="onBlur"
        />
      </div>
      <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
        <div class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div class="sm:col-span-1">
            <div class="text-sm font-medium text-gray-500">First Name</div>
            <div class="mt-1 text-sm text-gray-900">
              <input v-model="userObj.firstName" @blur="onBlur" />
            </div>
          </div>
          <div class="sm:col-span-1">
            <div class="text-sm font-medium text-gray-500">Last Name</div>
            <div class="mt-1 text-sm text-gray-900">
              <input v-model="userObj.lastName" @blur="onBlur" />
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div class="sm:col-span-1">
            <div class="text-sm font-medium text-gray-500">Privelage Set</div>
            <div class="mt-1 text-sm text-gray-900">
              <div @click="setEditable('type')">
                <HeaderSelectOption v-model="userType" :options="userTypes" :is-editable="isEditable('type')" />
              </div>
            </div>
          </div>
          <div class="sm:col-span-1">
            <div class="text-sm font-medium text-gray-500">Seconds in Day</div>
            <div class="mt-1 text-sm text-gray-900">
              <input v-model="userObj.secondsInDay" @blur="onBlur" />
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div class="sm:col-span-1">
            <div class="text-sm font-medium text-gray-500">Selectable</div>
            <div class="mt-1 text-sm text-gray-900">
              <EditableCheckBoxCell v-model="selectable" />
            </div>
          </div>
          <div class="sm:col-span-1">
            <div class="text-sm font-medium text-gray-500">Allow Texting</div>
            <div class="mt-1 text-sm text-gray-900">
              <EditableCheckBoxCell v-model="allowTexting" />
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div class="sm:col-span-1">
            <div class="text-sm font-medium text-gray-500">Notify of Logins</div>
            <div class="mt-1 text-sm text-gray-900">
              <EditableCheckBoxCell v-model="notifyOfLogins" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { events, userTypes } from '~/shared/constants'

export default {
  name: 'UserDetails',
  props: {
    user: {
      type: Object,
      default: () => null,
    },
  },
  computed: {
    data() {
      return {
        editable: '',
        userObj: null,
      }
    },
    userType: {
      get() {
        return this.userObj.userType
      },
      set(newVal) {
        this.userObj.userType = newVal
        this.emitChange()
      },
    },
    selectable: {
      get() {
        return this.userObj.selectable
      },
      set(newVal) {
        this.userObj.selectable = newVal
        this.emitChange()
      },
    },
    allowTexting: {
      get() {
        return this.userObj.allowTextin
      },
      set(newVal) {
        this.userObj.allowTextin = newVal
        this.emitChange()
      },
    },
    notifyOfLogins: {
      get() {
        return this.userObj.notifyOfLogins
      },
      set(newVal) {
        this.userObj.notifyOfLogins = newVal
        this.emitChange()
      },
    },
    userTypes() {
      return userTypes
    },
    isTypeEditable() {
      return this.editable === 'type'
    },
  },
  created() {
    this.userObj = { ...this.user }
  },
  methods: {
    updateUser(newVal) {
      this.userObj = Object.assign({}, this.user, newVal)
    },
    setEditable(field) {
      this.editable = field
    },
    onBlur() {
      this.setEditable('')
      this.emitChange()
    },
    isEditable(field) {
      return this.editable === field
    },
    emitChange() {
      this.$emit(events.change, this.userObj)
    },
  },
}
</script>

<style scoped></style>
