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

// Move this outside the component to keep it as a template
const createNewSmartview = () => ({
  name: '',
  sortNumber: 1,
  archived: false,
  smartviewLines: [],
  // Add a temporary ID to prevent null reference errors
})

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
    selectedSmView() {
      return this.selectedSmartview || []
    },
    isSmartViewSelected() {
      return this.selectedSmView.length !== 0
    }
  },
  methods: {
    emitChange(value) {
      this.showActive = value
      this.$emit(events.change)
    },
    addSmartview() {
      // Create a new smartview object each time
      const smartview = createNewSmartview()

      // Set the initial sort number based on existing smartviews
      if (this.smartviews && Object.keys(this.smartviews).length > 0) {
        const maxSortNumber = Math.max(
          ...Object.values(this.smartviews).map(sv => sv.sortNumber || 0)
        )
        smartview.sortNumber = maxSortNumber + 1
      }

      this.$store.commit(mutations.setModelResponse, {
        model: models.modals,
        data: { smartview: { showing: true, data: smartview } },
      })
    },
    copySmartView() {
      if (!this.selectedSmView) return
      const smartviewCopy = {
        ...this.selectedSmView,
        name: `${this.selectedSmView.name} (copy)`,
        id: Math.floor(Math.random() * 100) + 1, // Temporary ID for the copy
        sortNumber: this.selectedSmView.sortNumber + 1
      }

      this.$api.createSmartview(this.headers, { smartview: smartviewCopy })
        .then((res) => {
          // this.$store.commit(mutations.setModelResponse, {
          //   model: models.modals,
          //   data: { smartview: { showing: true, data: res } },
          // })
          this.$store.commit('pushNewSmartview', res)
        })
        .catch((error) => {
          console.error('Error copying smartview:', error)
          this.$toast.error('Error copying smartview')
        })
    }
  },
}
</script>

<style scoped></style>