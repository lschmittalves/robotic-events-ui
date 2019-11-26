/**
 * Define all of your application routes here
 * for more information on routes, see the
 * official documentation https://router.vuejs.org/en/
 */
export default [{
  path: '/login',
  view: 'Login'
},
{
  path: '/signup',
  view: 'SignUp'
},
{
  path: '/user-profile',
  name: 'Seu Perfil',
  view: 'UserProfile',
  meta: {
    authRequired: true
  }
},
{
  path: '',
  name: 'Eventos',
  view: 'Events',
  meta: {
    authRequired: true
  }
},
{
  path: '/team',
  name: 'Sua Equipe',
  view: 'Team',
  meta: {
    authRequired: true
  }
}
]
