<template>
  <div>
    <v-toolbar>
      <v-toolbar-title>Summit de Robotica</v-toolbar-title>
      <v-progress-linear
        :active="isLoading"
        :indeterminate="isLoading"
        absolute
        bottom
        color="cyan"
      ></v-progress-linear>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn v-if="displayLinks" to="/" text>Eventos</v-btn>
        <v-btn v-if="displayLinks" to="/team" text>Sua Equipe</v-btn>
      </v-toolbar-items>
      <v-menu offset-y v-if="displayLinks">
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </template>
        <v-list>
          <!-- <v-list-item to="/user-profile"> -->
          <v-list-item>
            <v-list-item-title>{{userName}}</v-list-item-title>
          </v-list-item>
          <v-list-item @click="onSignOutClick">
            <v-list-item-title>Sair</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  data: () => ({
    title: null
  }),
  mounted () {
    this.onResponsiveInverted()
    window.addEventListener('resize', this.onResponsiveInverted)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResponsiveInverted)
  },
  computed: {
    displayLinks: function () {
      return (
        this.$store.getters['user/isAuthenticated'] &&
        this.$store.getters['user/userRegisterIsCompleted']
      )
    },
    userName: function () {
      return this.$store.getters['user/getUserName']
    },
    isLoading () {
      return this.$store.getters['general/isLoading']
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
    },
    onSignOutClick () {
      this.$store.dispatch('user/userSignOut')
    }
  }
}
</script>

<style>
#core-toolbar a {
  text-decoration: none;
}
</style>
