<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-card-text>
            <p class="display-1 text-center ma-5">Login</p>
            <v-row align="start" justify="center">
              <v-col cols="12" md="10">
                <v-form ref="sigupForm" v-model="valid">
                  <v-text-field
                    prepend-icon="mdi-account"
                    label="Email"
                    v-model="userData.email"
                    type="email"
                    :rules="emailRules"
                    placeholder="Informe seu email"
                    required
                  ></v-text-field>
                  <v-text-field
                    prepend-icon="mdi-key"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPassword ? 'text' : 'password'"
                    class="input-group--focused"
                    @click:append="showPassword = !showPassword"
                    label="Senha"
                    v-model="userData.password"
                    :rules="pwdRules"
                    placeholder="Informe sua senha"
                    required
                  ></v-text-field>
                </v-form>
                <p class="text-right">
                  <a class="router-link">Esqueceu a senha?</a>
                </p>
              </v-col>
              <v-col class="mt-n6" cols="12" md="10">
                <v-btn :disabled="!valid" @click="submit" x-large block outlined>Entrar</v-btn>
              </v-col>
              <v-col class="mt-n2 pa-12" cols="12" md="10">
                <p class="ma-2 text-center">Ou faca o login usando</p>
                <v-row align="start" justify="center">
                  <v-btn class="mx-2" fab dark color="yellow darken-2" depressed @click="googleLogin">
                    <v-icon dark>mdi-google</v-icon>
                  </v-btn>
                </v-row>
              </v-col>
              <v-col cols="12" md="10">
                <p class="ma-2 text-center">Ainda nao possui acesso?</p>
                <v-row align="start" justify="center">
                  <v-btn color="primary" text to="/signup">Registrar-se</v-btn>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    userData: {
      email: '',
      password: ''
    },
    showPassword: false,
    valid: false,
    emailRules: [
      v => !!v || 'Informe seu E-mail para acessar sua conta',
      v => /.+@.+/.test(v) || 'Informe um e-mail valido'
    ],
    pwdRules: [v => !!v || 'Informe a senha para acessar sua conta']
  }),
  methods: {
    googleLogin () {
    },
    submit () {
      if (this.$refs.sigupForm.validate()) {
        this.$store.dispatch('user/userLogin', {
          email: this.userData.email,
          password: this.userData.password
        })
      }
    }
  }
}
</script>
