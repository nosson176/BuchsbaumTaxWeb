<template>
  <div class="p-2 overflow-auto flex flex-grow">
    <dl class="w-full grid grid-cols-1 gap-x-1 gap-y-4 sm:grid-cols-2">
      <ClientTaxYearCardFilingInfoItem>
        <template v-if="taxForm" #value>
          {{ taxForm }}
        </template>
        <template v-else #label>
          Tax Form
        </template>
      </ClientTaxYearCardFilingInfoItem>
      <ClientTaxYearCardFilingInfoItem>
        <template v-if="status" #value>
          {{ status }}
        </template>
        <template v-else #label>
          Status
        </template>
      </ClientTaxYearCardFilingInfoItem>
      <ClientTaxYearCardFilingInfoItem>
        <template v-if="statusDetail" #value>
          {{ statusDetail }}
        </template>
        <template v-else #label>
          Detail
        </template>
      </ClientTaxYearCardFilingInfoItem>
      <ClientTaxYearCardFilingInfoItem>
        <template v-if="statusDate" #value>
          {{ formattedStatusDate }}
        </template>
        <template v-else #label>
          Date
        </template>
      </ClientTaxYearCardFilingInfoItem>
      <ClientTaxYearCardFilingInfoItem>
        <template v-if="memo" #value>
          {{ memo }}
        </template>
        <template v-else #label>
          Memo
        </template>
      </ClientTaxYearCardFilingInfoItem>
      <!-- spacing -->
      <div />
      <div />
      <div />
      <!-- end of spacing -->
      <ClientTaxYearCardFilingInfoItem>
        <template #label>
          <CheckBoxToDisplayTrueFalse id="includeInRefund" name="includeInRefund" disabled :checked="includeInRefund" />
          Owes/Paid
        </template>
        <template v-if="hasOwesOrPaid" #value>
          <span v-if="hasOwes"> {{ formattedOwes }}</span>/<span v-if="hasPaid">{{ formattedPaid }}</span>
        </template>
      </ClientTaxYearCardFilingInfoItem>
      <ClientTaxYearCardFilingInfoItem>
        <template #label>
          <CheckBoxToDisplayTrueFalse id="includeFee" name="includeFee" disabled :checked="includeFee" />
          FC/Insur
        </template>
        <template v-if="hasOwesFeeOrPaidFee" #value>
          <span v-if="hasOwesFee"> {{ formatTedOwesFee }}</span>/<span v-if="hasPaidFee">{{ formattedPaidFee }}</span>
        </template>
      </ClientTaxYearCardFilingInfoItem>
      <ClientTaxYearCardFilingInfoItem>
        <template v-if="fileType" #value>
          {{ fileType }}
        </template>
        <template v-else #label>
          File Type
        </template>
      </ClientTaxYearCardFilingInfoItem>
      <ClientTaxYearCardFilingInfoItem>
        <template v-if="refund" #value>
          {{ formattedRefund }}
        </template>
        <template v-else #label>
          Refund
        </template>
      </ClientTaxYearCardFilingInfoItem>
      <ClientTaxYearCardFilingInfoItem>
        <template v-if="rebate" #value>
          {{ formattedRebate }}
        </template>
        <template v-else #label>
          Rebate
        </template>
      </ClientTaxYearCardFilingInfoItem>
      <!-- spacing -->
      <div />
      <!-- end of spacing -->
      <ClientTaxYearCardFilingInfoItem>
        <template v-if="hasSum" #value>
          {{ formattedSum }}
        </template>
        <template v-else #label>
          Sum
        </template>
      </ClientTaxYearCardFilingInfoItem>
      <ClientTaxYearCardFilingInfoItem>
        <template v-if="deliveryContact" #value>
          {{ deliveryContact }}
        </template>
        <template v-else #label>
          Delivery 1
        </template>
      </ClientTaxYearCardFilingInfoItem>
      <ClientTaxYearCardFilingInfoItem>
        <template v-if="secondDeliveryContact" #value>
          {{ secondDeliveryContact }}
        </template>
        <template v-else #label>
          Delivery 2
        </template>
      </ClientTaxYearCardFilingInfoItem>
      <ClientTaxYearCardFilingInfoItem>
        <template v-if="dateFiled" #value>
          {{ formattedDateFiled }}
        </template>
        <template v-else #label>
          Date Filed
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
  computed: {
    taxForm () {
      return this.filing.taxForm
    },
    status () {
      return this.filing.status
    },
    statusDetail () {
      return this.filing.statusDetail
    },
    statusDate () {
      return this.filing.statusDate
    },
    formattedStatusDate () {
      return this.formatDate(this.statusDate)
    },
    memo () {
      return this.filing.memo
    },
    includeInRefund () {
      return this.filing.includeInRefund
    },
    owes () {
      return this.filing.owes
    },
    formattedOwes () {
      return this.formatAsILCurrency(this.owes)
    },
    paid () {
      return this.filing.paid
    },
    formattedPaid () {
      return this.formatAsILCurrency(this.paid)
    },
    hasOwes () {
      return this.owes
    },
    hasPaid () {
      return this.paid
    },
    hasOwesOrPaid () {
      return this.hasOwes || this.hasPaid
    },
    includeFee () {
      return this.filing.includeFee
    },
    owesFee () {
      return this.filing.owesFee
    },
    formattedOwesFee () {
      return this.formatAsILCurrency(this.owesFee)
    },
    paidFee () {
      return this.filing.paidFee
    },
    formattedPaidFee () {
      return this.formatAsILCurrency(this.paidFee)
    },
    hasOwesFee () {
      return this.owesFee
    },
    hasPaidFee () {
      return this.paidFee
    },
    hasOwesFeeOrPaidFee () {
      return this.hasOwesFee || this.hasPaidFee
    },
    fileType () {
      return this.filing.fileType
    },
    refund () {
      return this.filing.refund
    },
    formattedRefund () {
      return formatAsUSCurrency(this.refund)
    },
    rebate () {
      return this.filing.rebate
    },
    formattedRebate () {
      return formatAsUSCurrency(this.rebate)
    },
    hasSum () {
      return this.refund || this.rebate
    },
    sum () {
      return this.refund - this.rebate
    },
    formattedSum () {
      return formatAsUSCurrency(this.sum)
    },
    deliveryContact () {
      return this.filing.deliveryContact
    },
    secondDeliveryContact () {
      return this.filing.secondDeliveryContact
    },
    dateFiled () {
      return this.filing.dateFiled
    },
    formattedDateFiled () {
      return this.formatDate(this.dateFiled)
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
