<template>
  <div class="flex-grow overflow-auto">
    <draggable :value="displayedSmartviews" v-bind="dragOptions" @start="startDrag" @end="onDrop">
      <transition-group type="transition" :name="transitionName">
        <div
          v-for="smartview in displayedSmartviews"
          :ref="smartview.id"
          :key="smartview.id"
          class="text-gray-500 bg-gray-50 px-1 py-1 text-xs smartview cursor-pointer flex justify-between items-center group hover:text-white hover:bg-gray-400"
          :class="smartview.id === selectedSmartviewId ? 'selected' : ''"
          @click="selectSmartview(smartview)"
        >
          <div class="flex items-center space-x-2">
            <PenIcon v-if="!hideEditButtons" class="h-3 w-3" @click.native.stop="showEdit(smartview)" />
            <span class="font-medium text-gray-900 select-none group-hover:text-white">{{ smartview.name }}</span>
          </div>
          <div class="flex space-x-1">
            <span class="select-none">{{ smartview.clientIds ? smartview.clientIds.length : 0 }}</span>
            <DeleteButton v-if="!hideEditButtons" @click="archiveSmartview(smartview)" />
          </div>
        </div>
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import draggable from 'vuedraggable'
import { models, mutations, tabs, TRANSITION_NAME, routes } from '~/shared/constants'

export default {
  name: 'Smartviews',
  components: { draggable },
  props: {
    showArchived: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dragActive: false,
      dragOptions: {
        animation: 200,
        ghostClass: 'ghost',
      },
    }
  },
  computed: {
    ...mapState([models.smartviews, models.selectedSmartview]),
    displayedSmartviews() {
      if (this.smartviews) {
        return Object.values(JSON.parse(JSON.stringify(this.smartviews)))
          .filter((smartview) => this.showArchived === smartview.archived)
          .sort((a, b) => a.sortNumber - b.sortNumber)
      } else {
        return []
      }
    },
    selectedSmartviewId() {
      return this.selectedSmartview?.id
    },
    headers() {
      return this.$api.getHeaders()
    },
    transitionName() {
      if (!this.dragActive) {
        return TRANSITION_NAME
      }
      return null
    },
    hideEditButtons() {
      return this.$route.name === routes.maps
    },
  },
  methods: {
    selectSmartview(smartview) {
      this.$store.commit(mutations.setModelResponse, { model: models.clientSearchValue, data: [] })
      if (this.selectedSmartviewId === smartview.id) {
        this.$store.commit(mutations.setModelResponse, { model: models.selectedSmartview, data: [] })
      } else {
        this.$store.commit(mutations.setModelResponse, { model: models.selectedSmartview, data: smartview })
      }
    },
    showEdit(smartview) {
      this.$store.commit(mutations.setModelResponse, {
        model: models.modals,
        data: { smartview: { showing: true, data: smartview } },
      })
    },
    archiveSmartview(smartview) {
      if (this.showArchived) {
        smartview.archived = false
        this.$api
          .updateSmartview(this.headers, { smartviewId: smartview.id }, smartview)
          .then(() => this.$store.commit(mutations.setModelResponse, { model: models.selectedSmartview, data: [] }))
      } else {
        this.$store.commit(mutations.setModelResponse, {
          model: models.modals,
          data: { delete: { showing: true, data: { id: smartview.id, type: tabs.smartviews, label: smartview.name } } },
        })
      }
    },
    startDrag() {
      this.dragActive = true
    },
    onDrop(evt) {
      const item = this.displayedSmartviews[evt.oldIndex]
      item.sortNumber = evt.newIndex + 1
      this.$api.updateSmartview(this.headers, { smartviewId: item.id }, item)
      this.dragActive = false
    },
  },
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
