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
        <FormInput
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
        <FormInput
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
          <input id="remember-me" v-model="formModel.rememberMe" name="remember-me" type="checkbox" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
          <label for="remember-me" class="ml-2 block text-sm text-gray-900">
            Remember me
          </label>
        </div>

        <div class="text-sm">
          <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">
            Forgot your password?
          </a>
        </div>
      </div>

      <div v-if="loginError" class="text-red-500 text-xs">
        Incorrect username or password, please try again
      </div>

      <div>
        <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <span class="absolute left-0 inset-y-0 flex items-center pl-3">
            <LockIcon class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
          </span>
          Sign in
        </button>
      </div>
    </form>
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
    rememberMe: false
  }
}
export default {
  name: 'Login',
  data () {
    return {
      formModel: null,
      loginError: false
    }
  },
  computed: {
    loginPayload () {
      return {
        username: this.formModel.username.input,
        password: this.formModel.password.input
      }
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
    }
  },
  created () {
    this.formModel = loginFormConstructor()
  },
  methods: {
    handleSubmit () {
      this.$api.login(this.loginPayload)
        .then((data) => {
          this.setSessionKey(data)
          this.routeToMainDash()
        })
        .catch((e) => {
          this.loginError = true
        })
    },
    setSessionKey ({ token }) {
      if (this.rememberMe) {
        setCookieByKey(COOKIE_KEY_SESSION_TOKEN, token, { expires: 365 })
      } else {
        setCookieByKey(COOKIE_KEY_SESSION_TOKEN, token, { expires: null })
      }
    },
    routeToMainDash () {
      this.$router.replace({ name: routes.root })
    },
    notifyFailure () {
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
