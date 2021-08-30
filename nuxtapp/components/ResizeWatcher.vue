<template>
  <div />
</template>

<script>
import debounce from 'lodash/debounce'
import { EVENT_NAME_RESIZE, SET_APP_WIDTH } from '@/shared/constants'

export default {
  name: 'ResizeWatcher',
  computed: {
    debouncedHandleResize () {
      return debounce(this.handleResize, 150)
    }
  },
  beforeDestroy () {
    this.unbindEventListeners()
  },
  mounted () {
    this.initialize()
  },
  methods: {
    initialize () {
      this.$store.commit(SET_APP_WIDTH, window.innerWidth)
      this.bindEventListeners()
    },
    bindEventListeners () {
      window.addEventListener(EVENT_NAME_RESIZE, this.debouncedHandleResize)
    },
    unbindEventListeners () {
      window.removeEventListener(EVENT_NAME_RESIZE, this.debouncedHandleResize)
    },
    handleResize (evt) {
      this.$store.commit(SET_APP_WIDTH, evt.target.innerWidth)
    }
  }
}
</script>
