<template>
  <SubmitCard :disabled="!isPasswordValid" @hide="emitHide" @submit="submitPasswordChange">
    <div class="w-full space-y-2">
      <span class="font-semibold">Change {{ user.username }}'s Password</span>
      <FormInput ref="input" v-model="newPassword" />
      <FormInput ref="input" v-model="confirmPassword" />
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
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      newPassword: '',
      confirmPassword: '',
    }
  },
  computed: {
    ...mapState([models.users]),
    user() {
      return Object.values(this.users).find((user) => user.id === this.userId)
    },
    isPasswordValid() {
      return this.newPassword === this.confirmPassword && this.newPassword.length > 6
    },
  },
  mounted() {
    this.$refs.input.$refs.input.focus()
  },
  methods: {
    emitHide() {
      this.$emit(events.hide)
    },
    submitPasswordChange() {},
  },
}
</script>

<style scoped></style>
