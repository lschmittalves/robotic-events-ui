<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-card-text>
            <p class="display-1 text-center ma-5">Seja Bem Vindo!</p>
            <p
              v-if="userIsAuthenticated"
              class="subtitle-1 text-center ma-5"
            >Por favor complete seu cadastro</p>
            <v-row align="start" justify="center">
              <v-col cols="12" md="10">
                <v-form ref="sigupForm" v-model="valid">
                  <v-text-field
                    label="Seu Email"
                    v-model="userData.email"
                    type="email"
                    :rules="emailRules"
                    required
                    :readonly="userIsAuthenticated"
                  ></v-text-field>
                  <v-text-field
                    label="Confirme Seu Email"
                    v-model="userData.emailConfirmation"
                    type="email"
                    :rules="emailConfirmationRules"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-if="userIsAuthenticated"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPassword ? 'text' : 'password'"
                    class="input-group--focused"
                    @click:append="showPassword = !showPassword"
                    label="Senha"
                    v-model="userData.password"
                    hint="Uma letra, numero e um caracter especial"
                    :rules="pwdRules"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-if="userIsAuthenticated"
                    :append-icon="showPasswordConfirmation ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPasswordConfirmation ? 'text' : 'password'"
                    class="input-group--focused"
                    @click:append="showPasswordConfirmation = !showPasswordConfirmation"
                    label="Confirme sua Senha"
                    v-model="userData.passwordConfirmation"
                    :rules="pwdConfirmationRules"
                    required
                  ></v-text-field>
                  <v-text-field
                    label="Nome Completo"
                    v-model="userData.fullName"
                    type="text"
                    :rules="nameRules"
                    required
                  ></v-text-field>
                  <v-text-field
                    label="Telefone"
                    v-model="userData.phone"
                    v-mask="['(##) ####-####', '(##) #####-####']"
                    type="phone"
                    :rules="phoneRules"
                    hint="Somente numeros com o DDD"
                    required
                  ></v-text-field>
                  <v-menu
                    ref="birthDateMenu"
                    v-model="birthDateMenu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        :value="birthDateRegionFormat"
                        label="Data de Nasc."
                        readonly
                        v-on="on"
                        :rules="birthDateRules"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      ref="picker"
                      v-model="userData.birthDate"
                      :max="new Date().toISOString().substr(0, 10)"
                      min="1950-01-01"
                      @change="save"
                    ></v-date-picker>
                  </v-menu>
                </v-form>
              </v-col>
              <v-col cols="12" md="10">
                <v-btn :disabled="!valid" @click="submit" x-large block outlined>Registrar</v-btn>
                <p class="ma-4 text-center">
                  <a class="router-link" href="/login">Voltar a pagina de login</a>
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
import { mask } from 'vue-the-mask'
import moment from 'moment'
import { createHelpers } from 'vuex-map-fields'

// We're using the same getter and mutation types
// as we've used in the store above.
const { mapFields } = createHelpers({
  getterType: 'getUserField',
  mutationType: 'updateUserField'
})

export default {
  directives: {
    mask
  },
  data: () => ({
    userData: {
      password: '',
      passwordConfirmation: ''
    },
    valid: false,
    birthDateMenu: false,
    showPassword: false,
    showPasswordConfirmation: false,
    emailRules: [
      v => !!v || 'Informe seu E-mail',
      v => /.+@.+/.test(v) || 'Informe um e-mail valido'
    ],
    nameRules: [v => !!v || 'Informe seu nome completo'],
    phoneRules: [
      v => !!v || 'Informe seu telefone',
      v =>
        /(([1-9][0-9])?|[1-9][0-9])s?([9]{1})?([0-9]{4})-?([0-9]{4})$/.test(
          v
        ) || 'Informe um telefone valido'
    ],
    birthDateRules: [v => !!v || 'Informe sua data de nascimento']
  }),
  computed: {
    ...mapFields({
      userData: {
        email: 'currentUser.email',
        fullName: 'currentUser.fullName',
        birthDate: 'currentUser.birthDate',
        phone: 'currentUser.phone'
      }
    }),
    emailConfirmationRules () {
      const rules = []
      const rule = v =>
        (!!v && v) === this.userData.email ||
        'Deve ser igual ao email informada no campo anterior'
      rules.push(rule)
      return rules
    },
    pwdRules () {
      const rules = []
      const rule1 = v =>
        this.userIsAuthenticated || !!v || 'Informe uma senha pra sua conta'
      const rule2 = v =>
        this.userIsAuthenticated ||
        /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(v) ||
        'Deve conter uma letra, numero e um caracter especial'

      rules.push(rule1)
      rules.push(rule2)
      return rules
    },
    pwdConfirmationRules () {
      const rules = []
      const rule = v =>
        this.userIsAuthenticated ||
        (!!v && v) === this.userData.password ||
        'Deve ser igual a senha informada no campo anterior'
      rules.push(rule)
      return rules
    },
    birthDateRegionFormat () {
      return this.userData.birthDate
        ? moment(this.userData.birthDate).format('DD/MM/YYYY')
        : ''
    },
    userIsAuthenticated: function () {
      return this.$store.getters['user/isAuthenticated']
    }
  },
  watch: {
    birthDateMenu (val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    }
  },
  methods: {
    save (date) {
      this.$refs.birthDateMenu.save(date)
    },
    submit () {
      if (this.$refs.sigupForm.validate()) {
        this.$store.dispatch('user/userSignUp', {
          email: this.userData.email,
          password: this.userData.password
        })
      }
    }
  }
}
</script>
