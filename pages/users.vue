<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <Users />
  </div>
</template>

<script>
export default {
  name: 'UsersPage',
  created() {
    const headers = this.$api.getHeaders()
    this.$api.getAllUsers(headers)
  },
}
</script>
