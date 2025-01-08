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
          <div class="relative">
            <FormInput id="password" v-model="formModel.password.input" name="password"
              :type="isPasswordVisible ? 'text' : 'password'" autocomplete="current-password" label="Password"
              placeholder="Password" required />
            <!-- אייקון לצד שדה הסיסמה -->
            <span class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              @click="togglePasswordVisibility">
              <template v-if="isPasswordVisible">
                <!-- אייקון Hide Password -->
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5">
                  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                  <path fill-rule="evenodd"
                    d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                    clip-rule="evenodd" />
                </svg>
              </template>
              <template v-else>
                <!-- אייקון Show Password -->
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5">
                  <path
                    d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
                  <path
                    d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
                  <path
                    d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
                </svg>


              </template>
            </span>
          </div>

        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input id="remember-me" v-model="formModel.rememberMe" name="remember-me" type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900"> Remember me </label>
          </div>
          <div class="text-sm">
            <a href="#" @click="displayForgetPasswordModel" class="font-medium text-indigo-600 hover:text-indigo-500">
              Forgot your password? </a>
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
      <Modal :showing="showForgetPasswordModel" @hide="closeForgetPasswordModel">
        <forgetPasswordModel @hide="closeForgetPasswordModel" />
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
      showForgetPasswordModel: false,
      isPasswordVisible: false
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
          if (typeof (response) === "number") {
            throw new TypeError('Unauthorized');
          }
          return response;
        })
        .then(async (data) => {
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
    displayForgetPasswordModel() {
      this.showForgetPasswordModel = true

    },
    closeForgetPasswordModel() {
      this.showForgetPasswordModel = false
    },
    togglePasswordVisibility() {
      this.isPasswordVisible = !this.isPasswordVisible;
    },
  },
}
</script>

.relative {
position: relative;
}

.absolute {
position: absolute;
}

.inset-y-0 {
top: 0;
bottom: 0;
}

.right-0 {
right: 0;
}

.pr-3 {
padding-right: 0.75rem;
}

.flex {
display: flex;
}

.items-center {
align-items: center;
}

.cursor-pointer {
cursor: pointer;
}

.text-gray-500 {
color: #6b7280;
}

.h-5 {
height: 1.25rem;
}

.w-5 {
width: 1.25rem;
}
