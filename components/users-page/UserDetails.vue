<template>
  <div>
    <section aria-labelledby="user-information-title">
      <div class="bg-white">
        <div class="px-4 py-5 bg-gray-50 sm:px-6">
          <h2
            id="user-information-title"
            class="text-lg leading-6 font-medium text-gray-900"
            contenteditable
          >{{ username }}</h2>
        </div>
        <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">First Name</dt>
              <dd class="mt-1 text-sm text-gray-900">
                <input v-model="firstName" placeholder="First Name" />
              </dd>
            </div>
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">Last Name</dt>
              <dd class="mt-1 text-sm text-gray-900">
                <input v-model="lastName" placeholder="Last Name" />
              </dd>
            </div>
          </dl>
          <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">Privelage Set</dt>
              <dd class="mt-1 text-sm text-gray-900">
                <SelectOption v-model="userType" label="User Type" :options="['user', 'admin']" />
              </dd>
            </div>
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">Seconds in Day</dt>
              <dd class="mt-1 text-sm text-gray-900">
                <input v-model="secondsInDay" placeholder="Seconds in Day" />
              </dd>
            </div>
          </dl>
          <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">Selectable</dt>
              <dd class="mt-1 text-sm text-gray-900">
                <EditableCheckBoxCell v-model="selectable" />
              </dd>
            </div>
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">Allow Texting</dt>
              <dd class="mt-1 text-sm text-gray-900">
                <EditableCheckBoxCell v-model="allowTexting" />
              </dd>
            </div>
          </dl>
          <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">Notify of Logins</dt>
              <dd class="mt-1 text-sm text-gray-900">
                <EditableCheckBoxCell v-model="notifyOfLogins" />
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "UserDetails",
  props: {
    user: {
      type: Object,
      default: () => null,
    }
  },
  computed: {
    data () {
      return {
        editable: '',
      };
    },
    username: {
      get () {
        return this.user?.username;
      },
      set (username) {
        this.updateUser({ username });
      }
    },
    firstName: {
      get () {
        return this.user?.firstName || '';
      },
      set (firstName) {
        this.updateUser({ firstName });
      }
    },
    lastName: {
      get () {
        return this.user?.lastName || '';
      },
      set (lastName) {
        this.updateUser({ lastName });
      }
    },
    userType: {
      get () {
        return this.user?.userType || '';
      },
      set (userType) {
        this.updateUser({ userType });
      }
    },
    secondsInDay: {
      get () {
        return this.user?.secondsInDay || '';
      },
      set (secondsInDay) {
        this.updateUser({ secondsInDay });
      }
    },
    selectable: {
      get () {
        return this.user?.selectable;
      },
      set (selectable) {
        this.updateUser({ selectable });
      }
    },
    allowTexting: {
      get () {
        return this.user?.allowTexting;
      },
      set (allowTexting) {
        this.updateUser({ allowTexting });
      }
    },
    notifyOfLogins: {
      get () {
        return this.user?.notifyOfLogins;
      },
      set (notifyOfLogins) {
        this.updateUser({ notifyOfLogins });
      }
    },
    headers () {
      return this.$api.getHeaders();
    }
  },
  methods: {
    updateUser (newVal) {
      const user = Object.assign({}, this.user, newVal);
      this.$api.updateUser(this.headers, { userId: user.id }, user)
    },
  }
};
</script>

<style scoped>
</style>
