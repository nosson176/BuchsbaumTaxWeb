<template>
  <div class="flex-grow overflow-auto">
    <draggable :value="displayedSmartviews" v-bind="dragOptions" @start="startDrag" @end="onDrop">
      <transition-group type="transition" :name="transitionName">
        <div v-for="smartview in displayedSmartviews" :ref="smartview.id" :key="smartview.id"
          class="text-gray-500 bg-gray-50 px-1 py-1 text-xs smartview cursor-pointer flex justify-between items-center group hover:text-white hover:bg-gray-400"
          :class="smartview.id === selectedSmartviewId ? 'selected' : ''" @click="selectSmartview(smartview)">
          <div class="flex items-center space-x-2">
            <PenIcon v-if="!hideEditButtons" class="h-3 w-3" @click.native.stop="showEdit(smartview)" />
            <span class="font-medium text-gray-900 select-none group-hover:text-white">{{ smartview.name }}</span>
          </div>
          <div class="flex space-x-1">
            <span class="select-none">{{ smartview.clientIds ? smartview.clientIds.length : 0 }}</span>
            <DeleteButton v-if="!hideEditButtons" @click.native.stop="showDeleteModal(smartview)" />
          </div>
        </div>
      </transition-group>
    </draggable>

    <Modal :showing="isDeleteModalVisible" @hide="closeDeleteModal">
      <DeleteArchiveModal label="smartview" :mode="showArchived ? 'archived' : 'normal'" @hide="closeDeleteModal"
        @delete="handleDelete" @archive="handleArchive" @unarchive="handleUnarchive" />
    </Modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import draggable from 'vuedraggable'
import { models, mutations, TRANSITION_NAME, routes } from '~/shared/constants'

export default {
  name: 'Smartviews',
  components: {
    draggable,
  },
  props: {
    showArchived: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      modifiedSmartviews: [], // Keep track of updated items
      dragActive: false,
      dragOptions: {
        animation: 200,
        ghostClass: 'ghost',
      },
      isDeleteModalVisible: false,
      selectedForAction: null,
    }
  },
  computed: {
    ...mapState([models.smartviews, models.selectedSmartview, models.spinner]),
    displayedSmartviews() {
      if (!this.smartviews) {
        console.warn("smartviews is undefined or null.");
        return [];
      }
      return Object.values(JSON.parse(JSON.stringify(this.smartviews)))
        .filter((smartview) => this.showArchived === smartview?.archived)
        .sort((a, b) => a.sortNumber - b.sortNumber);
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
  mounted() {
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
    if (this.modifiedSmartviews.length > 0) {
      this.sendBatchUpdate();
    }
  },

  methods: {
    async selectSmartview(smartview) {
      this.$store.commit("showSpinner", true)
      await this.$api.getFilterClients(this.headers, { smartview }).then((res) => {
        console.log(res)
        this.$store.commit("showSpinner", false)
      })
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

    // New modal related methods
    showDeleteModal(smartview) {
      this.selectedForAction = smartview;
      this.isDeleteModalVisible = true;
    },

    closeDeleteModal() {
      this.isDeleteModalVisible = false;
      this.selectedForAction = null;
    },

    handleDelete() {
      if (!this.selectedForAction) return;

      // Implement permanent deletion logic here
      this.$api.deleteSmartview(this.headers, { smartviewId: this.selectedForAction.id })
        .then(() => {
          this.$store.commit('deleteSmartview', { smartviewId: this.selectedForAction.id });
          if (this.selectedSmartviewId === this.selectedForAction.id) {
            this.$store.commit(mutations.setModelResponse, {
              model: models.selectedSmartview,
              data: null
            });
          }
          this.closeDeleteModal();
        })
        .catch((error) => {
          this.$toast.error('Error deleting smartview');
          console.error('Error deleting smartview:', error);
        });
    },

    handleArchive() {
      if (!this.selectedForAction) return;
      const smartview = this.displayedSmartviews.find((smartview) => smartview.id === this.selectedForAction.id)
      if (this.showArchived) {
        smartview.archived = false
      } else {
        smartview.archived = true
      }
      const index = this.modifiedSmartviews.findIndex(a => a.id === smartview.id)
      if (index !== -1) {
        this.modifiedSmartviews[index] = smartview
      } else {
        this.modifiedSmartviews.push(smartview)
      }
      this.closeDeleteModal()
      this.$store.dispatch('updateSmartviewAction', { smartview });
    },

    handleUnarchive() {
      if (!this.selectedForAction) return;
      const smartview = this.displayedSmartviews.find((smartview) => smartview.id === this.selectedForAction.id)
      if (this.showArchived) {
        smartview.archived = false
      } else {
        smartview.archived = true
      }
      const index = this.modifiedSmartviews.findIndex(a => a.id === smartview.id)
      if (index !== -1) {
        this.modifiedSmartviews[index] = smartview
      } else {
        this.modifiedSmartviews.push(smartview)
      }
      this.closeDeleteModal()
      this.$store.dispatch('updateSmartviewAction', { smartview });
    },

    updateSmartviewAndClose(smartview) {
      this.$api.updateSmartview(this.headers, { smartviewId: smartview.id }, smartview)
        .then(() => {
          this.$store.dispatch('updateSmartviewAction', { smartview });
          if (this.selectedSmartviewId === smartview.id) {
            this.$store.commit(mutations.setModelResponse, {
              model: models.selectedSmartview,
              data: null
            });
          }
          this.closeDeleteModal();
        })
        .catch((error) => {
          this.$toast.error('Error updating smartview');
          console.error('Error updating smartview:', error);
        });
    },

    startDrag(evt) {
      this.dragActive = true
    },

    onDrop(evt) {
      const { oldIndex, newIndex } = evt;
      const movedSmartview = this.displayedSmartviews.splice(oldIndex, 1)[0];
      this.displayedSmartviews.splice(newIndex, 0, movedSmartview);

      const affectedSmartviews = [];
      const startIndex = Math.min(oldIndex, newIndex);
      const endIndex = Math.max(oldIndex, newIndex);

      for (let index = startIndex; index <= endIndex; index++) {
        const smartview = this.displayedSmartviews[index];
        const updatedSortNumber = index + 1;

        if (smartview.sortNumber !== updatedSortNumber) {
          smartview.sortNumber = updatedSortNumber;
          affectedSmartviews.push({ id: smartview.id, sortNumber: smartview.sortNumber });
        }
      }

      affectedSmartviews.forEach((updatedSmartview) => {
        const existingIndex = this.modifiedSmartviews.findIndex((item) => item.id === updatedSmartview.id);
        if (existingIndex === -1) {
          this.modifiedSmartviews.push(updatedSmartview);
        } else {
          this.modifiedSmartviews[existingIndex].sortNumber = updatedSmartview.sortNumber;
        }
      });

      this.dragActive = false;
    },

    async sendBatchUpdate() {
      try {
        await this.$api.updateSmartviewsBatch(this.headers, this.modifiedSmartviews);
        this.$store.commit('updateSmartviewsBatch', { smartviews: this.modifiedSmartviews });
      } catch (error) {
        console.error('Error sending batch update:', error);
      } finally {
        this.modifiedSmartviews = [];
      }
    },

    handleBeforeUnload(event) {
      if (this.modifiedSmartviews.length > 0) {
        this.sendBatchUpdate();
        event.preventDefault();
        event.returnValue = '';
      }
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