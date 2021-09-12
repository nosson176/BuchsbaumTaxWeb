<template>
  <div>
    <div v-for="client in clients" :key="client.id">
      {{ client.displayName }}
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { models } from '~/shared/constants'

export default {
  name: 'ClientList',
  computed: {
    ...mapState([models.clients])
  }
}
</script>

<style scoped>

</style>
