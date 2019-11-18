<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-card-text>
            <p class="display-1 text-center ma-5">Seja Bem Vindo!</p>
            <v-row align="start" justify="center">
              <v-col cols="12" md="10">
                <v-form ref="sigupForm" v-model="valid">
                  <v-text-field
                    label="Seu Email"
                    v-model="userData.email"
                    type="email"
                    :rules="emailRules"
                    required
                  ></v-text-field>
                  <v-text-field
                    label="Confirme Seu Email"
                    v-model="userData.emailConfirmation"
                    type="email"
                    :rules="emailConfirmationRules"
                    required
                  ></v-text-field>
                  <v-text-field
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

export default {
  directives: {
    mask
  },
  data: () => ({
    userData: {
      email: '',
      password: '',
      passwordConfirmation: '',
      fullName: '',
      birthDate: '',
      phone: ''
    },
    valid: false,
    birthDateMenu: false,
    showPassword: false,
    showPasswordConfirmation: false,
    emailRules: [
      v => !!v || 'Informe seu E-mail',
      v => /.+@.+/.test(v) || 'Informe um e-mail valido'
    ],
    pwdRules: [
      v => !!v || 'Informe uma senha pra sua conta',
      v =>
        /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(v) ||
        'Deve conter uma letra, numero e um caracter especial'
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
    emailConfirmationRules () {
      const rules = []
      const rule = v =>
        (!!v && v) === this.userData.email ||
        'Deve ser igual ao email informada no campo anterior'
      rules.push(rule)
      return rules
    },
    pwdConfirmationRules () {
      const rules = []
      const rule = v =>
        (!!v && v) === this.userData.password ||
        'Deve ser igual a senha informada no campo anterior'
      rules.push(rule)
      return rules
    },
    birthDateRegionFormat () {
      return this.userData.birthDate
        ? moment(this.userData.birthDate).format('DD/MM/YYYY')
        : ''
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
        this.$store.dispatch('userSignUp', {
          email: this.userData.email,
          password: this.userData.password
        })
      }
    }
  }
}
</script>
