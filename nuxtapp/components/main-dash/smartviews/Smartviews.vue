<template>
  <div class="flex-grow overflow-auto">
    <div
      v-for="smartview in displayedSmartviews"
      :ref="smartview.id"
      :key="smartview.id"
      class="text-gray-500 bg-gray-50 px-1 py-1 text-xs smartview cursor-pointer flex justify-between"
      :class="smartview.id === selectedSmartviewId ? 'selected' : ''"
      @click="selectSmartview(smartview)"
    >
      <span class="font-medium text-gray-900">{{ smartview.name }}</span>
      <span>{{ smartview.clientIds.length }}</span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { models, mutations } from '~/shared/constants'

export default {
  name: 'Smartviews',
  props: {
    showArchived: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      selectedSmartviewId: NaN
    }
  },
  computed: {
    ...mapState([models.smartviews, models.selectedSmartview]),
    displayedSmartviews () {
      return Object.fromEntries(Object.entries(this.smartviews)
        .filter(([key, smartview]) => this.showArchived === smartview.archived
        ))
    }
  },
  methods: {
    selectSmartview (smartview) {
      if (this.selectedSmartviewId === smartview.id) {
        this.selectedSmartviewId = NaN
        this.$store.commit(mutations.setModelResponse, { model: models.selectedSmartview, data: [] })
      } else {
        this.selectedSmartviewId = smartview.id
        this.$store.commit(mutations.setModelResponse, { model: models.selectedSmartview, data: smartview })
      }
    }
  }
}
</script>

<style scoped>
.smartview:nth-child(even) {
  @apply bg-white;
}

.smartview.selected {
  @apply bg-gray-700 text-gray-100;
}

.smartview.selected span {
  @apply text-white;
}
</style>
