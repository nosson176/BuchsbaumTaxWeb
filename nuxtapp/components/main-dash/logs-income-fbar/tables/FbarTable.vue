<template>
  <Table>
    <template #header>
      <TableHeader>
        <div class="table-header xs" />
        <div class="table-header xs" />
        <div class="table-header sm">
          Year
        </div>
        <div class="table-header sm">
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
        <div class="table-header sm">
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
        v-for="(fbar, idx) in selectedClient.fbarBreakdowns"
        :key="fbar.id"
        :idx="idx"
      >
        <div class="table-col xs" />
        <div class="table-col xs">
          <div class="flex items-center h-5">
            <input
              id="include"
              :checked="fbar.include"
              name="disabled"
              type="checkbox"
              class="h-3 w-3 pointer-events-none"
              disabled
            >
          </div>
        </div>
        <div class="table-col sm">
          {{ fbar.year }}
        </div>
        <div class="table-col-primary sm">
          {{ fbar.category }}
        </div>
        <div class="table-col normal">
          {{ fbar.taxGroup }}
        </div>
        <div class="table-col xs">
          {{ fbar.exclusion }}
        </div>
        <div class="table-col normal">
          {{ fbar.taxType }}
        </div>
        <div class="table-col sm">
          {{ fbar.job }}
        </div>
        <div class="table-col sm">
          {{ fbar.amount }}
        </div>
        <div class="table-col sm">
          {{ fbar.currency }}
        </div>
        <div class="table-col xs">
          X
        </div>
        <div class="table-col xs">
          $
        </div>
        <div class="table-col sm">
          {{ fbar.documents }}
        </div>
        <div class="table-col lg">
          {{ fbar.description }}
        </div>
        <div class="table-col sm">
          Depend
        </div>
        <div class="table-col xs" />
      </TableRow>
    </template>
  </Table>
</template>

<script>
import { mapState } from 'vuex'
import { models } from '~/shared/constants'

export default {
  name: 'FbarTable',
  computed: {
    ...mapState([models.selectedClient])
  }
}
</script>

<style scoped>

</style>
