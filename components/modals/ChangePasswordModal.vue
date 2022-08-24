<template>
  <SubmitCard :loading="loading" :disabled="!isPasswordValid" @hide="emitHide" @submit="submitPasswordChange">
    <div class="w-full space-y-2">
      <span class="font-semibold">Change {{ user.username }}'s Password</span>
      <FormInput ref="input" v-model="newPassword" />
      <FormInput v-model="confirmPassword" />
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
      const password = this.newPassword
      await this.$api.updatePassword(headers, { userId }, { password })
      this.loading = false
    },
  },
}
</script>

<style scoped></style>
