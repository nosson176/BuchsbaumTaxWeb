<template>
  <div>
    <div class="bg-white px-4 pt-5 pb-4 overflow-auto h-80 sm:p-6 sm:pb-4">
      <div class="sm:flex sm:items-start">
        <div
          class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10"
        >
          <PenIcon class="text-indigo-600 h-6 w-6" />
        </div>
        <div class="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
          <div class="flex justify-between">
            <Input
              id="modal-title"
              ref="name"
              v-model="name"
              class="text-lg leading-6 font-medium text-gray-900"
            />
            <AddRowButton @click="addSmartViewLine" />
          </div>
          <div v-if="hasLines" class="mt-4 shadow">
            <SmartviewLine
              v-for="(line, idx) in smartview.smartviewLines"
              :key="idx"
              :line="line"
              :idx="idx"
              @input="updateSmartviewLine"
              @delete="removeSmartviewLine"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
      <button
        :disabled="!smartviewIsValid"
        type="button"
        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
        :class="!smartviewIsValid ? 'cursor-not-allowed' : 'cursor-pointer'"
        @click="handleUpdateCreate"
      >
        <LoadingIndicator v-if="isLoading" class="px-4 cursor-not-allowed" />
        <span v-else-if="isNew" class="capitalize">Create</span>
        <span v-else class="capitalize">Save</span>
      </button>
      <button
        type="button"
        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        @click="emitHide"
      >Cancel</button>
      <div class="flex-grow" />
      <button
        type="button"
        class="w-full inline-flex justify-center justify-self-start rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
        @click="handleDelete"
      >
        <span class="capitalize">Delete</span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { events, models, mutations } from '~/shared/constants'

const lineConstructor = {
  groupNum: 0,
  fieldName: '',
  operator: '',
  searchValue: ''
}

export default {
  name: 'SmartviewEditCard',
  data () {
    return {
      isLoading: false
    }
  },
  computed: {
    ...mapState([models.modals, models.selectedClient]),
    smartview () {
      return JSON.parse(JSON.stringify(this.modals.smartview?.data))
    },
    headers () {
      return this.$api.getHeaders()
    },
    name: {
      get () {
        return this.smartview.name
      },
      set (value) {
        this.$set(this.smartview, 'name', value)
      }
    },
    hasLines () {
      return this.smartview.smartviewLines.length > 0
    },
    isNew () {
      return this.smartview.id === undefined
    },
    smartviewIsValid () {
      return this.smartview.name !== '' && this.smartviewLinesValid
    },
    smartviewLinesValid () {
      return this.smartview.smartviewLines.every((line) => {
        return line.fieldName !== '' && line.operator !== '' && line.searchValue !== ''
      })
    }
  },
  mounted () {
    if (this.isNew) {
      this.$refs.name.$refs.input.focus()
      this.addSmartViewLine()
    }
  },
  methods: {
    emitHide () {
      this.$emit(events.hide)
    },
    updateSmartviewLine (line) {
      this.smartview.smartviewLines[line.idx] = line.newVal
      this.updateSmartview()
    },
    addSmartViewLine () {
      this.smartview.smartviewLines.push(lineConstructor)
      this.updateSmartview()
    },
    removeSmartviewLine (idx) {
      this.smartview.smartviewLines.splice(idx, 1)
      this.updateSmartview()
    },
    create () {
      if (this.isLoading) {
        return
      }
      this.isLoading = true
      const smartview = Object.assign({}, this.smartview, { smartviewLines: this.smartview.smartviewLines })
      this.$api.createSmartview(this.headers, { smartview })
        .then(() => {
          this.isLoading = false
          this.emitHide()
        })
    },
    update () {
      if (this.isLoading) {
        return
      }
      this.isLoading = true
      const smartview = Object.assign({}, this.smartview, { smartviewLines: this.smartview.smartviewLines })
      this.$api.updateSmartview(this.headers, { smartviewId: this.smartview.id }, smartview)
        .then(() => {
          this.isLoading = false
          this.emitHide()
        })
    },
    handleUpdateCreate () {
      if (this.isLoading || !this.smartviewIsValid) {
        return
      }
      if (this.isNew) {
        this.create()
      } else {
        this.update()
      }
    },
    handleDelete () {
      if (this.isLoading) {
        return
      }
      this.isLoading = true
      this.$api.deleteSmartview(this.headers, { smartviewId: this.smartview.id })
        .then(() => {
          this.isLoading = false
          this.emitHide()
          this.$store.commit(mutations.setModelResponse, { model: models.selectedSmartview, data: [] })
        })
    },
    updateSmartview () {
      this.$store.commit(
        mutations.setModelResponse,
        { model: models.modals, data: { smartview: { showing: true, data: this.smartview } } }
      )
    }
  }
}
</script>

<style scoped>
</style>
