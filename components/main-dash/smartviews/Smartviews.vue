<template>
  <div class="flex-grow overflow-auto">
    <div
      v-for="smartview in displayedSmartviews"
      :ref="smartview.id"
      :key="smartview.id"
      class="text-gray-500 bg-gray-50 px-1 py-1 text-xs smartview cursor-pointer flex justify-between items-center hover:text-white hover:bg-gray-400"
      :class="smartview.id === selectedSmartviewId ? 'selected' : ''"
      @click="selectSmartview(smartview)"
    >
      <div class="flex items-center space-x-2">
        <PenIcon class="h-3 w-3" @click="showEdit(smartview)" />
        <span class="font-medium text-gray-900">{{ smartview.name }}</span>
      </div>
      <span>{{ smartview.clientIds ? smartview.clientIds.length : 0 }}</span>
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
      if (this.smartviews) {
        return Object.fromEntries(Object.entries(this.smartviews)
          .filter(([key, smartview]) => this.showArchived === smartview.archived
          ))
      } else {
        return []
      }
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
    },
    showEdit (smartview) {
      this.$store.commit(
        mutations.setModelResponse,
        { model: models.modals, data: { smartview: { showing: true, data: smartview } } }
      )
    }
  }
}
</script>

<style scoped>
.smartview:nth-child(even) {
  @apply bg-white;
}

.smartview:nth-child(even):hover {
  @apply bg-gray-400;
}

.smartview.selected {
  @apply bg-gray-700 text-gray-100;
}

.smartview.selected span {
  @apply text-white;
}

.smartview.selected:hover {
  @apply bg-gray-400 text-gray-100;
}

.smartview.selected span:hover {
  @apply text-white;
}
</style>