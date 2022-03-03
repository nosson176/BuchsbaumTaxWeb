<template>
  <div>
    <section aria-labelledby="user-information-title">
      <div class="bg-white">
        <div class="px-4 py-5 bg-gray-50 sm:px-6">
          <h2
            id="user-information-title"
            class="text-lg leading-6 font-medium text-gray-900"
            contenteditable
          >{{ user.username }}</h2>
        </div>
        <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">Privelage Set</dt>
              <dd contenteditable class="mt-1 text-sm text-gray-900">{{ user.userType }}</dd>
            </div>
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">Allow Texting</dt>
              <dd class="mt-1 text-sm text-gray-900">
                <CheckBoxToDisplayTrueFalse :value="allowTexting" />
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
    allowTexting: {
      get () {
        return this.user.allowTexting;
      }, set (value) {
        this.formModel.allowTexting = value;
      }
    }
  }
};
</script>

<style scoped>
</style>
