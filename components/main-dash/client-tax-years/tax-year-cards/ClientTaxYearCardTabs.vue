<template>
  <div class="flex w-full border-t border-gray-300 space-x-1 shadow">
    <draggable :value="filings" v-bind="dragOptions" class="flex w-full" @start="startDrag" @end="onDrop">
      <transition-group ref="group" type="transition" :name="transitionName"
        class="flex overflow-auto whitespace-nowrap" @mouseenter="mouseOver = true">
        <div v-for="(filing, idx) in filings" :key="filing.id">
          <sup class="text-[10px] text-indigo-300"> {{ isOverflowing && idx === 4 ? '&raquo;' : '' }}</sup>
          <Tab :active="idx === activeFilingIdx">
            <span v-if="displayTab(filing)" class="tab-text"
              :class="{ 'text-gray-300': !filing.taxForm && !filing.state }" @click="handleClick(idx)">
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
      localFilings: JSON.parse(JSON.stringify(this.filings)), // Create a local copy of the filings
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
        this.localFilings = JSON.parse(JSON.stringify(newVal)); // Update local copy when prop changes
        this.checkOverflow();
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
      if (evt.oldIndex < 0 || evt.oldIndex >= this.localFilings.length ||
        evt.newIndex < 0 || evt.newIndex >= this.localFilings.length) {
        console.warn('Invalid index', evt);
        return;
      }

      const subMovedItem = this.localFilings[evt.newIndex]
      const movedItem = this.localFilings.splice(evt.oldIndex, 1)[0];
      this.localFilings.splice(evt.newIndex, 0, movedItem);

      this.localFilings.forEach((filing, index) => {
        filing.sortOrder = index + 1;
      });


      this.$store.commit('updateFilingsOrder', { evt, movedItem, subMovedItem });

      this.localFilings.forEach((item) => {
        this.$api.updateFiling(this.headers, { clientId: this.selectedClient.id, filingId: item.id }, item);
      });

      this.$emit('update:filings', [...this.localFilings]);

      this.dragActive = false;
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
