/**
 * Define all of your application routes here
 * for more information on routes, see the
 * official documentation https://router.vuejs.org/en/
 */
export default [
  {
    path: '/login',
    name: 'Login',
    view: 'Login'
  },
  {
    path: '/signup',
    name: 'Summit de Robotica',
    view: 'SignUp'
  },
  {
    path: '/user-register',
    name: 'Registro de Usuario',
    view: 'UserRegister'
  },
  {
    path: '/user-profile',
    name: 'Seu Perfil',
    view: 'UserProfile'
  },
  {
    path: '',
    // Relative to /src/views
    view: 'Dashboard'
  }
]
