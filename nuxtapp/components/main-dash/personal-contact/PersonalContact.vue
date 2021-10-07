<template>
  <div />
</template>

<script>
import { mapState } from 'vuex'
import { models } from '~/shared/constants'

export default {
  name: 'PersonalContact',
  computed: {
    ...mapState([models.selectedClient])
  },
  created () {
    console.log(this.selectedClient)
  }
}
</script>

<style scoped>

</style>
