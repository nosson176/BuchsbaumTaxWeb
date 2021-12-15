<template>
  <div>
    <!-- This example requires Tailwind CSS v2.0+ -->
    <div v-if="showing" class="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!--
      Entering: "ease-out duration-300"
        From: "opacity-0"
        To: "opacity-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100"
        To: "opacity-0"
    -->
        <transition name="overlay-fade">
          <div v-if="showing" class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" />
        </transition>
        <!-- This element is to trick the browser into centering the modal contents. -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <transition name="card-fade">
          <div v-if="showing" class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <slot />
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    showing: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.overlay-fade-enter-active {
  transition: opacity ease-out 0.3s;
}

.overlay-fade-leave-active {
  transition: opacity ease-in 0.2s;
}

.overlay-fade-enter,
.overlay-fade-leave-to {
  @apply opacity-0;
}

.card-fade-enter-active {
  transition: opacity ease-out 0.3s;
}

.card-fade-leave-active {
  transition: opacity ease-in 0.2s;
}

.card-fade-enter,
.card-fade-leave-to {
  @apply opacity-0 translate-y-4;
}
</style>
