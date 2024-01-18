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
    isCurrentUserAdmin() {
      return this.currentUser.userType === USER_TYPE_ADMIN
    },
  },
}
</script>

<style scoped></style>
