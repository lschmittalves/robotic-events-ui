<template>
  <div>
    <v-toolbar>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn to="/" text>Dashboard</v-btn>
        <v-btn text>Eventos</v-btn>
        <v-btn text>Sua Equipe</v-btn>
      </v-toolbar-items>
      <v-btn icon to="/user-profile">
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </v-toolbar>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  data: () => ({
    title: null
  }),

  watch: {
    $route (val) {
      this.title = val.name
    }
  },

  mounted () {
    this.onResponsiveInverted()
    window.addEventListener('resize', this.onResponsiveInverted)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResponsiveInverted)
  },

  methods: {
    ...mapMutations('app', ['setSidebar', 'toggleSidebar']),
    onClickBtn () {
      this.setDrawer(!this.$store.state.app.sidebar)
    },
    onClick () {
      //
    },
    onResponsiveInverted () {
      if (window.innerWidth < 991) {
        this.responsive = true
      } else {
        this.responsive = false
      }
    }
  }
}
</script>

<style>
#core-toolbar a {
  text-decoration: none;
}
</style>
