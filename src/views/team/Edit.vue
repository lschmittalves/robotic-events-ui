<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center" v-if="!isLoadingTeam">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-card-text>
            <p class="display-1 text-center ma-5">Criando Nova Equipe</p>
            <p
              v-if="!currentUserHasATeam"
              class="subtitle-1 text-center ma-5"
            >Voce sera atribuido como capitao da nova equipe automaticamente</p>
            <v-row align="start" justify="center">
              <v-col cols="12" md="10">
                <v-form ref="teamForm" v-model="valid">
                  <v-text-field
                    label="Nome da sua equipe"
                    v-model="name"
                    type="text"
                    :rules="nameRules"
                    :disabled="currentUserHasATeam"
                  ></v-text-field>
                  <v-text-field
                    label="Estado da sua equipe"
                    v-model="province"
                    type="text"
                    :rules="provinceRules"
                  ></v-text-field>
                  <v-text-field
                    label="Cidade da sua equipe"
                    v-model="city"
                    type="text"
                    :rules="cityRules"
                  ></v-text-field>
                  <v-text-field
                    label="Organizacao Educacional"
                    v-model="collegeName"
                    type="text"
                    hint="Deixe em branco se sua equipe e particular"
                  ></v-text-field>
                  <v-text-field
                    v-if="currentUserHasATeam"
                    label="Atual Capitao"
                    v-model="capitanUserEmail"
                    type="text"
                    :rules="capitanRules"
                  ></v-text-field>
                </v-form>
              </v-col>
              <v-col cols="12" md="10">
                <v-alert
                  v-model="teamHasNewCapitan"
                  color="amber lighten-1"
                  border="left"
                  elevation="2"
                  colored-border
                  icon="mdi-alert-circle-outline"
                >Voce mudou o capitao, apos salvar as alteracoes voce nao tera mais acesso a edicao dessa equipe</v-alert>
                <v-btn :disabled="!valid" @click="submit" x-large block outlined>Salvar Equipe</v-btn>
                <p class="ma-4 text-center">
                  <a class="router-link" @click="cancel">Cancelar</a>
                </p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import router from '@/router'

export default {
  data: () => ({
    isLoadingTeam: true,
    valid: false,
    nameRules: [v => !!v || 'Informe um nome para sua equipe'],
    provinceRules: [v => !!v || 'Informe o estado da sua equipe'],
    cityRules: [v => !!v || 'Informe a cidade da sua equipe']
  }),
  mounted () {
    this.$store.dispatch('team/loadCurrentTeamFromFirestore').then(() => {
      this.isLoadingTeam = false
    })
  },
  computed: {
    name: {
      get () {
        return this.$store.getters['team/getTeamName']
      },
      set (value) {
        this.$store.commit('team/updateTeamName', value)
      }
    },
    city: {
      get () {
        return this.$store.getters['team/getTeamCity']
      },
      set (value) {
        this.$store.commit('team/updateTeamCity', value)
      }
    },
    province: {
      get () {
        return this.$store.getters['team/getTeamProvince']
      },
      set (value) {
        this.$store.commit('team/updateTeamProvince', value)
      }
    },
    collegeName: {
      get () {
        return this.$store.getters['team/getTeamCollege']
      },
      set (value) {
        this.$store.commit('team/updateCollegeName', value)
      }
    },
    capitanUserEmail: {
      get () {
        return this.$store.getters['team/getTeamCapitan']
      },
      set (value) {
        this.$store.commit('team/updateCapitanUserEmail', value)
      }
    },
    capitanRules: function () {
      const rules = []
      const rule1 = v =>
        this.teamHasNewCapitan || !!v || 'Informe o email do novo capitao'
      const rule2 = v =>
        this.teamHasNewCapitan ||
        /.+@.+/.test(v) ||
        'Email do novo capitao esta em um formato invalido'

      rules.push(rule1)
      rules.push(rule2)
      return rules
    },
    currentUserHasATeam: function () {
      return this.$store.getters['user/currentUserHasATeam']
    },
    isCurrentUserCapitan: function () {
      return this.$store.getters['team/isCurrentUserCapitan']
    },
    teamHasNewCapitan: function () {
      return (
        this.currentUserHasATeam &&
        this.$store.getters['user/getTeamCapitan'] !==
          this.$store.getters['user/getUserEmail']
      )
    }
  },
  methods: {
    cancel: function () {
      this.$store.dispatch('team/loadCurrentTeamFromFirestore').then(() => {
        router.push('/team')
      })
    },
    submit () {
      if (this.$refs.teamForm.validate()) {
      }
    }
  }
}
</script>
