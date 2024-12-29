<template>
  <div class="modal">
    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
      <div>
        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <h3 class="text-lg leading-6 font-medium text-center text-gray-900">New Message</h3>
          <div class="mt-4 flex items-center justify-center">
            Recipients:
            <MultiSelectOption v-model="selectedUsers" class="ml-3" :options="usersList" />
          </div>
          <div class="mt-2 w-full">
            <label>
              <textarea v-model="message" spellcheck class="w-full border-gray-300 rounded" rows="7" />
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-gray-50 px-6 py-3 flex justify-center">
      <button
        type="button"
        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        @click="emitHide"
      >
        Cancel
      </button>
      <button
        type="button"
        :disabled="isDisabled"
        :class="isDisabled ? 'bg-green-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'"
        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
        @click="sendMessage"
      >
        Send
      </button>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { events, models } from '~/shared/constants'
export default {
  name: 'SendMessage',
  props: {
    responseId: {
      type: Number,
      default: null,
    },
    threadId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      selectedUsers: [],
      message: '',
    }
  },
  computed: {
    ...mapState([models.users, models.inbox]),
    usersState() {
      return this.users
    },
    usersList() {
      const usersArr = []
      for (const key in this.usersState) {
        usersArr.push({
          name: this.usersState[key].username,
          value: this.usersState[key].id.toString(),
        })
      }
      return usersArr
    },
    headers() {
      return this.$api.getHeaders()
    },
    isDisabled() {
      return !this.message || !this.userIds
    },
    userIds() {
      return this.selectedUsers.map((users) => users.value)
    },
    responseTo() {
      for (const key in this.inbox) {
        const message = this.inbox[key]
        if (message.id === this.responseId) {
          return message.senderId
        }
        for (const response of message.responses) {
          if (response.id === this.responseId) {
            return response.senderId
          }
        }
      }
      return null
    },
  },
  mounted() {
    if (this.responseId) {
      const respondToUser = this.usersList.find((user) => {
        return Number(user.value) === Number(this.responseTo)
      })
      this.selectedUsers.push(respondToUser)
    }
  },
  methods: {
    emitHide() {
      this.$emit(events.hide)
    },
    sendMessage() {
  console.log("sendMSG");
  const messageObj = { recipients: this.userIds, message: this.message };
  if (this.responseId) {
    console.log("relay");
    messageObj.parentId = this.responseId;
    messageObj.threadId = this.threadId;
  }
  console.log(messageObj);
  this.$api.sendMessage(this.headers, { messageObj }).then((res) => {
    console.log(res);
    const response = res.data[0];
    console.log("parentId being sent to mutation:", messageObj.parentId);
    this.$store.commit("pushNewMsg", { msg: response, parentId: messageObj.parentId });
    return this.emitHide();
  });
}
  },
}
</script>
<style scoped>
input {
  @apply border-gray-300 rounded;

  height: 22px;
}
</style>
