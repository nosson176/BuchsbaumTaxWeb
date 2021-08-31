<template>
  <div class="w-full" :class="notificationBackground">
    <div>
      <div class="flex justify-between">
        <div class="flex items-center">
          <div class="h-5 w-5 m-5 ml-8 text-indigo-900">
            <NotificationAlertIcon v-if="isNotificationTypeAlert" />
          </div>
          <span class="text-size-12-px text-indigo-900">
            <slot />
          </span>
        </div>
        <button class="focus:outline-none" @click="closeSelf">
          <CloseIcon class="w-5 h-5 m-5 mr-8 text-indigo-900" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  A_CLIENT_RESET_NOTIFICATION,
  NOTIFICATION_TYPE_ALERT
} from '~/shared/constants'

export default {
  name: 'NotificationView',
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  computed: {
    isNotificationTypeAlert () {
      return this.type === NOTIFICATION_TYPE_ALERT
    },
    notificationBackground () {
      if (this.isNotificationTypeAlert) {
        return ['bg-red-100']
      } else {
        return ['bg-indigo-100']
      }
    }
  },
  methods: {
    closeSelf () {
      this.$store.dispatch(A_CLIENT_RESET_NOTIFICATION)
    }
  }
}
</script>

<style scoped>
</style>
