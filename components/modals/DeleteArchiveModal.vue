<template>
    <div>
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10"
                    :class="iconBackgroundColor">
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 id="modal-title" class="text-lg leading-6 font-medium text-gray-900 capitalize">
                        {{ modalTitle }}
                    </h3>
                    <div class="mt-2">
                        <p class="text-sm text-gray-500">{{ modalMessage }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm"
                :class="deleteButtonColor" @click="handleDelete">
                Delete
            </button>
            <button type="button"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-600 text-base font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:ml-3 sm:w-auto sm:text-sm"
                @click="handleArchive">
                {{ archiveButtonText }}
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
import { events } from '~/shared/constants'

export default {
    name: 'DeleteArchiveModal',
    props: {
        label: {
            type: String,
            default: 'item'
        },
        mode: {
            type: String,
            default: 'normal', // 'normal', 'archived'
            validator: value => ['normal', 'archived'].includes(value)
        }
    },
    computed: {
        modalIcon() {
            return this.mode === 'archived' ? 'UnarchiveIcon' : 'AlertIcon'
        },
        iconBackgroundColor() {
            return this.mode === 'archived' ? 'bg-blue-100' : 'bg-red-100'
        },
        iconColor() {
            return this.mode === 'archived' ? 'text-blue-600' : 'text-red-600'
        },
        deleteButtonColor() {
            return this.mode === 'archived'
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        },
        modalTitle() {
            return `${this.mode === 'archived' ? 'Manage Archived' : 'Delete'} ${this.label}`
        },
        modalMessage() {
            return this.mode === 'archived'
                ? `Would you like to delete or unarchive this ${this.label}?`
                : `Are you sure you want to delete or archive this ${this.label}?`
        },
        archiveButtonText() {
            return this.mode === 'archived' ? 'Unarchive' : 'Archive'
        }
    },
    methods: {
        handleDelete() {
            this.$emit(events.delete)
        },
        handleArchive() {
            this.$emit(this.mode === 'archived' ? events.unarchive : events.archive)
        },
        emitHide() {
            this.$emit(events.hide)
        }
    }
}
</script>