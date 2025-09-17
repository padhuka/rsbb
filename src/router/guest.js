const routesGuest = [
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'guest',
        component: () => import('pages/GuestPage.vue'),
      },
      {
        path: 'login',
        name: 'authPage',
        component: () => import('pages/AuthPage.vue'),
      },
    ],
  },
]

export default routesGuest
