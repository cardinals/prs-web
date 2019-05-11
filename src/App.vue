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
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100%;
    width: 100%;
  }
</style>
