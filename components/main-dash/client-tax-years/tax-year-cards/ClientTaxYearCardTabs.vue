<template>
  <div class="flex w-full border-t border-gray-300 space-x-1 shadow">
    <draggable :value="filings" v-bind="dragOptions" class="flex w-full" @start="startDrag" @end="onDrop">
      <transition-group
        ref="group"
        type="transition"
        :name="transitionName"
        class="flex overflow-auto whitespace-nowrap"
        @mouseenter="mouseOver = true"
      >
        <div v-for="(filing, idx) in filings" :key="filing.id">
          <sup class="text-[10px] text-indigo-300"> {{ isOverflowing && idx === 4 ? '&raquo;' : '' }}</sup>
          <Tab :active="idx === activeFilingIdx">
            <span
              v-if="displayTab(filing)"
              class="tab-text"
              :class="{ 'text-gray-300': !filing.taxForm && !filing.state }"
              @click="handleClick(idx)"
            >
              {{ filing.taxForm || filing.state || filing.filingType }}
            </span>
          </Tab>
        </div>
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import draggable from 'vuedraggable'
import { events, filingTypes, models, TRANSITION_NAME } from '~/shared/constants'

export default {
  name: 'ClientTaxYearCardTabs',
  components: { draggable },
  props: {
    filings: {
      type: Array,
      default: () => [],
    },
    activeFilingIdx: {
      type: Number,
      default: NaN,
    },
    taxYear: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      isOverflowing: false,
      mouseOver: false,
      dragActive: false,
      dragOptions: {
        animation: 200,
        ghostClass: 'ghost',
        direction: 'vertical',
      },
    }
  },
  computed: {
    ...mapState([models.selectedClient]),
    headers() {
      return this.$api.getHeaders()
    },
    transitionName() {
      if (!this.dragActive) {
        return TRANSITION_NAME
      }
      return null
    },
  },
  watch: {
    filings: {
      handler(newVal) {
        this.checkOverflow()
      },
      deep: true,
    },
  },
  mounted() {
    this.isOverflowing = this.checkOverflow()
  },
  methods: {
    handleClick(filingIdx) {
      this.emitClick(filingIdx)
    },
    emitClick(filingIdx) {
      return this.$emit(events.click, filingIdx)
    },
    displayTab(filing) {
      return filing.filingType !== filingTypes.ext && filing.filingType !== filingTypes.fbar
    },
    startDrag() {
      this.dragActive = true
    },
    onDrop(evt) {
      const item = JSON.parse(JSON.stringify(this.filings))[evt.oldIndex]
      item.sortOrder = evt.newIndex + 1
      this.$api.updateFiling(this.headers, { clientId: this.selectedClient.id, filingId: item.id }, item)
      this.dragActive = false
    },
    checkOverflow() {
      const el = this.$refs.group.$el
      const curOverflow = el.style.overflow

      if (!curOverflow || curOverflow === 'visible') el.style.overflow = 'hidden'

      const isOverflowing = el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight

      el.style.overflow = curOverflow

      return isOverflowing
    },
  },
}
</script>

<style scoped>
.tab-text {
  @apply uppercase;

  font-size: 10px;
}
</style>
