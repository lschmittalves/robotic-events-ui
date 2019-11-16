<template>
  <v-content>
    <router-view></router-view>
    <Footer />
  </v-content>
</template>

<script>
import Footer from './Footer'

export default {
  components: {
    Footer
  },
  metaInfo () {
    return {
      title: 'Summit de Robotica'
    }
  }
}
</script>

<style>
#core-view {
  padding-bottom: 100px;
}
</style>
