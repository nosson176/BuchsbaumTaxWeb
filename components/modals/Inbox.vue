<template>
  <div>
    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
      <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Messages</h3>
        <div class="mt-2 w-full h-56 overflow-hidden">
          <div class="mb-2 bg-gray-100 grid text-sm font-semibold">
            <AddRowButton title="New message" @click.native="sendMessage"/>
            <div>Sender</div>
            <div>Message</div>
            <div>Created At</div>
          </div>
          <div v-if="isInboxEmpty && !isInboxLoading" class="mt-4 h-full">
            Your inbox is empty.
          </div>
          <div v-else-if="!isInboxLoading" class="h-full overflow-y-auto pb-7">
            <div v-for="(message, key) in formattedMessages" :key="key">
              <div
                class="grid border p-1 mb-1"
                :class="{'bg-gray-50 cursor-pointer': message.status === 'unread'}"
                @click="markAsRead(message)"
              >
                <div></div>
                <div>{{ message.sender }}</div>
                <div class="break-words">{{ message.message }}</div>
                <div class="text-xs pl-2 flex flex-col">
                  <div>{{ message.date }}</div>
                  <div>{{ message.time }}</div>
                </div>
              </div>
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
import { format, parseISO } from 'date-fns'
import { dateformat, events, models } from '~/shared/constants'
import { formatDateForClient } from '~/shared/domain-utilities'
export default {
  name: 'Inbox',
  data(){
    return {
    }
  },
  computed:{
    ...mapState([models.inbox, models.users, models.loading]),
    inboxState(){
      return this.inbox
    },
    headers() {
      return this.$api.getHeaders()
    },
    isInboxLoading(){
      return this.loading.inbox
    },
    isInboxEmpty(){
      return Object.keys(this.inboxState).length === 0
    },
    usersHash(){
      const usersHash = {}
      for(const key in this.users){
        usersHash[this.users[key].id] = this.users[key]
      }
      return usersHash
    },
    formattedMessages(){
      const messages = []
      for(const key in this.inboxState){
        const message = this.inboxState[key]
        message.sender = this.usersHash[this.inboxState[key].senderId].username
        message.date = formatDateForClient(this.inboxState[key].created)
        message.time = format(parseISO(this.inboxState[key].created), dateformat.time)
        messages.push(message)
      }
      return messages
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
    },
    markAsRead(message){
      this.$api.updateMessage(this.headers, { messageId: message.id }, {status: 'read'})
      .then(this.loadInbox)

    }
  },
}
</script>
<style scoped>
  .grid {
    grid-template-columns: 7% 18% 53% 22%;
  }
</style>
