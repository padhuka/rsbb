import { defineBoot } from '#q-app/wrappers'
import { useStoreAuth } from 'src/stores/storeAuth'
import supabase from 'src/config/supabase'

export default defineBoot(async ({ router }) => {
  const storeAuth = useStoreAuth()

  // ✅ restore session
  await storeAuth.loadUserFromSession()

  // ✅ listen perubahan auth
  supabase.auth.onAuthStateChange((event, session) => {
    storeAuth.handleAuthChange(event, session)
    // redirect di sini lebih aman karena router pasti sudah ready
    if (event === 'SIGNED_OUT') {
      router.replace('/auth')
    }
  })

  router.beforeEach((to) => {
    if (storeAuth.isLoadingSession) {
      console.log('⏳ Session masih loading...')
      return true
    }

    const isLoggedIn = storeAuth.isLoggedIn
    console.log('Guard check user:', storeAuth.userDetails)
    console.log('isLoggedIn:', isLoggedIn)

    // 🟢 Jika belum login dan halaman bukan auth/guest → redirect paksa
    if (!isLoggedIn && !to.path.startsWith('/auth') && to.name !== 'guest') {
      return { name: 'guest' }
    }

    // 🟢 Kalau sudah login, cegah akses ke halaman auth
    if (isLoggedIn && to.path.startsWith('/auth')) {
      return { path: '/' }
    }

    return true
  })
})
