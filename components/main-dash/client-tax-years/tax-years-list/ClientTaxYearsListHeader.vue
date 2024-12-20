<template>
  <div class="flex flex-col bg-blue-200 px-1 justify-between z-10 shadow">
    <div class="flex justify-between items-center">
      <AddRowButton @click="onAddRowClick" />
      <ViewArchivedHeader :view-active="!showArchived" @change="emitChange" />
    </div>
    <table class="text-xs my-1">
      <tr>
        <td>{{ owesDollars }}</td>
        <td>{{ owesShekels }}</td>
      </tr>
      <tr>
        <td>{{ paidDollars }}</td>
        <td>{{ paidShekels }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { events, models, mutations } from '~/shared/constants'
import { formatAsILCurrency, formatAsUSCurrency } from '~/shared/utility'

export default {
  name: 'ClientTaxYearsListHeader',
  props: {
    showArchived: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState([models.selectedClient, models.valueTypes, models.cmdPressed, models.selectedTaxYearId]),
    selectedTaxYear() {
      return this.selectedClient.taxYears.find((taxYear) => taxYear.id === this.selectedTaxYearId)
    },
    isCmdPressed() {
      return this.cmdPressed && !Array.isArray(this.cmdPressed)
    },
    isCopying() {
      return this.isCmdPressed && this.selectedTaxYear
    },
    owesDollars() {
      return !isNaN(this.selectedClient.owesDollars)
        ? `Owed ${formatAsUSCurrency(this.selectedClient.owesDollars)}`
        : ''
    },
    owesShekels() {
      return !isNaN(this.selectedClient.owesShekels)
        ? `Owed ${formatAsILCurrency(this.selectedClient.owesShekels)}`
        : ''
    },
    paidDollars() {
      return !isNaN(this.selectedClient.paidDollars)
        ? `Paid ${formatAsUSCurrency(this.selectedClient.paidDollars)}`
        : ''
    },
    paidShekels() {
      return !isNaN(this.selectedClient.paidShekels)
        ? `Paid ${formatAsILCurrency(this.selectedClient.paidShekels)}`
        : ''
    },
  },
  methods: {
    emitChange() {
      this.$emit(events.change)
    },
    onAddRowClick() {
      console.log("here")
      if (!this.selectedClient) {
        return
      }
      const headers = this.$api.getHeaders()
      const clientId = this.selectedClient.id
      let taxYear = {}
      if (this.isCopying) {
        taxYear = Object.assign({}, this.selectedTaxYear)
        for (const filing of taxYear.filings) {
          delete filing.taxYearId
        }
      } else {
        taxYear = { clientId }
        console.log(taxYear)
      }
      this.$api.createTaxYear(headers, { taxYear }).then((data) => {
        console.log(data)
        data.filings[0].clientId = taxYear.clientId
        this.$store.commit('updateTaxYearState', { taxYearId: data.id, updatedData: data });
        this.$store.commit(mutations.setModelResponse, {
          model: models.selectedTaxYearId,
          data: data.id,
          // })
        })
      })
    },
  },
}
</script>

<style scoped></style>
