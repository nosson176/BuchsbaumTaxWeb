<template>
  <div>
    <Nuxt />
    <Notifier class="w-full fixed top-0 z-10" />
  </div>
</template>

<script>

export default {
  name: 'DefaultLayout'
}

</script>

<style>
  html {
    font-size: 16px;
    word-spacing: 1px;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    box-sizing: border-box;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
  }
</style>
