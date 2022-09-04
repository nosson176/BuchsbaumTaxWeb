<template>
  <div>
    <div
      v-if="showing"
      class="fixed z-20 inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <transition name="overlay-fade">
          <div
            v-if="showing"
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            aria-hidden="true"
            @click="emitHide"
          />
        </transition>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <transition name="card-fade">
          <div
            v-if="showing"
            class="inline-block align-bottom bg-white text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full"
            :class="modalMaxWidth"
          >
            <slot />
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { events } from '~/shared/constants'

export default {
  name: 'Modal',
  props: {
    showing: {
      type: Boolean,
      default: false,
    },
    fullWidth: {
      type: Boolean,
      default: false,
    },
    wide: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    modalMaxWidth() {
      if (this.fullWidth) {
        return 'sm:max-w-full'
      } else if (this.wide) {
        return 'sm:max-w-2xl'
      } else {
        return 'sm:max-w-lg'
      }
    },
  },
  methods: {
    emitHide() {
      this.$emit(events.hide)
    },
  },
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
