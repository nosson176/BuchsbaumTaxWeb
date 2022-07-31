<template>
  <div class="border-t border-gray-300 space-x-1 shadow">
    <draggable :value="filings" v-bind="dragOptions" @start="startDrag" @end="onDrop">
      <transition-group type="transition" :name="transitionName">
        <Tab v-for="(filing, idx) in filings" :key="filing.id" :active="idx === activeFilingIdx">
          <span
            v-if="displayTab(filing)"
            class="tab-text"
            :class="{ 'text-gray-300': !filing.taxForm && !filing.state }"
            @click="handleClick(idx)"
          >
            {{ filing.taxForm || filing.state || filing.filingType }}
          </span>
        </Tab>
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import draggable from 'vuedraggable'
import { events, filingTypes, models } from '~/shared/constants'

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
  },
}
</script>

<style scoped>
.tab-text {
  @apply uppercase;

  font-size: 10px;
}
</style>
