<template>
  <div class="flex justify-center">
    <NotificationView v-if="showNotification" :type="type">
      <span>{{ message }}</span>
    </NotificationView>
  </div>
</template>

<script>
import { models } from '~/shared/constants'
export default {
  name: 'Notifier',
  data () {
    return {
      showNotification: false
    }
  },
  computed: {
    // notification () {
    //   return this[models.toast].currentNotification
    // },
    message () {
      return this.notification.message
    },
    type () {
      return this.notification.type
    }
    // currentNotification () {
    //   return this[models.toast].currentNotification
    // }
  },
  watch: {
    currentNotification () {
      this.onNotificationChange()
    }
  },
  methods: {
    onNotificationChange () {
      if (this.currentNotification !== null) {
        this.updateNotification(this.currentNotification)
      } else {
        this.showNotification = false
      }
    },
    updateNotification (notification) {
      this.showNotification = true
      setTimeout(this.resetNotification, notification.time)
    },
    resetNotification () {
      this.$store.commit('setModelResponse', { model: models.notifier, data: null })
      this.showNotification = false
    }
  }
}
</script>

<style scoped>

</style>
