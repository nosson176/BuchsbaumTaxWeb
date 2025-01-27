<template>
    <!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" :class="classObj" @click="emitClick">
      <path
        fill-rule="evenodd"
        d="M3 2.25a.75.75 0 01.75.75v.54l1.838-.46a9.75 9.75 0 016.725.738l.108.054a8.25 8.25 0 005.58.652l3.109-.732a.75.75 0 01.917.81 47.784 47.784 0 00.005 10.337.75.75 0 01-.574.812l-3.114.733a9.75 9.75 0 01-6.594-.77l-.108-.054a8.25 8.25 0 00-5.69-.625l-2.202.55V21a.75.75 0 01-1.5 0V3A.75.75 0 013 2.25z"
        clip-rule="evenodd"
      />
    </svg> -->
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke-width="1.5" :class="classObj"
        @click="emitClick" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round"
            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
    </svg>

</template>

<script>
import { events } from '~/shared/constants'

export default {
    name: 'StarIcon',
    props: {
        color: {
            type: Number,
            default: 4,
        },
    },
    computed: {
        classObj() {
            switch (this.color) {
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