<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-card-text>
            <p class="display-1 text-center">Login</p>

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
            <v-btn :disabled="!valid" @click="submit" x-large block outlined>Entrar</v-btn>
          </v-card-text>
          <v-divider class="mt-12"></v-divider>
          <v-card-actions>
            <v-btn color="primary" text to="/signup">Registrar-se</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
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
    submit () {
      if (this.$refs.sigupForm.validate()) {
        this.$store.dispatch('userLogin', {
          email: this.userData.email,
          password: this.userData.password
        })
      }
    }
  }
}
</script>
