<template>
  <SubmitCard :loading="loading" :disabled="!isUserValid" @hide="emitHide" @submit="submitCreateUser">
    <div class="w-full space-y-4">
      <span class="font-semibold">Create User</span>
      <FormInput ref="input" v-model="formModel.username" placeholder="USERNAME" required />

      <div class="grid grid-cols-1 sm:grid-cols-2 sm:gap-4">
        <FormInput v-model="formModel.firstName" placeholder="FIRST NAME" />
        <FormInput v-model="formModel.lastName" placeholder="LAST NAME" />
      </div>
      <FormInput v-model="formModel.email" placeholder="EMAIL" required type="email" />
      <div class="grid grid-cols-1 sm:grid-cols-2 sm:gap-4">
        <div class="flex flex-col space-y-0.5">
          <FormInput v-model="formModel.password" placeholder="PASSWORD" type="password" required />
          <div v-if="showPasswordError" class="text-xs text-red-700">Must be lomger than 6 chars</div>
        </div>
        <div class="flex flex-col space-y-0.5">
          <FormInput v-model="confirmPassword" placeholder="CONFIRM PASSWORD" type="password" required />
          <div v-if="showConfirmPasswordError" class="text-xs text-red-700">Must match the password</div>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 sm:gap-4">
        <div @click="setEditable('type')">
          <HeaderSelectOption v-model="formModel.userType" :options="userTypes" large
            :is-editable="isEditable('type')" />
        </div>
        <FormInput v-model="formModel.secondsInDay" placeholder="Seconds in Day" />
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 sm:gap-4">
        <div class="flex space-x-1 items-center">
          <EditableCheckBoxCell v-model="formModel.selectable" />
          <div class="text-xs font-bold text-gray-500">SELECTABLE</div>
        </div>
        <div class="flex space-x-1 items-center">
          <EditableCheckBoxCell v-model="formModel.allowTexting" />
          <div class="text-xs font-bold text-gray-500">ALLOW TEXTING</div>
        </div>
        <div class="flex space-x-1 items-center">
          <EditableCheckBoxCell v-model="formModel.notifyOfLogins" />
          <div class="text-xs font-bold text-gray-500">NOTIFY OF LOGINS</div>
        </div>
        <div class="flex space-x-1 items-center">
          <EditableCheckBoxCell v-model="formModel.sendLoginNotifications" />
          <div class="text-xs font-bold text-gray-500">SEND LOGIN/OUT TEXTS</div>
        </div>
      </div>
    </div>
  </SubmitCard>
</template>

<script>
import { events, userTypes } from '~/shared/constants'
import { userConstructor } from '~/shared/domain-utilities'

export default {
  name: 'CreateNewUserModal',

  data() {
    return {
      loading: false,
      formModel: null,
      confirmPassword: '',
      editable: '',
    }
  },
  computed: {
    isUserValid() {
      return this.formModel.username !== '' && this.isPasswordValid()
    },
    userTypes() {
      return userTypes
    },
    headers() {
      return this.$api.getHeaders()
    },
    doesConfirmMatch() {
      return this.formModel.password === this.confirmPassword
    },
    showConfirmPasswordError() {
      return this.confirmPassword.length >= 1 && !this.doesConfirmMatch
    },
    showPasswordError() {
      return this.formModel.password.length >= 1 && this.formModel.password.length < 6
    },
    isEmailValid() {
      // Simple email format validation
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
      return emailPattern.test(this.formModel.email)
    },
  },
  beforeMount() {
    this.formModel = userConstructor()
  },
  mounted() {
    this.$refs.input.$refs.input.focus()
  },
  methods: {
    submitCreateUser() {
      this.$api.createUser(this.headers, { user: this.formModel }).then((user) => {
        this.$store.commit('pushNewUser', user)
        this.emitHide(user.id)
      })
    },
    emitHide(id = null) {
      return this.$emit(events.hide, id)
    },
    setEditable(field) {
      this.editable = field
    },
    isEditable(field) {
      return this.editable === field
    },
    isPasswordValid() {
      return this.formModel.password.length >= 6 && this.doesConfirmMatch
    },
  },
}
</script>

<style scoped></style>
