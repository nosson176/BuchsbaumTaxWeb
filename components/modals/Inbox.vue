<template>
  <div>
    <div class="inbox-container py-5 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-xl font-semibold text-gray-900">Messages</h1>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            @click="sendMessage"
          >
            New Message
          </button>
        </div>
      </div>
      <div v-if="isInboxEmpty && !isInboxLoading" class="mt-4 h-full">Your inbox is empty.</div>
      <div class="mt-8 flex flex-col overflow-auto h-full pb-20">
        <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div class="shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table class="min-w-full divide-y divide-gray-300 overflow-hidden">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Sender
                    </th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Message</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created At</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white overflow-auto">
                  <template v-for="message in formattedMessages">
                    <tr
                      :key="message.id"
                      :class="{ 'bg-gray-100 cursor-pointer': message.status === 'unread' }"
                      @click="markAsRead(message)"
                    >
                      <td
                        class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                        :class="{ 'font-bold': message.status === 'unread' }"
                      >
                        {{ message.sender }}
                      </td>
                      <td class="message px-3 py-4 text-sm text-gray-500">
                        {{ message.message }}
                      </td>
                      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 flex flex-col">
                        <div>{{ message.date }}</div>
                        <div>{{ message.time }}</div>
                      </td>
                      <td>
                        <button
                          v-if="currentUser.id !== message.senderId"
                          class="flex items-center space-x-1 transform hover:text-indigo-400 hover:scale-110"
                          @click="replyTo(message.id, message.id)"
                        >
                          <ReplyIcon class="w-5 h-5" /> <span>Reply</span>
                        </button>
                      </td>
                      <td>
                        <DeleteButton @click="deleteMessage(message)" />
                      </td>
                    </tr>
                    <tr v-for="response in message.responses" :key="response.id" class="bg-gray-100">
                      <td class="whitespace-nowrap py-4 pl-4 pr-3 text-xs font-medium text-gray-700 sm:pl-6">
                        <div class="flex items-center space-x-2">
                          <ReplyIcon class="text-indigo-300 w-6 h-6 transform rotate-180" /><span>{{
                            response.sender
                          }}</span>
                        </div>
                      </td>
                      <td class="message px-3 py-4 text-sm text-gray-500">
                        {{ response.message }}
                      </td>
                      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 flex flex-col">
                        <div>{{ response.date }}</div>
                        <div>{{ response.time }}</div>
                      </td>
                      <td>
                        <button
                          v-if="currentUser.id !== response.senderId"
                          class="flex items-center space-x-1 transform hover:text-indigo-400 hover:scale-110"
                          @click="replyTo(response.id, message.id)"
                        >
                          <ReplyIcon class="w-5 h-5" /> <span>Reply</span>
                        </button>
                      </td>
                      <td class="py-4 pl-4 pr-3 sm:pl-6">
                        <DeleteButton @click="deleteMessage(response)" />
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
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
  data() {
    return {}
  },
  computed: {
    ...mapState([models.inbox, models.users, models.loading, models.currentUser]),
    inboxState() {
      return this.inbox
    },
    headers() {
      return this.$api.getHeaders()
    },
    isInboxLoading() {
      return this.loading.inbox
    },
    isInboxEmpty() {
      return Object.keys(this.inboxState).length === 0
    },
    usersHash() {
      const usersHash = {}
      for (const key in this.users) {
        usersHash[this.users[key].id] = this.users[key]
      }
      return usersHash
    },
    formattedMessages() {
      const messages = []
      for (const key in this.inboxState) {
        messages.push(this.formatMessage(this.inboxState[key]))
      }
      return messages
    },
  },
  methods: {
    emitHide() {
      this.$emit(events.hide)
    },
    sendMessage() {
      this.$emit(events.newMessage)
      this.emitHide()
    },
    markAsRead(message) {
      this.$api.updateMessage(this.headers, { messageId: message.id }, { status: 'read' }).then(this.loadInbox)
    },
    async loadInbox() {
      await this.$api.getInbox(this.headers)
    },
    deleteMessage({ id }) {
      this.$api.deleteMessage(this.headers, { messageId: id })
    },
    replyTo(parentId, threadId) {
      this.$emit(events.newMessage, parentId, threadId)
    },
    formatMessage(message) {
      const responses = []
      const messageCopy = { ...message }
      messageCopy.sender = this.usersHash[messageCopy.senderId]?.username
      messageCopy.date = formatDateForClient(messageCopy.created)
      messageCopy.time = format(parseISO(messageCopy.created), dateformat.time)
      if (messageCopy.responses) {
        for (const response of messageCopy.responses) {
          responses.push(this.formatMessage(response))
        }
        messageCopy.responses = responses
      }
      return messageCopy
    },
  },
}
</script>
<style scoped>
.inbox-container {
  height: 700px;
}

.message {
  max-width: 800px;
}
</style>
