<template>
  <div class="w-full h-full flex flex-col">
    <ValuesEditorSection v-if="isCurrentUserAdmin" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { models, USER_TYPE_ADMIN } from '~/shared/constants'

export default {
  name: 'Values',
  computed: {
    ...mapState([models.users, models.currentUser]),
    headers() {
      return this.$api.getHeaders()
    },
    isCurrentUserAdmin() {
      return this.currentUser.userType === USER_TYPE_ADMIN
    },
  },
  async mounted() {
    if (!this.currentUser || !Object.keys(this.currentUser).length) {
      await this.$api.getCurrentUser(this.headers)
    }
  }
}
</script>

<style scoped></style>
