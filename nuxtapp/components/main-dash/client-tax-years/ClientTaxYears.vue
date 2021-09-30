<template>
  <div />
</template>

<script>
import { mapState } from 'vuex'
import { models } from '~/shared/constants'

export default {
  name: 'ClientTaxYears',
  computed: {
    ...mapState([models.selectedClient])
  }
}
</script>

<style scoped>

</style>
