// stores/counter.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'src/http/axios'
import supabase from 'src/config/supabase'

export const useStoreAuth = defineStore('auth', () => {
  //state
  const userDetails = ref(null) // dari auth.users
  const userProfile = ref(null) // dari rsbb.users
  const isLoadingSession = ref(true) // ✅ default true

  //getters
  // 🟢 getters (computed)
  const isLoggedIn = computed(() => !!userDetails.value)
  const userId = computed(() => userDetails.value?.id ?? null)
  const phone = computed(() => userDetails.value?.phone ?? null)
  const fullname = computed(() => userDetails.value?.fullname ?? null)
  const role = computed(() => userDetails.value?.role ?? 'guest')
  const email = computed(() => userProfile.value?.email ?? null)
  const address = computed(() => userProfile.value?.address ?? null)

  const avatarUrl = computed(() => {
    if (!userProfile.value?.avatar) return null
    // generate public URL dari storage
    const { data } = supabase.storage.from('avatars').getPublicUrl(userProfile.value.avatar)
    return data.publicUrl
  })

  //actions
  const handleAuthChange = async (event, session) => {
    console.log('event', event)
    console.log('session', session)
    try {
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        if (session?.user) {
          await setUser(session.user, session.access_token)
          await fetchUserProfile(session.user.id) // ambil profil lengkap
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('🧹 Signed out')
        // Clear storage
        removeSession()
      }
    } catch (error) {
      console.error('Auth state change error:', error)
    } finally {
      isLoadingSession.value = false // ✅ apapun hasilnya, selesai loading
    }
  }
  // ✅ Set user details
  const setUser = (payload, token) => {
    userDetails.value = {
      id: payload.id,
      phone: payload.phone ?? null,
      email: payload.email ?? null,
      role: payload.role ?? 'authenticated',
      fullname: payload.user_metadata?.fullname ?? null,
    }

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    localStorage.setItem('accessToken', JSON.stringify(token))
  }

  // ✅ Clear user (logout)
  const removeSession = () => {
    userDetails.value = null
    axios.defaults.headers.common['Authorization'] = ''
    localStorage.removeItem('accessToken')
    console.log('🧹 Session cleared')
  }

  // 🔹 fetch data profil user dari rsbb.users
  const fetchUserProfile = async (id) => {
    const { data, error } = await supabase.from('users_rsbb').select('*').eq('id', id).single()

    if (!error) {
      userProfile.value = data
      console.log('Fetched user profile:', data)
    } else {
      console.error('fetchUserProfile error:', error)
    }
  }

  // Load session dari supabase waktu pertama kali
  const loadUserFromSession = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()
      console.log('🔎 getSession result:', session, error)

      if (session?.user) {
        await setUser(session.user, session.access_token)
        await fetchUserProfile(session.user.id)
      }
    } catch (err) {
      console.error('loadUserFromSession error:', err)
    } finally {
      isLoadingSession.value = false // ✅ selesai check
    }
  }

  // Logout function
  const logout = async () => {
    try {
      console.log('🚪 Logging out...')
      await supabase.auth.signOut() // 🟢 ini yang hapus sb-supabase-auth-token
      removeSession() // 🟢 hapus state + token custom
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  //return
  return {
    //state
    userDetails,
    isLoadingSession,

    // getters
    isLoggedIn,
    userId,
    phone,
    fullname,
    role,
    email,
    address,
    avatarUrl,
    // actions
    handleAuthChange,
    setUser,
    removeSession,
    loadUserFromSession,
    logout,
  }
})
