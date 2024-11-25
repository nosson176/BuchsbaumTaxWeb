<template>
  <div class="relative">
    <div class="max-w-md w-full space-y-8">
      <div>
        <img class="mx-auto h-20 w-auto filter drop-shadow-lg" src="@/assets/images/btax-logo.png" alt="Workflow" />
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <input type="hidden" name="remember" value="true" />
        <div class="rounded-md shadow-sm -space-y-px">
          <FormInput id="username" v-model="formModel.username.input" name="username" type="username"
            autocomplete="username" label="Username" placeholder="Username" first required />
          <FormInput id="password" v-model="formModel.password.input" name="password" type="password"
            autocomplete="current-password" label="Password" placeholder="Password" last required />
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input id="remember-me" v-model="formModel.rememberMe" name="remember-me" type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900"> Remember me </label>
          </div>
          <div class="text-sm">
            <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500"> Forgot your password? </a>
          </div>
        </div>
        <div v-if="loginError" class="text-red-500 text-xs">Incorrect username or password, please try again</div>
        <div>
          <button type="submit" :disabled="isSubmitButtonDisabled"
            class="relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <span class="absolute left-200 inset-y-0 flex items-center pl-3" v-if="isLoading">
              <svg class="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.001 8.001 0 0112 4.472v3.32l-2.539 2.54zm10.956-2.539A8.001 8.001 0 0112 19.528v-3.32l2.539-2.54z">
                </path>
              </svg>
            </span>
            <span class="flex items-center justify-center" v-if="!isLoading">
              <LockIcon class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
              <span class="ml-2">Sign in</span>
            </span>
          </button>
        </div>
      </form>
      <Modal :showing="showWorkTimeModal" @hide="closeWorkTimeModal">
        <WorkTimeModel :userData="loginData" @confirm="createWorkTime" @hide="closeWorkTimeModal" />
      </Modal>
    </div>
  </div>
</template>

<script>
import { COOKIE_KEY_SESSION_TOKEN, routes } from '~/shared/constants'
import { isNameValid, isPasswordValid } from '@/shared/domain-utilities'
import { setCookieByKey } from '@/shared/cookie-utilities'


const loginFormConstructor = () => {
  return {
    username: { input: '', isValid: true },
    password: { input: '', isValid: true },
    rememberMe: false,
  }
}

export default {
  name: 'Login',

  data() {
    return {
      formModel: null,
      loginError: false,
      isLoading: false,
      loginData: null,
      showWorkTimeModal: false,
    }
  },
  computed: {
    loginPayload() {
      return {
        username: this.formModel.username.input,
        password: this.formModel.password.input,
      }
    },
    isSubmitButtonDisabled() {
      return !this.isFormValid || this.isLoading
    },
    isFormValid() {
      return this.isPasswordValid && this.isNameValid
    },
    isNameValid() {
      return isNameValid(this.formModel.username.input)
    },
    isPasswordValid() {
      return isPasswordValid(this.formModel.password.input)
    },
  },
  created() {
    this.formModel = loginFormConstructor()
  },
  methods: {
    handleSubmit() {
      this.isLoading = true;
      this.$api.login(this.loginPayload)
        .then((response) => {
          console.log(response)
          if (typeof (response) === "number") {
            throw new TypeError('Unauthorized');
          }
          return response;
        })
        .then(async (data) => {
          console.log(data);
          await this.setSessionKey(data);
          this.loginData = data;
          this.showWorkTimeModal = true;
        })
        .catch((error) => {
          console.error('Login error:', error.response || error);
          this.loginError = true;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    setSessionKey({ token }) {
      if (this.formModel.rememberMe) {
        return setCookieByKey(COOKIE_KEY_SESSION_TOKEN, token, { expires: 365 })
      } else {
        return setCookieByKey(COOKIE_KEY_SESSION_TOKEN, token)
      }
    },
    routeToMainDash() {
      this.$router.replace({ name: routes.root })
    },
    createWorkTime(data) {
      const now = new Date()
      const startDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
      const headers = this.$api.getHeaders()
      this.$api.createWorkTime(headers, data.userId, data.username, startDay)
      this.routeToMainDash()
    },
    closeWorkTimeModal() {
      this.showWorkTimeModal = false
      this.routeToMainDash()
    },
  },
}
</script>

<style scoped>
/* Add your styles here */
</style>
