import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import supabase from 'src/config/supabase'
// import authService from 'src/services/authService' // Assume this service handles API calls
import DeviceSession from 'src/services/DeviceSession'
import WaService from 'src/services/WaService'
import { useShowErrorMessage } from 'src/composables/useShowErrorMessage'

export function useAuth() {
  const router = useRouter()
  const $q = useQuasar()

  const user = ref(null)
  const isLoading = ref(false)

  const isAuthenticated = computed(() => !!user.value)

  // const login = async (credentials) => {
  //   console.log('login', credentials)
  //   isLoading.value = true
  //   try {
  //     // API call
  //     const response = await authService.login(credentials)
  //     user.value = response.user

  //     $q.notify({ type: 'positive', message: 'Login berhasil!' })
  //     router.push('/home')
  //   } catch (error) {
  //     $q.notify({ type: 'negative', message: 'Login gagal. Silakan coba lagi.' })
  //     console.error('Login error:', error)
  //   } finally {
  //     isLoading.value = false
  //   }
  // }
  const register = async (phone, fullname) => {
    isLoading.value = true
    try {
      // const { data, error } = await supabase.auth.admin.createUser({
      //   phone,
      //   user_metadata: { fullname },
      // })
      const defaultPassword = phone.slice(-6) // atau random string

      // Buat user di Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        phone,
        password: defaultPassword,
        options: {
          data: { fullname }, // masuk ke user_metadata
        },
      })

      if (error) {
        console.error('Registration error:', error.message)
      }

      // Buat record di schema rsbb.users
      await supabase.from('users_rsbb').insert({
        id: data.user.id,
        phone,
        fullname,
        isVerified: false,
      })

      return { success: true, user: data.user }
    } catch (error) {
      console.error('Registration error:', error.message)
      return { success: false, error }
    } finally {
      isLoading.value = false
    }
  }

  const sendOtp = async (phone, fullName) => {
    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString()
      const expiresAt = new Date(Date.now() + 5 * 60000).toISOString()

      const { error } = await supabase
        .from('users_rsbb')
        .update({ otp_code: otp, otp_expires_at: expiresAt })
        .eq('phone', phone)

      if (error) {
        console.error('❌ Failed to store OTP:', error.message)
        return { success: false, error }
      }

      // TODO: Integrate with your SMS API here to send OTP
      // console.log("OTP sent to", user.value.phone, ":", otp);
      // Simulate sending OTP
      // const formattedPhone = formatPhone(user.value.phone);
      // Bintang
      // const deviceId = "otp-82c0c8cb-98b3-457b-baa6-e9bcf0e21c72";
      // Flowkirim
      const deviceId = 'flowkirim-fe223dfc-7573-43c0-8f7d-849d41956117'
      const sessionDeviceid = await DeviceSession.getWaSessions(deviceId)
      await WaService.sendMessage({
        session_id: sessionDeviceid.session_id,
        message: `Hi ${fullName} ini kode OTP Anda ${otp}. Kode ini hanya valid selama 5 menit.`,
        to: phone + '@s.whatsapp.net',
      })
      // otpDialog.value = true;
      // startResendCooldown();
      // showSnackbar('OTP sent successfully!', '#10b981', 'mdi-message-text')
      console.log('OTP sent to', phone, ':', otp)
      return { success: true }
    } catch (error) {
      console.error('Error sending OTP:', error)
      // showSnackbar(error.message || "Failed to send OTP", "#ef4444", "mdi-alert-circle");
    }
  }

  const verifyOtp = async (phone, otpCode) => {
    try {
      const { data, error } = await supabase
        .from('users_rsbb')
        .select('otp_code, otp_expires_at')
        .eq('phone', phone)
        .single()

      if (error) throw error

      const now = new Date()
      if (otpCode === data.otp_code && now < new Date(data.otp_expires_at)) {
        await supabase
          .from('users_rsbb')
          .update({ isVerified: true, otp_code: null, otp_expires_at: null })
          .eq('phone', phone)

        // Login pakai password bridge
        const defaultPassword = phone.slice(-6)
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          phone,
          password: defaultPassword,
        })

        if (loginError) throw loginError
        $q.notify({ type: 'positive', message: 'Login berhasil!' })
        await router.push({ name: 'profileSetup' })
        return { success: true, session: loginData.session }
      } else {
        useShowErrorMessage('Kode OTP salah atau sudah kedaluwarsa. Silakan coba lagi.')
        return { success: false }
      }
    } catch (error) {
      console.error('OTP verification error:', error)
      useShowErrorMessage(error.message || 'Gagal ')
      return { success: false, error }
    }
  }
  const verifyUser = async (phone) => {
    try {
      const { data, error } = await supabase
        .from('users_rsbb')
        .select('*')
        .eq('phone', phone)
        .eq('isVerified', true)
        .single()

      if (error) throw error

      if (data) {
        user.value = data
        return { exists: true, user: data }
      } else {
        useShowErrorMessage('User tidak ditemukan. Silakan daftar terlebih dahulu.')
        return { exists: false }
      }
    } catch (error) {
      useShowErrorMessage('User belum terdaftar. Silakan daftar terlebih dahulu.')
      console.error('User verification error:', error)
      return { exists: false, error }
    }
  }

  return { user, isLoading, isAuthenticated, register, sendOtp, verifyOtp, verifyUser }
}
