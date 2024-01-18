<template>
  <section aria-labelledby="user-information-title" class="rounded-md shadow">
    <form class="bg-white" @submit.prevent="updateUser">
      <div class="flex px-4 py-5 bg-gray-50 sm:px-6 justify-between">
        <div id="user-information-title" class="text-lg leading-6 font-medium text-gray-900 bg-gray-50">
          {{ userObj.username }}
        </div>
        <button
          type="button"
          class="bg-white text-indigo-600 border border-indigo-600 rounded-md text-sm px-3 py-2 hover:bg-indigo-600 hover:text-white"
          @click="emitClick"
        >
          Change Password
        </button>
      </div>
      <div class="border-t border-gray-200 px-4 py-5 space-y-4 sm:px-6">
        <div class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div class="sm:col-span-1">
            <div class="text-xs font-bold text-gray-500">USERNAME</div>
            <div class="mt-1 text-sm text-gray-900">
              <FormInput ref="username" v-model="userObj.username" />
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div class="sm:col-span-1">
            <div class="text-xs font-bold text-gray-500">FIRST NAME</div>
            <div class="mt-1 text-sm text-gray-900">
              <FormInput v-model="userObj.firstName" />
            </div>
          </div>
          <div class="sm:col-span-1">
            <div class="text-xs font-bold text-gray-500">LAST NAME</div>
            <div class="mt-1 text-sm text-gray-900">
              <FormInput v-model="userObj.lastName" />
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <div class="sm:col-span-1">
            <div class="text-xs font-bold text-gray-500">PRIVILEGE SET</div>
            <div class="mt-1 text-sm text-gray-900">
              <HeaderSelectOption v-model="userType" large :options="userTypes" />
            </div>
          </div>
          <div class="sm:col-span-1">
            <div class="text-xs font-bold text-gray-500">SECONDS IN DAY</div>
            <div class="mt-1 text-sm text-gray-900">
              <FormInput v-model="userObj.secondsInDay" />
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div class="sm:col-span-1">
            <div class="text-xs font-bold text-gray-500">SELECTABLE</div>
            <div class="mt-1 text-sm text-gray-900">
              <EditableCheckBoxCell v-model="selectable" />
            </div>
          </div>
          <div class="sm:col-span-1">
            <div class="text-xs font-bold text-gray-500">ALLOW TEXTING</div>
            <div class="mt-1 text-sm text-gray-900">
              <EditableCheckBoxCell v-model="allowTexting" />
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div class="sm:col-span-1">
            <div class="text-xs font-bold text-gray-500">NOTIFY OF LOGINS</div>
            <div class="mt-1 text-sm text-gray-900">
              <EditableCheckBoxCell v-model="notifyOfLogins" />
            </div>
          </div>
          <div class="sm:col-span-1">
            <div class="text-xs font-bold text-gray-500">SEND LOGIN/OUT TEXTS</div>
            <div class="mt-1 text-sm text-gray-900">
              <EditableCheckBoxCell v-model="sendLoginNotifications" />
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div class="sm:col-span-1">
            <div class="text-xs font-bold text-gray-500">PHONE NUMBER</div>
            <div class="mt-1 text-sm text-gray-900">
              <FormInput v-model="userObj.phoneNumber" />
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
import { userConstructor } from '~/shared/domain-utilities'

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
      userObj: userConstructor(),
    }
  },
  computed: {
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
        return this.userObj.allowTexting
      },
      set(newVal) {
        this.userObj.allowTexting = newVal
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
    sendLoginNotifications: {
      get() {
        return this.userObj.sendLoginNotifications
      },
      set(newVal) {
        this.userObj.sendLoginNotifications = newVal
      },
    },
    userTypes() {
      return userTypes
    },
    headers() {
      return this.$api.getHeaders()
    },
  },
  mounted() {
    this.$refs.username.$refs.input.focus()
  },
  created() {
    this.userObj = JSON.parse(JSON.stringify(this.user))
  },
  methods: {
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
