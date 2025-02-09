<template>
  <div @click="emitClick">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" :class="classObj">
      <path fill-rule="evenodd"
        d="M3 2.25a.75.75 0 01.75.75v.54l1.838-.46a9.75 9.75 0 016.725.738l.108.054a8.25 8.25 0 005.58.652l3.109-.732a.75.75 0 01.917.81 47.784 47.784 0 00.005 10.337.75.75 0 01-.574.812l-3.114.733a9.75 9.75 0 01-6.594-.77l-.108-.054a8.25 8.25 0 00-5.69-.625l-2.202.55V21a.75.75 0 01-1.5 0V3A.75.75 0 013 2.25z"
        clip-rule="evenodd" />
    </svg>
  </div>
</template>


<script>
import { events } from '~/shared/constants'

export default {
  name: 'FlagIcon',
  props: {
    color: {
      type: [Number, String],
      default: 4,
    },
  },
  computed: {
    classObj() {
      switch (this.color) {
        case 11:
          return { white: true }
        case 1:
          return { black: true }
        case 2:
          return { blue: true }
        case 3:
          return { green: true }
        case 5:
          return { orange: true }
        case 6:
          return { pink: true }
        case 7:
          return { purple: true }
        case 8:
          return { red: true }
        case 9:
          return { turquoise: true }
        case 10:
          return { yellow: true }
        default:
          return { white: true }
      }
    },
  },
  methods: {
    emitClick() {
      this.$emit(events.click)
    },
  },
}
</script>

<style scoped>
.pink {
  @apply text-pink-500;
}

.green {
  @apply text-green-200;
}

.blue {
  @apply text-blue-200;
}

.yellow {
  @apply text-yellow-200;
}

.red {
  @apply text-red-500;
}

.orange {
  @apply text-yellow-500;
}

.turquoise {
  @apply text-green-600;
}

.purple {
  @apply text-purple-500;
}

.black {
  @apply text-black;
}

.white {
  @apply text-white;
}
</style>
