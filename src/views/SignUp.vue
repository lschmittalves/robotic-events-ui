<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Cadastre-se</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                label="Seu Email"
                v-model="email"
                type="email"
                :rules="emailRules"
                required
              ></v-text-field>
              <v-text-field
                label="Senha"
                v-model="password"
                type="password"
                :rules="pwdRules"
                required
              ></v-text-field>
              <v-text-field
                label="Confirme sua Senha"
                v-model="passwordConfirmation"
                type="password"
                hint="Uma letra, numero e um caracter especial"
                :rules="pwdConfirmationRules"
                required
              ></v-text-field>
              <v-text-field
                label="Nome Completo"
                v-model="fullName"
                type="text"
                :rules="nameRules"
                required
              ></v-text-field>
              <v-text-field
                label="Tel."
                v-model="phone"
                v-mask="phoneMask"
                type="phone"
                :rules="phoneRules"
                hint="(##)########"
                required
              ></v-text-field>
              <v-menu
                ref="birthDateMenu"
                v-model="birthDateMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field v-model="birthDate" label="Data de Nasc." readonly v-on="on"></v-text-field>
                </template>
                <v-date-picker
                  ref="picker"
                  v-model="birthDate"
                  :max="new Date().toISOString().substr(0, 10)"
                  min="1950-01-01"
                  @change="save"
                ></v-date-picker>
              </v-menu>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary">Registrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mask } from 'vue-the-mask'

export default {
  directives: {
    mask
  },
  data: () => ({
    valid: false,
    birthDateMenu: false,
    email: '',
    password: '',
    passwordConfirmation: '',
    fullName: '',
    birthDate: '',
    phone: '',
    phoneMask: '(##)########',
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
    pwdConfirmationRules: [
      v =>
        v === this.password ||
        'Deve ser igual a senha informada no campo anterior'
    ],
    phoneRules: [
      v => !!v || 'Informe seu telefone',
      v =>
        /(([1-9][0-9])?|[1-9][0-9])s?([9]{1})?([0-9]{4})-?([0-9]{4})$'/.test(
          v
        ) || 'Informe um telefone valido'
    ]
  }),
  watch: {
    birthDateMenu (val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    }
  },
  methods: {
    save (date) {
      this.$refs.birthDateMenu.save(date)
    }
  }
}
</script>
