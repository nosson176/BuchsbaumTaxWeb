<template>
  <div class="flex bg-blue-200 px-1 justify-between items-center shadow">
    <AddRowButton @click="addSmartview" />
    <ViewArchivedHeader :view-active="showActive" @change="emitChange" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { events, models, mutations } from '~/shared/constants'

const smartviewConstructor = {
  name: '',
  sortNumber: 1,
  archived: false,
  smartviewLines: [],
}

export default {
  name: 'SmartviewsHeader',
  data() {
    return {
      showActive: true,
    }
  },
  computed: {
    ...mapState([models.smartviews]),
    headers() {
      return this.$api.getHeaders()
    },
  },
  methods: {
    emitChange(value) {
      this.showActive = value
      this.$emit(events.change)
    },
    addSmartview() {
      const smartview = smartviewConstructor
      this.$store.commit(mutations.setModelResponse, {
        model: models.modals,
        data: { smartview: { showing: true, data: smartview } },
      })
    },
  },
}
</script>

<style scoped></style>
