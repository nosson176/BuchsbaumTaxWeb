<template>
  <div class="p-0 overflow-auto flex flex-grow">
    <dl class="divide-y divide-gray-200">
      <ClientTaxYearCardFilingInfoItem>
        <template #label>
          Tax Form
        </template>
        <template #value>
          {{ filing.taxForm }}
        </template>
      </ClientTaxYearCardFilingInfoItem>
      <ClientTaxYearCardFilingInfoItem>
        <template #label>
          Status
        </template>
        <template #value>
          {{ filing.status }}
        </template>
      </ClientTaxYearCardFilingInfoItem>
      <ClientTaxYearCardFilingInfoItem>
        <template #label>
          Detail
        </template>
        <template #value>
          {{ filing.statusDetail }}
        </template>
      </ClientTaxYearCardFilingInfoItem>
      <ClientTaxYearCardFilingInfoItem>
        <template #label>
          Date
        </template>
        <template #value>
          {{ formatDate(filing.statusDate) }}
        </template>
      </ClientTaxYearCardFilingInfoItem>
      <ClientTaxYearCardFilingInfoItem>
        <template #label>
          Memo
        </template>
        <template #value>
          {{ filing.memo }}
        </template>
      </ClientTaxYearCardFilingInfoItem>
      <ClientTaxYearCardFilingInfoItem>
        <template #label>
          <div class="flex items-center h-5 mr-1">
            <input
              id="includeRefund"
              :checked="filing.includeInRefund"
              name="disabled"
              type="checkbox"
              class="h-3 w-3 pointer-events-none"
              disabled
            >
          </div>
          Owes/Paid
        </template>
        <template #value>
          {{ formatAsILCurrency(filing.owes) }}/{{ formatAsILCurrency(filing.paid) }}
        </template>
      </ClientTaxYearCardFilingInfoItem>
      <ClientTaxYearCardFilingInfoItem>
        <template #label>
          <div class="flex items-center h-5 mr-1">
            <input
              id="includeFee"
              :checked="filing.includeFee"
              name="disabled"
              type="checkbox"
              class="h-3 w-3 pointer-events-none"
              disabled
            >
          </div>
          FC/Insur
        </template>
        <template #value>
          {{ formatAsILCurrency(filing.owesFee) }}/{{ formatAsILCurrency(filing.paidFee) }}
        </template>
      </ClientTaxYearCardFilingInfoItem>
      <ClientTaxYearCardFilingInfoItem>
        <template #label>
          File Type
        </template>
        <template #value>
          {{ filing.fileType }}
        </template>
      </ClientTaxYearCardFilingInfoItem>
      <ClientTaxYearCardFilingInfoItem>
        <template #label>
          Refund
        </template>
        <template #value>
          {{ formatAsUSCurrency(filing.refund) }}
        </template>
      </ClientTaxYearCardFilingInfoItem>
      <ClientTaxYearCardFilingInfoItem>
        <template #label>
          Rebate
        </template>
        <template #value>
          {{ formatAsUSCurrency(filing.rebate) }}
        </template>
      </ClientTaxYearCardFilingInfoItem>
      <ClientTaxYearCardFilingInfoItem>
        <template #label>
          Sum
        </template>
        <template #value>
          {{ formatAsUSCurrency(filing.refund-filing.rebate) }}
        </template>
      </ClientTaxYearCardFilingInfoItem>
      <ClientTaxYearCardFilingInfoItem>
        <template #label>
          Delivery 1
        </template>
        <template #value>
          {{ filing.deliveryContact }}
        </template>
      </ClientTaxYearCardFilingInfoItem>
      <ClientTaxYearCardFilingInfoItem>
        <template #label>
          Delivery 2
        </template>
        <template #value>
          {{ filing.secondDeliveryContact }}
        </template>
      </ClientTaxYearCardFilingInfoItem>
      <ClientTaxYearCardFilingInfoItem>
        <template #label>
          Date Filed
        </template>
        <template #value>
          {{ formatDate(filing.dateFiled) }}
        </template>
      </ClientTaxYearCardFilingInfoItem>
    </dl>
  </div>
</template>

<script>
import { formatAsILCurrency, formatAsUSCurrency } from '~/shared/utility'
import { formatDateForTable } from '~/shared/domain-utilities'

export default {
  name: 'ClientTaxYearCardFilingInfo',
  props: {
    filing: {
      type: Object,
      default: () => null
    }
  },
  methods: {
    formatDate (date) {
      return date ? formatDateForTable(date) : ''
    },
    formatAsILCurrency (amt) {
      return formatAsILCurrency(amt)
    },
    formatAsUSCurrency (amt) {
      return formatAsUSCurrency(amt)
    }
  }
}
</script>

<style scoped>

</style>
