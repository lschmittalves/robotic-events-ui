<template>
  <v-content>
    <v-container fluid>
      <router-view></router-view>
    </v-container>
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
      title: 'Catolica SC -  Wickedbotz'
    }
  }
}
</script>

<style>
#core-view {
  padding-bottom: 100px;
}
</style>
