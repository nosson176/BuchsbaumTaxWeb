<template>
  <iframe
    width="100%"
    height="100vh"
    onload="this.height=screen.height;"
    style="border: 0"
    loading="lazy"
    allowfullscreen
    :src="mapSrc"
  ></iframe>
</template>

<script>
import { mapState } from 'vuex'
import { models } from '~/shared/constants'

export default {
  name: 'MapView',
  data() {
    return {}
  },
  computed: {
    ...mapState([models.selectedContact]),
    mapSrc() {
      let location = 'Jerusalem'
      if (this.selectedContact.mainDetail) {
        location = `${this.selectedContact.mainDetail} ${this.selectedContact.secondaryDetail}`
      }
      const query = encodeURIComponent(location)
      return `https://www.google.com/maps/embed/v1/place?q=${query}&key=${process.env.GOOGLE_API_KEY}`
    },
  },

  mounted() {},

  methods: {},
}
</script>

<style scoped></style>
