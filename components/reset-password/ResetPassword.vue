<template>
    <div class="max-h-screen flex items-center justify-center bg-gray-100">
        <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
            <h2 class="text-2xl font-semibold text-center text-gray-800 mb-6">שחזור סיסמה</h2>
            <form @submit.prevent="handleSubmit">
                <div class="mb-4">
                    <label for="password" class="block text-sm font-medium text-gray-700">סיסמה חדשה:</label>
                    <input v-model="password" type="password" id="password"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required placeholder="הזן סיסמה חדשה" />
                </div>
                <div class="mb-4">
                    <label for="confirmPassword" class="block text-sm font-medium text-gray-700">אשר סיסמה חדשה:</label>
                    <input v-model="confirmPassword" type="password" id="confirmPassword"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required placeholder="אשר את הסיסמה החדשה" />
                </div>
                <div class="flex items-center justify-between">
                    <button type="submit" :disabled="isLoading"
                        class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400">
                        {{ isLoading ? 'מעדכן...' : 'עדכן סיסמה' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>


<script>
import { routes } from '~/shared/constants';

export default {
    data() {
        return {
            password: '',
            confirmPassword: '',
            isLoading: false,
        };
    },
    methods: {
        async handleSubmit() {
            if (this.password !== this.confirmPassword) {
                this.$toast.error('הסיסמאות לא תואמות');
                return;
            }

            if (this.password.length < 6) {
                this.$toast.error('סיסמה חייבת להיות באורך של לפחות 6 תווים');
                return;
            }

            const token = this.$route.query.token;
            this.isLoading = true;

            try {
                const response = await this.$api.resetPassword({ token, password: this.password });
                this.$toast.success(response.msg || 'סיסמה עודכנה בהצלחה');
                this.homeRoute();
            } catch (error) {
                const message = error.response?.data?.message || 'שגיאה בעדכון הסיסמה';
                this.$toast.error(message);
            } finally {
                this.isLoading = false;
            }
        },
        homeRoute() {
            this.$router.push({ name: routes.login });
        },
    }
};
</script>
