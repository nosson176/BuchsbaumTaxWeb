<template>
    <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-lg w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
                <div
                    class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertIcon class="text-red-600" />
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 id="modal-title" class="text-lg leading-6 font-medium text-gray-900">Confirm checkout work time
                    </h3>
                    <div class="mt-2">
                        <p class="text-sm text-gray-500">Are you sure you want stop current work time?</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 sm:ml-3 sm:w-auto sm:text-sm"
                @click="confirmLogout">
                Yes, Log out
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
export default {
    name: 'LogoutConfirmationModal',
    props: {
        showing: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        confirmLogout() {
            this.$emit('confirm-logout');
            this.emitHide();
        },
        emitHide() {
            this.$emit('hide');
        },
    },
}
</script>

<style scoped>
/* Add your styles here if needed */
</style>