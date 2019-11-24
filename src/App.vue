<template>
  <v-app>
    <Toolbar />
    <Content />
    <v-snackbar v-model="displaySnackbar" :timeout="6000" color="error" :multi-line="true">
      {{ currentErrorMessage }}
      <v-btn dark text icon @click="displaySnackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
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
  }),
  computed: {
    displaySnackbar: {
      get () {
        return this.$store.getters['general/displayErrorMessage']
      },
      set (value) {
        if (!value) {
          this.$store.dispatch('general/clearErrorMessage')
        }
      }
    },
    currentErrorMessage () {
      return this.$store.getters['general/getErrorMessage']
    }
  }
}
</script>
