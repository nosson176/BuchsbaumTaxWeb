<template>
    <div>
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
                <div
                    class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 class="text-lg leading-6 font-medium text-gray-900">Create New Client</h3>
                    <div class="mt-2">
                        <form @submit.prevent="createClient" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Display Name</label>
                                <input v-model="newClient.displayName" type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Last Name</label>
                                <input v-model="newClient.lastName" type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Display Phone</label>
                                <input v-model="newClient.displayPhone" type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Status</label>
                                <select v-model="newClient.status"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                    <option value="">Select Status</option>
                                    <option v-for="option in filteredOptions" :key="option.value" :value="option.value">
                                        {{ option.value }}
                                    </option>
                                </select>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 sm:ml-3 sm:w-auto sm:text-sm"
                @click="createClient">
                Create Client
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
    name: 'CreateClientModal',

    data() {
        return {
            newClient: {
                active: true,
                archived: false,
                created: new Date().toISOString(),
                displayName: '',
                displayPhone: '',
                filings: [],
                flags: [],
                flag: null,
                gFlag: null,
                lastName: '',
                logs: [],
                periodical: '',
                status: '',
                statusChangeDate: null,
                updated: null
            },
            filterOptionsValue: ''
        }
    },
    computed: {
        ...mapState({
            valueTypes: state => state[models.valueTypes]
        }),
        headers() {
            return this.$api.getHeaders()
        },
        periodicalOptions() {
            return this.valueTypes?.periodical || []
        },
        statusOptions() {
            console.log(this.valueTypes)
            return this.valueTypes?.status || []
        },
        filteredOptions() {
            return this.statusOptions
                .filter((option) => option?.value)
                .filter((option) =>
                    option.value.toLowerCase().includes(this.filterOptionsValue.toLowerCase())
                );
        },
    },
    methods: {
        createClient() {
            // Validate input
            if (!this.newClient.displayName || !this.newClient.lastName || !this.newClient.status) {
                this.$toast.error('Display Name and Last Name and status are required')
                return
            }

            // Set updated timestamp
            this.newClient.updated = new Date().toISOString()

            this.$api.createClient(this.headers, { client: this.newClient }).then((data) => {
                this.$store.commit('pushNewClient', data)
                this.$toast.success('Client created successfully')
                this.emitHide()
            }).catch(error => {
                this.$toast.error('Failed to create client: ' + error.message)
            })
        },

        emitHide() {
            this.$emit(events.hide)
        }
    }
}
</script>