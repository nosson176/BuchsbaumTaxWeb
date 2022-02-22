<template>
  <div />
</template>

<script>
import debounce from 'lodash/debounce'
import { models, mutations, events } from '~/shared/constants'

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
      this.$store.commit(mutations.setModelResponse, { model: models.appWidth, data: window.innerWidth })
      this.bindEventListeners()
    },
    bindEventListeners () {
      window.addEventListener(events.resize, this.debouncedHandleResize)
    },
    unbindEventListeners () {
      window.removeEventListener(events.resize, this.debouncedHandleResize)
    },
    handleResize (evt) {
      this.$store.commit(mutations.setModelResponse, { model: models.appWidth, data: evt.target.innerWidth })
    }
  }
}
</script>
