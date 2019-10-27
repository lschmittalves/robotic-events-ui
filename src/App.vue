<template>
  <v-app>
    <Toolbar />
    <Content />
  </v-app>
</template>

<style lang="scss">
@import "@/styles/index.scss";
</style>

<script>
import Toolbar from './components/core/Toolbar'
import Content from './components/core/Content'

export default {
  name: 'App',
  components: {
    Toolbar,
    Content
  },
  data: () => ({
    //
  })
}
</script>
