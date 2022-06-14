<template>
  <div>
    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
      <div>
        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <h3 class="text-lg leading-6 font-medium text-gray-900">This will send an SMS to Nosson's cell</h3>
          <div class="mt-2 w-full">
            <label>
              <div class="mb-1">
                Message
              </div>
              <input v-model="message" type='tel' class="rounded w-full" />
            </label>
            <div class="mt-4">
              <div class="flex justify-between">
                <div>
                  Send to:
                </div>
                <AddRowButton title="Add phone number" />
              </div>
              <HeaderSelectOption v-model="telId" :options="mappedPhoneNumbers" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
      <button
        type="button"
        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
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
  data(){
    return {
      message: '',
      telId: ''
    }
  },
  computed:{
    ...mapState([models.phoneNumbers]),
    phoneNumbersState(){
      return this.phoneNumbers
    },
    mappedPhoneNumbers(){
      const phoneNumberArr = [{name: 'Choose a number', value: ''}]
      for(const key in this.phoneNumbersState){
        phoneNumberArr.push({name: this.phoneNumbersState[key].name, value: this.phoneNumbersState[key].id.toString()})
      }
      return phoneNumberArr
    }
  },
  created(){
    this.loadPhoneNumbers()
  },
  methods: {
    emitHide() {
      this.$emit(events.hide)
    },
    async loadPhoneNumbers(){
      await this.$api.getPhoneNumbers(this.headers)
    }
  },
}
</script>
<style scoped></style>
