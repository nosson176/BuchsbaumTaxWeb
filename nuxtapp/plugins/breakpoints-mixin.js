import Vue from 'vue'
import { models } from '@/shared/constants'

const breakpointsMixin = {
  computed: {
    $media () {
      return {
        mobile: this.$store.getters[models.appWidth] <= 600,
        tablet: this.$store.getters[models.appWidth] > 600 && this.$store.getters[models.appWidth] <= 1260,
        desktop: this.$store.getters[models.appWidth] > 1260
      }
    }
  }
}

Vue.mixin(breakpointsMixin)
