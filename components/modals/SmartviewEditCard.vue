<template>
  <div>
    <div class="bg-white px-4 pt-5 pb-4 overflow-auto h-96 sm:p-6 sm:pb-4 flex flex-col justify-between">
      <div class="sm:flex sm:items-start">
        <div
          class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
          <PenIcon class="text-indigo-600 h-6 w-6" />
        </div>
        <div class="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
          <div class="flex justify-between">
            <Input id="modal-title" ref="name" v-model="name" class="text-lg leading-6 font-medium text-gray-900" />
            <AddRowButton @click="addSmartViewLine" />
          </div>
          <div v-if="hasLines" class="mt-4 shadow">
            <SmartviewLine v-for="(line, idx) in smartviewLines" :key="line.id" :line="line" :idx="idx"
              @input="updateSmartviewLine" @delete="removeSmartviewLine" />
          </div>
        </div>
      </div>
      <div class="flex items-center justify-end mt-2 mb-1 text-sm">
        Send To Account:
        <HeaderSelectOption v-model="sendToUserId" short class="ml-2" :options="usersArray" />
        <button type="button" :disabled="isSendDisabled"
          :class="isSendDisabled ? 'bg-green-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'"
          class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
          @click="updateUserId">
          Send
        </button>
      </div>
    </div>
    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
      <button :disabled="!smartviewIsValid" type="button"
        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
        :class="!smartviewIsValid ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'" @click="handleUpdateCreate">
        <LoadingIndicator v-if="isLoading" class="px-4 cursor-not-allowed h-5 w-5 text-white" />
        <span v-else-if="isNew" class="capitalize">Create</span>
        <span v-else class="capitalize">Save</span>
      </button>
      <button type="button"
        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        @click="emitHide">
        Cancel
      </button>
      <div class="flex-grow" />
      <button type="button"
        class="w-full inline-flex justify-center justify-self-start rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
        @click="confirmDelete">
        <LoadingIndicator v-if="deleting" class="px-4 cursor-not-allowed h-5 w-5 text-white" />
        <span v-else class="capitalize">Delete</span>
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
  searchValue: '',
  showDelete: false
}

export default {
  name: 'SmartviewEditCard',
  props: {
    deleting: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isLoading: false,
      sendToUserId: '',
      sendToUserName: '',
    }
  },
  computed: {
    ...mapState([models.modals, models.selectedClient, models.users, models.selectedSmartview]),
    smartview() {
      return JSON.parse(JSON.stringify(this.modals.smartview?.data))
    },
    headers() {
      return this.$api.getHeaders()
    },
    name: {
      get() {
        return this.smartview.name
      },
      set(value) {
        this.$set(this.smartview, 'name', value)
      },
    },
    hasLines() {
      return this.smartview.smartviewLines.length > 0
    },
    isNew() {
      return this.smartview.id === undefined
    },
    smartviewIsValid() {
      return this.smartview.name !== '' && this.smartviewLinesValid
    },
    smartviewLinesValid() {
      return this.smartview.smartviewLines.every((line) => {
        return line.fieldName !== '' && line.operator !== '' && line.searchValue !== ''
      })
    },
    usersArray() {
      const usersArray = []
      for (const key in this.users) {
        usersArray.push({
          value: this.users[key].id.toString(),
          name: this.users[key].username,
        })
      }
      return usersArray
    },
    isSendDisabled() {
      return !this.sendToUserId || this.sendToUserId === this.modals.smartview.data.userId?.toString()
    },
    selectedSmView() {
      return this.selectedSmartview
    },
    hasSelectedSmartview() {
      return !Array.isArray(this.selectedSmView) || this.selectedSmView.length
    },
    smartviewLines() {
      return [...this.smartview.smartviewLines].sort((a, b) => a.groupNum - b.groupNum)
    },
  },

  mounted() {
    if (this.isNew) {
      this.$refs.name.$refs.input.focus()
      this.addSmartViewLine()
    }
  },
  methods: {
    emitHide() {
      this.$emit(events.hide)
    },
    updateSmartviewLine(line) {
      const updatedLineIndex = this.smartview.smartviewLines.findIndex((l) => l.id === line.id)
      this.smartview.smartviewLines[updatedLineIndex] = line
      this.updateSmartview()
    },
    addSmartViewLine() {
      const newLine = { ...lineConstructor, id: Math.floor(Math.random() * 1000000) }; // clone and assign a new id
      this.smartview.smartviewLines.push(newLine);
      this.updateSmartview();
    },
    removeSmartviewLine(idx) {
      this.smartview.smartviewLines.splice(idx, 1)
      this.updateSmartview()
    },
    create() {
      if (this.isLoading || !this.smartviewIsValid) {
        return
      }
      console.log("create")
      this.isLoading = true
      const smartview = Object.assign({}, this.smartview, { smartviewLines: this.smartview.smartviewLines })
      this.$api.createSmartview(this.headers, { smartview }).then((data) => {
        console.log(data)
        this.$store.commit('pushNewSmartview', data)
        this.isLoading = false
        this.emitHide()
      })
    },
    update() {
      if (this.isLoading || !this.smartviewIsValid) {
        return
      }
      this.isLoading = true
      const smartview = Object.assign({}, this.smartview, { smartviewLines: this.smartview.smartviewLines })
      this.$api.updateSmartview(this.headers, { smartviewId: this.smartview.id }, smartview, true).then((smartview) => {
        // Change the selectedsmartview to the updated value
        if (this.hasSelectedSmartview) {
          this.$store.commit(mutations.setModelResponse, { model: models.selectedSmartview, data: smartview })
        }
        this.$store.dispatch('updateSmartviewAction', { smartview });
        this.isLoading = false
        this.emitHide()
      })
    },
    handleUpdateCreate() {
      if (this.isLoading || !this.smartviewIsValid) {
        return
      }
      if (this.isNew) {
        this.create()
      } else {
        this.update()
      }
    },
    confirmDelete() {
      this.$emit(events.delete)
    },
    updateSmartview() {
      this.$store.commit(mutations.setModelResponse, {
        model: models.modals,
        data: { smartview: { showing: true, data: this.smartview } },
      })
    },
    updateUserId() {
      const selectedUser = this.usersArray.find(user => user.value === this.sendToUserId);

      if (selectedUser) {
        // Create a copy of smartview with updated userId and userName
        const updatedSmartview = {
          ...this.smartview, // clone all properties from the original smartview
          userId: this.sendToUserId, // update userId
          userName: selectedUser.name // update userName
        };

        // Proceed with sending the updated smartview
        this.sendToAnotherUser(updatedSmartview);
      }
    },
    sendToAnotherUser(updatedSmartview) {
      const smartviewToSend = { ...updatedSmartview, smartviewLines: updatedSmartview.smartviewLines };

      // Use the API call with the cloned and updated smartview
      this.$api.createSmartview(this.headers, { smartview: smartviewToSend }, this.sendToUserId).then(res => {
      });
    }
  },
}
</script>

<style scoped></style>
