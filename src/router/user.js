const routesUser = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),

    children: [
      {
        path: '/profile-setup',
        name: 'profileSetup',
        component: () => import('pages/profile/ProfileSetup.vue'),
      },
      {
        path: '/',
        name: 'pageHome',
        component: () => import('pages/home/PageHome.vue'),
      },
    ],
  },
]

export default routesUser
