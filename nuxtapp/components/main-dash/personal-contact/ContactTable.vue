<template>
  <div>
    {{ selectedClient.contact }}
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { models } from '~/shared/constants'

export default {
  name: 'ContactTable',
  computed: {
    ...mapState([models.selectedClient])
  }
}
</script>

<style scoped>

</style>
