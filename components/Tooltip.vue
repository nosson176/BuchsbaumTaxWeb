<script>
import { PopperWrapper } from 'floating-vue'

export default {
  ...PopperWrapper,
  name: 'Tooltip',
  vPopperTheme: 'info-tooltip',
}
</script>

<style>
.v-popper--theme-info-tooltip .v-popper__inner {
  @apply bg-blue-100 border-none border w-full h-full text-gray-900 rounded p-2 text-xs text-center bg-opacity-95;
}

.v-popper--theme-info-tooltip .v-popper__arrow-outer {
  @apply border-blue-100;
}
</style>
