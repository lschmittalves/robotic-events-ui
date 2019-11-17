<template>
  <div>
    <v-toolbar>
      <v-toolbar-title>Summit de Robotica{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn :visible="isAuthenticate" to="/" text>Dashboard</v-btn>
        <v-btn :visible="isAuthenticate" text>Eventos</v-btn>
        <v-btn :visible="isAuthenticate" text>Sua Equipe</v-btn>
      </v-toolbar-items>
      <v-btn :visible="isAuthenticate" icon to="/user-profile">
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
      if (val.path.includes('login') || val.path.includes('signup')) {
        this.title = ''
      } else {
        this.title = ' - ' + val.name
      }
    }
  },

  mounted () {
    this.onResponsiveInverted()
    window.addEventListener('resize', this.onResponsiveInverted)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResponsiveInverted)
  },
  computed: {
    isAuthenticate () {
      return !this.$store.getters.isAuthenticated
    }
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
