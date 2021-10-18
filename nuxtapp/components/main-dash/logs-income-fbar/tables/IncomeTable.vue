<template>
  <Table>
    <template #header>
      <TableHeader>
        <div class="table-header xs" />
        <div class="table-header sm">
          Year
        </div>
        <div class="table-header xs">
          Cat
        </div>
        <div class="table-header  normal">
          Group
        </div>
        <div class="table-header xs">
          Ex
        </div>
        <div class="table-header normal">
          Type
        </div>
        <div class="table-header sm">
          Job
        </div>
        <div class="table-header normal">
          Amt
        </div>
        <div class="table-header sm">
          Curr
        </div>
        <div class="table-header xs">
          X
        </div>
        <div class="table-header xs">
          $
        </div>
        <div class="table-header sm">
          Doc
        </div>
        <div class="table-header lg">
          Description
        </div>
        <div class="table-header sm">
          Depend
        </div>
        <div class="table-header xs" />
      </TableHeader>
    </template>
    <template #body>
      <TableRow
        v-for="(income, idx) in displayedIncome"
        :key="income.id"
        :idx="idx"
      >
        <div class="table-col xs">
          <div class="flex items-center h-5">
            <input
              id="include"
              :checked="income.include"
              name="disabled"
              type="checkbox"
              class="h-3 w-3 pointer-events-none"
              disabled
            >
          </div>
        </div>
        <div class="table-col-primary sm">
          {{ income.years }}
        </div>
        <div class="table-col xs">
          {{ income.category }}
        </div>
        <div class="table-col normal">
          {{ income.taxGroup }}
        </div>
        <div class="table-col xs">
          <div class="flex items-center h-5">
            <input
              id="include"
              :checked="income.exclusion"
              name="disabled"
              type="checkbox"
              class="h-3 w-3 pointer-events-none"
              disabled
            >
          </div>
        </div>
        <div class="table-col normal">
          {{ income.taxType }}
        </div>
        <div class="table-col sm">
          {{ income.job }}
        </div>
        <div class="table-col normal">
          {{ formatAsCurrency(income.amount) }}
        </div>
        <div class="table-col sm">
          {{ income.currency }}
        </div>
        <div class="table-col xs">
          {{ income.frequency || '' }}
        </div>
        <div class="table-col xs">
          $
        </div>
        <div class="table-col sm">
          {{ income.documents }}
        </div>
        <div class="table-col lg">
          {{ income.description }}
        </div>
        <div class="table-col sm">
          Depend
        </div>
        <div class="table-col xs">
          <DeleteButton />
        </div>
      </TableRow>
    </template>
  </Table>
</template>

<script>
import { mapState } from 'vuex'
import { models } from '~/shared/constants'
import { formatAsNumber } from '~/shared/utility'

export default {
  name: 'IncomeTable',
  props: {
    showArchived: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState([models.selectedClient]),
    displayedIncome () {
      if (!this.showArchived) {
        return this.notArchived
      } else {
        return this.archived
      }
    },
    notArchived () {
      if (this.selectedClient.incomeBreakdowns) {
        return this.selectedClient.incomeBreakdowns
          .filter(income => !income.archived)
          .sort((a, b) => b.years - a.years)
      } else {
        return null
      }
    },
    archived () {
      if (this.selectedClient.incomeBreakdowns) {
        return this.selectedClient.incomeBreakdowns
          .filter(income => income.archived)
          .sort((a, b) => b.years - a.years)
      } else {
        return null
      }
    }
  },
  methods: {
    formatAsCurrency (amount) {
      return formatAsNumber(amount)
    }
  }
}
</script>

<style scoped>

</style>
