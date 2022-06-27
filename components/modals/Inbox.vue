<template>
  <div>
    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
      <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Messages</h3>
        <div class="mt-2 w-full">
          <div class="mb-1">
            <AddRowButton title="New message" @click.native="sendMessage"/>
          </div>
          <div class="mt-4 h-20">
            <div v-if="isInboxEmpty">
              Your inbox is empty.
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-center my-3">
      <button
        type="button"
        class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        @click="emitHide"
      >
        Close Window
      </button>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { events, models } from '~/shared/constants'
export default {
  name: 'Inbox',
  data(){
    return {
    }
  },
  computed:{
    ...mapState([models.inbox]),
    inboxState(){
      return this.inbox
    },
    headers() {
      return this.$api.getHeaders()
    },
    isInboxEmpty(){
      return Object.keys(this.inboxState).length === 0
    }
  },
  created(){
    this.loadInbox()
  },
  methods: {
    emitHide() {
      this.$emit(events.hide)
    },
    async loadInbox(){
      await this.$api.getInbox(this.headers)
    },
    sendMessage(){
      this.$emit(events.newMessage)
      this.emitHide()
    }
  },
}
</script>
<style scoped>

</style>
