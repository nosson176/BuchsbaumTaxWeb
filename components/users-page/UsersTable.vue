<template>
  <Table>
    <template #header>
      <TableHeader>
        <div class="table-header">
          <AddRowButton @click="onAddRowClick" />
        </div>
        <div class="table-header w-full">Name</div>
      </TableHeader>
    </template>
    <template #body>
      <TableRow v-for="(user, index) in users" :key="user.id" :idx="index">
        <div
          class="table-col w-full cursor-pointer"
          :class="isUserSelected(user.id) ? 'bg-gray-700 text-gray-100' : ''"
          @click="setSelected(user)"
        >
          {{ user.username }}
          <span class="font-light">({{ user.userType }})</span>
        </div>
        <div class="table-col">
          <DeleteButton />
        </div>
      </TableRow>
    </template>
  </Table>
</template>

<script>
import { events } from '~/shared/constants';
export default {
  name: "UsersTable",
  props: {
    users: {
      type: Array,
      required: true
    },
    userId: {
      type: Number,
      default: 0
    }
  },
  methods: {
    setSelected (user) {
      console.log(user);
      this.$emit(events.click, user.id);
    },
    isUserSelected (userId) {
      return userId === this.userId;
    },
    onAddRowClick () {
    }
  }
}
</script>

<style scoped>
</style>
