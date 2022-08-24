<template>
  <section aria-labelledby="user-information-title">
    <form class="bg-white" @submit.prevent="updateUser">
      <div class="flex px-4 py-5 bg-gray-50 sm:px-6 justify-between">
        <input
          id="user-information-title"
          v-model="userObj.username"
          class="text-lg leading-6 font-medium text-gray-900 bg-gray-50"
          @blur="onBlur"
        />
        <button
          type="button"
          class="bg-white text-indigo-600 border border-indigo-600 rounded-md text-sm px-3 py-2 hover:bg-indigo-600 hover:text-white"
          @click="emitClick"
        >
          Change Password
        </button>
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
        <div class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div class="sm:col-span-1"></div>
          <div class="sm:col-span-1">
            <button
              :disabled="loading"
              type="submit"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LoadingIndicator v-if="loading" class="px-4 cursor-not-allowed h-5 w-5 text-white" />
              <span v-else>Submit</span>
            </button>
          </div>
        </div>
      </div>
    </form>
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
  data() {
    return {
      loading: false,
    }
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
      },
    },
    selectable: {
      get() {
        return this.userObj.selectable
      },
      set(newVal) {
        this.userObj.selectable = newVal
      },
    },
    allowTexting: {
      get() {
        return this.userObj.allowTextin
      },
      set(newVal) {
        this.userObj.allowTextin = newVal
      },
    },
    notifyOfLogins: {
      get() {
        return this.userObj.notifyOfLogins
      },
      set(newVal) {
        this.userObj.notifyOfLogins = newVal
      },
    },
    userTypes() {
      return userTypes
    },
    isTypeEditable() {
      return this.editable === 'type'
    },
    headers() {
      return this.$api.getHeaders()
    },
  },
  created() {
    this.userObj = { ...this.user }
  },
  methods: {
    updateUserObj(newVal) {
      this.userObj = Object.assign({}, this.user, newVal)
    },
    setEditable(field) {
      this.editable = field
    },
    onBlur() {
      this.setEditable('')
    },
    isEditable(field) {
      return this.editable === field
    },
    async updateUser() {
      this.loading = true
      await this.$api.updateUser(this.headers, { userId: this.user.id }, this.userObj)
      this.loading = false
    },
    emitChange() {
      this.$emit(events.change, this.userObj)
    },
    emitClick() {
      this.$emit(events.click, this.userObj)
    },
  },
}
</script>

<style scoped></style>
