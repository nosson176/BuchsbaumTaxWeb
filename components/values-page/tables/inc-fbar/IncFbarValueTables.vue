<template>
  <ValuesTableGrid>
    <div class="flex-col">
      <span class="font-bold text-xl text-gray-500">Job</span>
      <IncFbarJobsTable />
    </div>
    <div class="flex-col">
      <span class="font-bold text-xl text-gray-500">Part</span>
      <IncFbarPartsTable />
    </div>
    <div class="col-span-3">
      <!-- This empty div forces a new row -->
    </div>
    <div class="flex-col">
      <span class="font-bold text-xl text-gray-500">Currency</span>
      <IncFbarCurrenciesTable @currency-selected="handleCurrencySelect" />
    </div>
    <div v-if="CurrencyValue" class="flex-col">
      <span class="font-bold text-xl text-gray-500">Currency Values</span>
      <IncFbarCurrenciesValuesTable :currency-selected="CurrencyValue" :CurrencyValue="CurrencyValue" />
    </div>
  </ValuesTableGrid>
</template>

<script>
export default {
  name: 'IncFbarValueTables',
  data() {
    return {
      CurrencyValue: null
    }
  },
  computed: {
    headers() {
      return this.$api.getHeaders()
    },
  },
  mounted() {
    this.$api
      .getExchangeRates(this.headers)
      .then(response => {
        // Handle the response, e.g., update a data property
      })
      .catch(error => {
        console.error("Error fetching exchange rates:", error);
        // Handle the error appropriately
      });
  },

  methods: {
    handleCurrencySelect(currencyId) {
      this.CurrencyValue = currencyId
    }
  }
}
</script>

<style scoped></style>