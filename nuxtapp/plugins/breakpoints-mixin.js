import Vue from 'vue'
import { GET_IS_SCREEN_SIZE_DESKTOP, GET_IS_SCREEN_SIZE_MOBILE, GET_IS_SCREEN_SIZE_TABLET } from '@/shared/constants'

const breakpointsMixin = {
  computed: {
    $media () {
      return {
        mobile: this.$store.getters[GET_IS_SCREEN_SIZE_MOBILE],
        tablet: this.$store.getters[GET_IS_SCREEN_SIZE_TABLET],
        desktop: this.$store.getters[GET_IS_SCREEN_SIZE_DESKTOP]
      }
    }
  }
}

Vue.mixin(breakpointsMixin)
