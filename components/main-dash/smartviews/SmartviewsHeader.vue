<template>
  <div class="flex bg-blue-200 px-1 justify-between items-center shadow">
    <AddRowButton @click="addSmartview" />
    <div v-if="isSmartViewSelected" class="text-sm font-bold underline italic cursor-pointer" @click="copySmartView">
      copy
    </div>
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
    ...mapState([models.smartviews, models.selectedSmartview]),
    headers() {
      return this.$api.getHeaders()
    },
    selectedSmView(){
      return this.selectedSmartview
    },
    isSmartViewSelected(){
      return this.selectedSmView.length !== 0
    }
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
    copySmartView(){
      const smartview = this.selectedSmView
      this.$api.createSmartview(this.headers, { smartview }).then((res) => {
        this.$store.commit(mutations.setModelResponse, {
          model: models.modals,
          data: { smartview: { showing: true, data: res } },
        })
      })
    }
  },
}
</script>

<style scoped></style>
