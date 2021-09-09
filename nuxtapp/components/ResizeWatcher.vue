<template>
  <div />
</template>

<script>
import debounce from 'lodash/debounce'
import { models, setModelResponse, events } from '~/shared/constants'

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
      this.$store.commit(setModelResponse, { model: models.notifier, data: window.innerWidth })
      this.bindEventListeners()
    },
    bindEventListeners () {
      window.addEventListener(events.resize, this.debouncedHandleResize)
    },
    unbindEventListeners () {
      window.removeEventListener(events.resize, this.debouncedHandleResize)
    },
    handleResize (evt) {
      this.$store.commit(setModelResponse, { model: models.notifier, data: evt.target.innerWidth })
    }
  }
}
</script>
