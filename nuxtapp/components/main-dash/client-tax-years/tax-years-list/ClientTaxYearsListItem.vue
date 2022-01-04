<template>
  <div>
    <div class="flex h-16 px-1 py-1 border border-gray-300 border-opacity-0 hover:border-opacity-100 space-x-1" :class="classObj" @click="toggleShowing">
      <div class="text-xs tracking-tighter cursor-pointer w-full">
        <div class="flex flex-col space-y-3">
          <div class="flex">
            <span class="font-bold mr-2">{{ year }}</span>
            <span> {{ status }}</span>
            <span class="ml-auto">{{ owes }}</span>
          </div>
          <div class="flex">
            <span class="mr-2"> {{ taxForm }}</span>
            <span>{{ statusDetail }}</span>
            <span class="ml-auto">{{ paid }}</span>
          </div>
        </div>
      </div>
      <div class="flex flex-col items-center w-3 space-y-3.5">
        <CheckBoxWithEyeIcon v-model="showing" />
        <TrashIcon class="cursor-pointer hover:text-indigo-600" @click="onDeleteClick()" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { events, filingTypes, models } from '~/shared/constants'
import { formatAsILCurrency } from '~/shared/utility'
export default {
  name: 'ClientTaxYearsListItem',
  props: {
    idx: {
      type: Number,
      default: NaN
    },
    taxYear: {
      type: Object,
      default: () => null
    }
  },
  computed: {
    ...mapState([models.shownTaxYears]),
    federalFilingInfo () {
      return this.taxYear.filings.filter(filing => filing.filingType === filingTypes.federal)[0]
    },
    year () {
      return this.taxYear.year
    },
    status () {
      return this.federalFilingInfo?.status
    },
    owes () {
      return this.federalFilingInfo?.owes ? this.formatAsILS(this.federalFilingInfo.owes).split('.')[0] : ''
    },
    taxForm () {
      return this.federalFilingInfo?.taxForm
    },
    statusDetail () {
      return this.federalFilingInfo?.statusDetail
    },
    paid () {
      return this.federalFilingInfo?.paid ? this.formatAsILS(this.federalFilingInfo.paid).split('.')[0] : ''
    },
    classObj () {
      const even = this.idx % 2 === 0
      return { even }
    },
    showing: {
      get () {
        return this.shownTaxYears.includes(this.taxYear.id)
      },
      set (newVal) {
        this.$emit(events.change, newVal)
      }
    }
  },
  methods: {
    formatAsILS (amt) {
      return formatAsILCurrency(amt)
    },
    toggleShowing () {
      this.showing = !this.showing
    },
    onDeleteClick () {
      this.$emit(events.delete, this.taxYear.id)
    }
  }
}
</script>

<style scoped>
  .even {
    @apply bg-gray-50;
  }
</style>
