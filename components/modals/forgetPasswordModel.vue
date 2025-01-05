<template>
    <div>
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
                <div
                    class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 id="modal-title" class="text-lg leading-6 font-medium text-gray-900">Forgot Password</h3>
                    <div class="mt-2">
                        <p class="text-sm text-gray-500">
                            Enter your email address below, and we’ll send you instructions to reset your password.
                        </p>
                    </div>
                </div>
            </div>
            <form @submit.prevent="handleSubmit">
                <div class="mt-4">
                    <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
                    <div class="mt-1">
                        <input v-model="email" type="email" id="email"
                            class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="you@example.com" required />
                    </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse mt-4">
                    <button type="submit" :disabled="loading"
                        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 sm:ml-3 sm:w-auto sm:text-sm">
                        <span v-if="loading">Sending...</span>
                        <span v-else>Send Reset Link</span>
                    </button>
                    <button type="button"
                        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        @click="emitHide">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ForgotPasswordModal',
    data() {
        return {
            email: '',
            loading: false,
        };
    },
    computed: {
        headers() {
            return this.$api.headers();
        },
    },
    methods: {
        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },
        async handleSubmit() {
            if (!this.isValidEmail(this.email)) {
                this.$toast.error('Please enter a valid email address.');
                return;
            }
            this.loading = true;
            try {
                const response = await this.$api.forgotPassword(this.email);
                if (response.success === 'Success') {
                    this.$toast.success(response.msg)
                    this.emitHide();
                } else this.$toast.error(response.msg);
            } catch (error) {
                this.$toast.error(error.response?.data?.message || 'There was an error processing your request.');
                console.error(error);
            } finally {
                this.loading = false;
            }
        },
        emitHide() {
            this.$emit('hide');
        },
    },
};
</script>

<style scoped>
/* Add additional styling if necessary */
</style>
