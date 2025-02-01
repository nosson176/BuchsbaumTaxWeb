<template>
    <div @keydown.enter="confirmWorkTime" tabindex="0">
        <div class="bg-white sm:rounded-lg">
            <div class="p-5">
                <h3 class="text-lg font-medium text-gray-900">Please confirm your work time</h3>
                <div class="mt-2">
                    <p class="text-sm text-gray-500">Do you want to record your current work time?</p>
                </div>
            </div>
            <div class="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="button"
                    class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm"
                    @click="confirmWorkTime">Yes</button>
                <button type="button"
                    class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
                    @click="emitHide">No</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WorkTimeModel',
    props: {
        userData: Object,
    },
    mounted() {
        // Ensure the modal can catch the Enter key press
        this.$nextTick(() => {
            this.$el.focus()
        })
    },

    methods: {
        confirmWorkTime() {
            this.$emit('confirm', this.userData)
        },
        emitHide() {
            this.$emit('hide')
        },
    },
}
</script>

<style scoped>
/* Add your styles here */
</style>