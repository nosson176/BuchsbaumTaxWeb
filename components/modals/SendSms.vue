<template>
  <div class="modal">
    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
      <div v-show="!addNumberMode">
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
                <AddRowButton title="Add phone number" @click.native="toggleAddNumberMode" />
              </div>
              <HeaderSelectOption v-model="telId" :options="mappedPhoneNumbers" />
            </div>
          </div>
        </div>
      </div>
      <div v-show="addNumberMode" class="mt-3 w-full mx-auto text-center">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Add Number</h3>
        <div class="flex items-center justify-center mt-7">
          <div class="text-xs text-right">
            Name: <input v-model="newPhoneName" type="text" class="mb-2" />
            <div>+972 <input v-model="newPhoneNumber" type="tel" /></div>
          </div>
          <div class="flex items-center ml-3">
            <CheckIcon class="h-5 w-5 mr-1 text-green-500 cursor-pointer" @click.native="addPhoneNumber" />
            <CloseIcon class="h-5 w-5 ml-1 text-red-500 cursor-pointer" @click.native="toggleAddNumberMode" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="!addNumberMode" class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
      <button
        type="button"
        :disabled="isDisabled"
        :class="isDisabled ? 'bg-green-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'"
        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
        @click="sendSms"
      >
        Send
      </button>
      <button
        type="button"
        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        @click="emitHide"
      >
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
      telId: '',
      addNumberMode: false,
      newPhoneNumber: '',
      newPhoneName: '',
    }
  },
  computed: {
    ...mapState([models.phoneNumbers]),
    phoneNumbersState() {
      return this.phoneNumbers
    },
    mappedPhoneNumbers() {
      const phoneNumberArr = []
      for (const key in this.phoneNumbersState) {
        phoneNumberArr.push({
          name: this.phoneNumbersState[key].phoneNumber + ' (' + this.phoneNumbersState[key].name + ')',
          value: this.phoneNumbersState[key].id.toString(),
        })
      }
      return phoneNumberArr
    },
    headers() {
      return this.$api.getHeaders()
    },
    isDisabled() {
      return !this.message || !this.telId
    },
  },
  created() {
    this.loadPhoneNumbers()
  },
  methods: {
    emitHide() {
      this.$emit(events.hide)
    },
    async loadPhoneNumbers() {
      await this.$api.getPhoneNumbers(this.headers)
      if (!this.telId) {
        this.telId = this.phoneNumbersState ? this.phoneNumbersState[0]?.id.toString() : ''
      }
    },
    toggleAddNumberMode() {
      this.addNumberMode = !this.addNumberMode
    },
    addPhoneNumber() {
      if (!this.newPhoneNumber || !this.newPhoneName) {
        return
      }
      if (isNaN(this.newPhoneNumber)) {
        this.newPhoneNumber = this.newPhoneNumber.replaceAll('-', '').replaceAll(' ', '').trim()
      }
      if (this.newPhoneNumber[0] === '0') {
        this.newPhoneNumber = this.newPhoneNumber.substring(1)
      }
      const formattedNumber = '+972' + this.newPhoneNumber
      const phoneNum = { phoneNumber: formattedNumber, name: this.newPhoneName }
      this.$api.createPhoneNumber(this.headers, { phoneNum }).then((data) => {
        this.loadPhoneNumbers()
      })
      this.toggleAddNumberMode()
    },
    sendSms() {
      const sms = { phoneNumberId: this.telId, message: this.message }
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
