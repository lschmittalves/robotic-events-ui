<template>
  <v-container fluid>
    <v-alert
      v-if="displayNoTeamMessage"
      color="cyan"
      border="left"
      elevation="2"
      colored-border
      icon="mdi-account-group"
    >
      <v-row align="center" no-gutters>
        <v-col cols="12" md="11">
          <h4 class="headline">Parece que voce ainda nao esta em uma equipe</h4>
          <div>Peca ao capitao da sua equipe para adicionar-lo como membro ou entao crie uma nova equipe para voce!</div>
        </v-col>
        <v-col cols="12" md="1">
          <v-spacer></v-spacer>
          <v-btn color="cyan" @click="editTeam" outlined>Criar Equipe</v-btn>
        </v-col>
      </v-row>
    </v-alert>
  </v-container>
</template>

<script>
import router from '@/router'

export default {
  data: () => ({
    isLoadingTeam: true
  }),
  mounted () {
    this.$store.dispatch('team/loadCurrentTeamFromFirestore').then(() => {
      this.isLoadingTeam = false
    })
  },
  computed: {
    isCurrentUserCapitan: function () {
      return this.$store.getters['team/isCurrentUserCapitan']
    },
    getCurrentTeam: function () {
      return this.$store.getters['team/getCurrentTeam']
    },
    displayNoTeamMessage: function () {
      return (
        !this.isLoadingTeam && !this.$store.getters['user/currentUserHasATeam']
      )
    }
  },
  methods: {
    editTeam: function () {
      router.push('/team/edit')
    }
  }
}
</script>
