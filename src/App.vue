<template>
  <div id="app">
    <container></container>
  </div>
</template>

<script>
import container from '@/views/container'

export default {
  name: 'app',
  components: {
    container
  }
}
</script>

<style lang="less">
  #app {
    height: 100%;
    width: 100%;
  }
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
  }
</style>
