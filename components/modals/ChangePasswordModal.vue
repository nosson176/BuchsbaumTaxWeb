<template>
  <SubmitCard :loading="loading" :disabled="!isPasswordValid" @hide="emitHide" @submit="submitPasswordChange">
    <div class="w-full space-y-2">
      <span class="font-semibold">Change {{ user.username }}'s Password</span>
      <div class="flex flex-col space-y-0.5">
        <FormInput id="password" ref="input" v-model="newPassword" placeholder="Password" type="password" required />
        <div v-if="showPasswordError" class="text-xs text-red-700">Must be lomger than 6 chars</div>
      </div>
      <div class="flex flex-col space-y-0.5">
        <FormInput id="confirm" v-model="confirmPassword" placeholder="Confirm Password" type="password" required />
        <div v-if="showConfirmPasswordError" class="text-xs text-red-700">Must match the password</div>
      </div>
    </div>
  </SubmitCard>
</template>

<script>
import { mapState } from 'vuex'
import { events, models } from '~/shared/constants'

export default {
  name: 'ChangePasswordModal',
  props: {
    userId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      newPassword: '',
      confirmPassword: '',
      loading: false,
    }
  },
  computed: {
    ...mapState([models.users]),
    user() {
      return Object.values(this.users).find((user) => user.id === this.userId)
    },
    isPasswordValid() {
      return this.newPassword === this.confirmPassword && this.newPassword.length >= 6
    },
    doesConfirmMatch() {
      return this.newPassword === this.confirmPassword
    },
    showConfirmPasswordError() {
      return this.confirmPassword.length >= 1 && !this.doesConfirmMatch
    },
    showPasswordError() {
      return this.newPassword.length >= 1 && this.newPassword.length < 6
    },
  },
  mounted() {
    this.$refs.input.$refs.input.focus()
  },
  methods: {
    emitHide() {
      this.$emit(events.hide)
    },
    async submitPasswordChange() {
      this.loading = true
      const headers = this.$api.getHeaders()
      const userId = this.userId
      const newPassword = this.newPassword
      await this.$api
        .updatePassword(headers, { userId }, { newPassword })
        .then(() => this.$toast.success(`${this.user.username}'s password changed successfully`))
      this.emitHide()
      this.loading = false
    },
  },
}
</script>

<style scoped></style>
