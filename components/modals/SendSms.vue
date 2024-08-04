<template>
  <div class="modal">
    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
      <div>
        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <h3 class="text-lg leading-6 font-medium text-gray-900">This will send an SMS</h3>
          <div class="mt-2 w-full">
            <label>
              <div class="mb-1">Message</div>
              <textarea v-model="message" spellcheck class="w-full border-gray-300 rounded" rows="3" />
            </label>
            <div class="mt-4 h-20">
              <div class="flex justify-between">
                <div>Send to:</div>
              </div>
              <HeaderSelectOption v-model="phoneNumber" :options="mappedPhoneNumbers" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
      <button type="button" :disabled="isDisabled"
        :class="isDisabled ? 'bg-green-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'"
        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
        @click="sendSms">
        Send
      </button>
      <button type="button"
        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        @click="emitHide">
        Cancel
      </button>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { events, models } from '~/shared/constants'
export default {
  name: 'SendSms',
  data() {
    return {
      message: '',
      phoneNumber: '',
    }
  },
  computed: {
    ...mapState([models.users]),
    mappedPhoneNumbers() {
      const phoneNumberArr = []
      for (const key in this.users) {
        if (this.users[key].phoneNumber) {
          phoneNumberArr.push({
            name: `${this.users[key].phoneNumber} (${this.users[key].username})`,
            value: this.users[key].phoneNumber,
          })
        }
      }
      return phoneNumberArr
    },
    headers() {
      return this.$api.getHeaders()
    },
    isDisabled() {
      return !this.message || !this.phoneNumber
    },
  },
  methods: {
    emitHide() {
      this.$emit(events.hide)
    },
    sendSms() {
      const sms = { phoneNumber: this.phoneNumber, message: this.message }
      this.$api.sendSms(this.headers, { sms }).then(this.emitHide)
    },
  },
}
</script>
<style scoped>
.modal {
  height: 355px;
}

input {
  @apply border-gray-300 rounded;

  height: 22px;
}
</style>
