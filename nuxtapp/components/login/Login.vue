<template>
  <div class="max-w-md w-full space-y-8">
    <div>
      <img class="mx-auto h-20 w-auto filter drop-shadow-lg" src="@/assets/images/btax-logo.png" alt="Workflow">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Sign in to your account
      </h2>
    </div>
    <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
      <input type="hidden" name="remember" value="true">
      <div class="rounded-md shadow-sm -space-y-px">
        <FormInputType1
          id="username"
          v-model="formModel.username.input"
          name="username"
          type="username"
          autocomplete="username"
          label="Username"
          placeholder="Username"
          first
          required
        />
        <FormInputType1
          id="password"
          v-model="formModel.password.input"
          name="password"
          type="password"
          autocomplete="current-password"
          label="Password"
          placeholder="Password"
          last
          required
        />
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded">
          <label for="remember-me" class="ml-2 block text-sm text-gray-900">
            Remember me
          </label>
        </div>

        <div class="text-sm">
          <a href="#" class="font-medium text-yellow-600 hover:text-yellow-500">
            Forgot your password?
          </a>
        </div>
      </div>

      <div>
        <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
          <span class="absolute left-0 inset-y-0 flex items-center pl-3">
            <LockIcon class="h-5 w-5 text-yellow-500 group-hover:text-yellow-400" />
          </span>
          Sign in
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  A_CLIENT_SET_NOTIFICATION,
  A_INIT_AUTHENTICATED_USER_MODULE,
  A_SET_SESSION_TOKEN, GET_BACKEND_URL,
  LOADING_COMPLETED_FAILURE,
  LOADING_COMPLETED_SUCCESS,
  LOADING_STARTED,
  NOTIFICATION_TYPE_ALERT,
  ROUTE_RESET_PASSWORD,
  ROUTE_ROOT
} from '~/shared/constants'
import { asyncObjectConstructor } from '@/shared/utility'
import { isNameValid, isPasswordValid } from '@/shared/domain-utilities'
import { notificationConstructor } from '@/shared/constructors'

const loginFormConstructor = () => {
  return {
    username: { input: '', isValid: true },
    password: { input: '', isValid: true },
    rememberMe: false
  }
}
export default {
  name: 'Login',
  data () {
    return {
      formModel: null,
      loginState: asyncObjectConstructor()
    }
  },
  computed: {
    ...mapGetters([GET_BACKEND_URL]),
    backendUrl () {
      return `${this[GET_BACKEND_URL]}/api/sessions`
    },
    resetPasswordRouteObj () {
      return { name: ROUTE_RESET_PASSWORD }
    },
    loginPayload () {
      return {
        username: this.formModel.username.input,
        password: this.formModel.password.input
      }
    },
    routeObj () {
      return { name: ROUTE_ROOT }
    },
    isSubmitButtonDisabled () {
      return !this.isFormValid || this.isLoading
    },
    isFormValid () {
      return this.isPasswordValid && this.isNameValid
    },
    isNameValid () {
      return isNameValid(this.formModel.username.input)
    },
    isPasswordValid () {
      return isPasswordValid(this.formModel.password.input)
    },
    isLoading () {
      return this.loginState.loadingState === LOADING_STARTED
    }
  },
  created () {
    this.formModel = loginFormConstructor()
  },
  methods: {
    async handleSubmit () {
      if (!this.isSubmitButtonDisabled) {
        await this.login()
        if (this.loginState.loadingState === LOADING_COMPLETED_SUCCESS) {
          const token = this.loginState.data.token
          const rememberMe = this.formModel.rememberMe || true
          await this.setSession({ token, rememberMe })
          await this.$store.dispatch(A_INIT_AUTHENTICATED_USER_MODULE)
        }
        this.redirect()
      } else {
        this.setErrorsOnLabels()
      }
    },
    async login () {
      this.loginState.loadingState = LOADING_STARTED
      try {
        const loginResponse = await this.$axios.post(this.backendUrl, this.loginPayload)
        if (loginResponse.data.token) {
          this.loginState.loadingState = LOADING_COMPLETED_SUCCESS
          this.loginState.data = loginResponse.data
        } else {
          this.loginState.loadingState = LOADING_COMPLETED_FAILURE
          this.notifyFailure()
        }
      } catch (e) {
        this.loginState.loadingState = LOADING_COMPLETED_FAILURE
        this.loginState.error = e
        this.notifyFailure()
      }
    },
    async setSession ({ token, rememberMe }) {
      await this.$store.dispatch(A_SET_SESSION_TOKEN, { token, rememberMe })
    },
    redirect () {
      if (this.loginState.loadingState === LOADING_COMPLETED_SUCCESS) {
        this.$router.replace(this.routeObj)
      }
    },
    notifyFailure () {
      const notification = notificationConstructor()
      notification.time = 5000
      notification.type = NOTIFICATION_TYPE_ALERT
      notification.message = 'Failed to login'
      this.$store.dispatch(A_CLIENT_SET_NOTIFICATION, { notification })
    },
    setErrorsOnLabels () {
      if (!this.isNameValid) {
        this.formModel.username.isValid = false
      }
      if (!this.isPasswordValid) {
        this.formModel.password.isValid = false
      }
    }
  }
}
</script>
