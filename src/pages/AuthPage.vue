<template>
  <q-page class="flex flex-center">
    <div class="auth-container">
      <!-- Background Elements -->
      <div class="green-circle" :class="{ 'login-position': activeTab === 'login', 'register-position': activeTab === 'register' }"></div>

      <!-- Main Content -->
      <div class="main-content">
        <!-- Logo/Icon Container -->
        <div class="logo-container">
          <div class="circular-logo">
            <q-icon name="person" size="48px" color="primary" />
            <div class="corner-icon" :style="{ background: activeTab === 'login' ? '#00d4aa' : '#6366f1' }">
              <q-icon :name="activeTab === 'login' ? 'login' : 'person_add'" size="24px" color="white" />
            </div>
          </div>
        </div>

        <!-- Welcome Text -->
        <div class="text-content">
          <h1 class="title">
            {{ getTitle() }}
          </h1>
          <p class="description">
            {{ getDescription() }}
          </p>
        </div>

        <!-- Auth Tabs -->
        <div class="auth-tabs-container" v-if="!showOtpForm">
          <q-tabs
            v-model="activeTab"
            class="auth-tabs"
            indicator-color="transparent"
            active-color="primary"
            align="justify"
          >
            <q-tab name="login" label="Masuk" class="auth-tab" />
            <q-tab name="register" label="Daftar" class="auth-tab" />
          </q-tabs>

          <q-tab-panels v-model="activeTab" class="auth-panels" animated>
            <!-- Login Form -->
            <q-tab-panel name="login" class="auth-panel">
              <q-form @submit="handleLogin" class="auth-form">
                <div class="input-container">
                  <q-input
                    v-model="formattedLoginPhone"
                    label="Nomor Telepon"
                    outlined
                    class="auth-input"
                    :error="!!loginErrors.phone"
                    :error-message="loginErrors.phone"
                    @update:model-value="handleLoginPhoneInput"
                    @blur="validateLogin('phone')"
                    placeholder="081234567890"
                    type="number"
                    inputmode="numeric"

                  >
                    <template v-slot:prepend>
                      <q-icon name="phone" color="grey-6" />
                    </template>

                  </q-input>
                </div>

                <q-btn
                  type="submit"
                  label="Kirim OTP"
                  class="auth-btn login-btn"
                  :loading="loginLoading"
                  :disable="!isLoginFormValid"
                  no-caps
                />
              </q-form>
            </q-tab-panel>

            <!-- Register Form -->
            <q-tab-panel name="register" class="auth-panel">
              <q-form @submit="handleRegister" class="auth-form">
                <div class="input-container">
                  <q-input
                    v-model="registerForm.fullName"
                    label="Nama Lengkap"
                    outlined
                    class="auth-input"
                    :error="!!registerErrors.fullName"
                    :error-message="registerErrors.fullName"
                    @blur="validateRegister('fullName')"
                  >
                    <template v-slot:prepend>
                      <q-icon name="person" color="grey-6" />
                    </template>
                  </q-input>

                  <q-input
                    v-model="formattedPhone"
                    label="Nomor Telepon"
                    outlined
                    class="auth-input"
                    :error="!!registerErrors.phone"
                    :error-message="registerErrors.phone"
                    @update:model-value="handlePhoneInput"
                    @blur="validateRegister('phone')"
                    placeholder="081234567890"
                  >
                    <template v-slot:prepend>
                      <q-icon name="phone" color="grey-6" />
                    </template>
                  </q-input>

                  <div class="terms-container">
                    <q-checkbox
                      v-model="registerForm.agreeTerms"
                      color="primary"
                      class="terms-checkbox"
                    />
                    <span class="terms-text">
                      Saya setuju dengan
                      <a href="#" class="terms-link">syarat dan ketentuan</a>
                    </span>
                  </div>
                  <div v-if="registerErrors.agreeTerms" class="error-text">
                    {{ registerErrors.agreeTerms }}
                  </div>
                </div>

                <q-btn
                  type="submit"
                  label="Daftar"
                  class="auth-btn register-btn"
                  :loading="registerLoading"
                  :disable="!isRegisterFormValid"
                  no-caps
                />
              </q-form>
            </q-tab-panel>
          </q-tab-panels>
        </div>

        <!-- OTP Verification Form -->
        <div v-if="showOtpForm" class="otp-container">
          <div class="otp-header">
            <q-btn
              flat
              round
              icon="arrow_back"
              @click="goBack"
              class="back-btn"
            />
            <div class="otp-info">
              <h3 class="otp-title">Verifikasi OTP</h3>
              <p class="otp-subtitle">
                Kode OTP telah dikirim ke<br>
                <strong>{{ currentPhone }}</strong>
              </p>
            </div>
          </div>

          <q-form @submit="handleVerifyOtp" class="otp-form">
            <div class="otp-input-container">
              <q-input
                v-model="otpCode"
                label="Masukkan Kode OTP"
                outlined
                class="otp-input"
                :error="!!otpError"
                :error-message="otpError"
                maxlength="6"
                @update:model-value="validateOtp"
                placeholder="123456"
                type="number"
                inputmode="numeric"

              >
                <template v-slot:prepend>
                  <q-icon name="security" color="grey-6" />
                </template>
              </q-input>

              <div class="resend-container">
                <span v-if="countdown > 0" class="countdown-text">
                  Kirim ulang dalam {{ countdown }} detik
                </span>
                <q-btn
                  v-else
                  flat
                  label="Kirim Ulang OTP"
                  @click="resendOtp"
                  class="resend-btn"
                  :loading="resendLoading"
                  no-caps
                />
              </div>
            </div>

            <q-btn
              type="submit"
              label="Verifikasi"
              class="auth-btn otp-btn"
              :loading="otpLoading"
              :disable="!isOtpValid"
              no-caps
            />
          </q-form>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
// import { useRouter } from 'vue-router'
import { useAuth } from 'src/composables/useAuth'
import { useForm } from 'src/composables/useForm'

// const router = useRouter()
const {  register, sendOtp, verifyOtp, verifyUser } = useAuth()

const activeTab = ref('login')
const formattedPhone = ref('')
const formattedLoginPhone = ref('')
const showOtpForm = ref(false)
const currentPhone = ref('')
const otpCode = ref('')
const otpError = ref('')
const countdown = ref(0)
const countdownTimer = ref(null)
const otpLoading = ref(false)
const resendLoading = ref(false)
const currentAction = ref('') // 'login' or 'register'
const statusVerifyOtp = ref(null)

//store

onMounted(() => {

})


// Dynamic titles and descriptions
const getTitle = () => {
  if (showOtpForm.value) {
    return 'Verifikasi OTP'
  }
  return activeTab.value === 'login' ? 'Selamat Datang Kembali' : 'Bergabung Dengan Kami'
}

const getDescription = () => {
  if (showOtpForm.value) {
    return 'Masukkan kode 6 digit yang telah dikirim'
  }
  return activeTab.value === 'login'
    ? 'Masukkan nomor telepon untuk mendapatkan kode OTP'
    : 'Daftarkan akun baru dengan nomor telepon'
}

// Phone formatting function
const formatPhoneNumber = (phone) => {
  let cleaned = phone.replace(/\D/g, '')

  if (cleaned.startsWith('081')) {
    cleaned = '6281' + cleaned.substring(3)
  }
  else if (cleaned.startsWith('08')) {
    cleaned = '628' + cleaned.substring(2)
  }
  else if (cleaned.startsWith('62')) {
    // Keep as is
  }
  else if (cleaned.startsWith('8')) {
    cleaned = '62' + cleaned
  }

  return cleaned
}

// Handle phone input
const handlePhoneInput = (value) => {
    const onlyNumbers = value.replace(/\D/g, '')

  const formatted = formatPhoneNumber(value)
  formattedPhone.value = onlyNumbers
  registerForm.phone = formatted
  validateRegister('phone')
}

// Handle login phone input
const handleLoginPhoneInput = (value) => {
  const onlyNumbers = value.replace(/\D/g, '')
  const formatted = formatPhoneNumber(onlyNumbers)
  formattedLoginPhone.value = onlyNumbers
  loginForm.phone = formatted
  validateLogin('phone')
}

// Validation rules
const loginRules = {
  phone: (val) => {
    if (!val) return 'Nomor telepon wajib diisi'
    const cleaned = val.replace(/\D/g, '')
    if (!cleaned.startsWith('628')) return 'Nomor harus dimulai dengan 628'
    if (cleaned.length < 12 || cleaned.length > 15) return 'Nomor telepon harus 10-13 digit (tanpa 62)'
    return null
  }
}

const registerRules = {
  fullName: (val) => !val ? 'Nama wajib diisi' : null,
  phone: (val) => {
    if (!val) return 'Nomor telepon wajib diisi'
    const cleaned = val.replace(/\D/g, '')
    if (!cleaned.startsWith('628')) return 'Nomor harus dimulai dengan 628'
    if (cleaned.length < 12 || cleaned.length > 15) return 'Nomor telepon harus 10-13 digit (tanpa 62)'
    return null
  },
  agreeTerms: (val) => !val ? 'Harus menyetujui syarat' : null
}

// Forms
const {
  form: loginForm,
  errors: loginErrors,
  isSubmitting: loginLoading,
  validate: validateLogin
} = useForm({ phone: '' }, loginRules)

const {
  form: registerForm,
  errors: registerErrors,
  isSubmitting: registerLoading,
  validate: validateRegister
} = useForm({
  fullName: '',
  phone: '',
  agreeTerms: false
}, registerRules)

// Snackbar for notifications
// const snackbar = ref({
//   show: false,
//   message: "",
//   color: "#10b981",
//   icon: "mdi-check-circle",
// });
// function showSnackbar(message, color = "#10b981", icon = "mdi-check-circle") {
//   snackbar.value = { show: true, message, color, icon };
// }
// Computed
const isLoginFormValid = computed(() =>
  loginForm.phone && Object.keys(loginErrors.value).length === 0
)

const isRegisterFormValid = computed(() =>
  registerForm.fullName &&
  registerForm.phone &&
  registerForm.agreeTerms &&
  Object.keys(registerErrors.value).length === 0
)

const isOtpValid = computed(() =>
  otpCode.value && otpCode.value.length === 6 && !otpError.value
)

// OTP validation
const validateOtp = () => {
  if (!otpCode.value) {
    otpError.value = 'Kode OTP wajib diisi'
  } else if (otpCode.value.length !== 6) {
    otpError.value = 'Kode OTP harus 6 digit'
  } else if (!/^\d+$/.test(otpCode.value)) {
    otpError.value = 'Kode OTP hanya boleh berisi angka'
  } else {
    otpError.value = ''
  }
}

// Start countdown
const startCountdown = () => {
  countdown.value = 60
  countdownTimer.value = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownTimer.value)
    }
  }, 1000)
}

// Go back to form
const goBack = () => {
  showOtpForm.value = false
  otpCode.value = ''
  otpError.value = ''
  currentPhone.value = ''
  currentAction.value = ''
  if (countdownTimer.value) {
    clearInterval(countdownTimer.value)
  }
  countdown.value = 0
}

// Methods
const handleLogin = async () => {
  validateLogin()
  if (!isLoginFormValid.value) return

  try {
    // Send OTP for login
    currentPhone.value = loginForm.phone
    currentAction.value = 'login'

    // Verify user exists
    const { exists, user } = await verifyUser(loginForm.phone)
    if (!exists) {
      console.log('User does not exist')
      return
    }

    // Simulate sending OTP
    await sendOtp(loginForm.phone, user.fullname)

    showOtpForm.value = true
    startCountdown()

    // Show success message
    console.log('OTP sent to', loginForm.phone)
  } catch (error) {
    console.error('Error sending OTP:', error)
  }
}

const handleRegister = async () => {
  validateRegister()
  if (!isRegisterFormValid.value) return

  try {
    // Send OTP for registration
    currentPhone.value = registerForm.phone
    currentAction.value = 'register'

    // Simulate sending OTP
   const { success, error } = await register(
    registerForm.phone,
    registerForm.fullName,
  );

  if (!success) {
    alert("Register failed: " + error);
    return;
  }
    // Only send OTP after successful registration
   await sendOtp(registerForm.phone, registerForm.fullName);

    showOtpForm.value = true
    startCountdown()

    // Show success message
    console.log('OTP sent to', registerForm.phone)
  } catch (error) {
    console.error('Error sending OTP:', error)
  }
}


const handleVerifyOtp = async () => {
  validateOtp()
  if (!isOtpValid.value) return

  otpLoading.value = true
  try {

    if (currentAction.value === 'login') {
      statusVerifyOtp.value = await verifyOtp(currentPhone.value, otpCode.value, 'login')
      console.log('Login successful')
    } else {
       statusVerifyOtp.value = await verifyOtp(currentPhone.value, otpCode.value, 'register', registerForm.fullName)
      console.log('Registration successful')
    }
    console.log('statusVerifyOtp.value', statusVerifyOtp.value)
    if (statusVerifyOtp.value.success) {
      goBack()
    }

  } catch (error) {
    console.error('Error verifying OTP:', error)
    otpError.value = 'Kode OTP salah atau sudah kadaluarsa'
  } finally {
    otpLoading.value = false
  }
}



const resendOtp = async () => {
  resendLoading.value = true
  try {
    if (currentAction.value === 'login') {
      await sendOtp(currentPhone.value)
    } else {
      await sendOtp(currentPhone.value, registerForm.fullName)
    }

    startCountdown()
    otpCode.value = ''
    otpError.value = ''

    console.log('OTP resent to', currentPhone.value)
  } catch (error) {
    console.error('Error resending OTP:', error)
  } finally {
    resendLoading.value = false
  }
}


</script>

<style lang="scss" scoped>
.auth-container {
  width: 100%;
  max-width: 375px;
  height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}



.green-circle {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00d4aa 0%, #00b894 100%);
  z-index: 1;
  transition: all 0.5s ease;

  &.login-position {
    top: -30px;
    left: -30px;
  }

  &.register-position {
    top: -50px;
    right: -50px;
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  }
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 20px 20px;
  flex: 1;
  position: relative;
  z-index: 2;
  overflow-y: auto;
}

.logo-container {
  margin: 150px 0 8px;
  z-index: 2;
  flex-shrink: 0;
}

.circular-logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: visible;
  background: #fff;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s ease;
}

.corner-icon {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.text-content {
  text-align: center;
  margin: 8px 0 12px;
  z-index: 2;
  flex-shrink: 0;

  .title {
    font-size: 20px;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 6px;
    line-height: 1.2;
    transition: all 0.3s ease;
  }

  .description {
    font-size: 13px;
    color: #6c757d;
    line-height: 1.4;
    margin: 0;
    transition: all 0.3s ease;
  }
}

.auth-tabs-container {
  width: 100%;
  flex: 1;
  z-index: 2;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.auth-tabs {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  margin-bottom: 12px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.auth-tab {
  font-weight: 600;
  font-size: 14px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.auth-panels {
  background: transparent;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.auth-panel {
  padding: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.auth-form {
  display: flex ;
  flex-direction: column;
  gap: 16px;
  flex: 1;
}

.input-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.auth-input {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  backdrop-filter: blur(10px);

  :deep(.q-field__control) {
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }

  :deep(.q-field__native) {
    font-size: 16px;
    padding: 6px 0;
  }

  :deep(.q-field__label) {
    font-weight: 300;
    margin-top: -4px;
  }
}

.terms-container {
  display: flex;
  align-items: flex-start;
  gap: 8x;

}

.terms-text {
  margin-top: 10px;
  font-size: 13px;
  color: #6c757d;
  line-height: 1.3;
  flex: 1;
}

.terms-link {
  color: #00d4aa;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
}

.terms-checkbox {
  margin-top: -2px;
}

.error-text {
  font-size: 12px;
  color: #f56565;
  margin-top: 2px;
}

// OTP Form Styles
.otp-container {
  width: 100%;
  flex: 1;
  z-index: 2;
  display: flex;
  flex-direction: column;
}

.otp-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 20px;
  flex-shrink: 0;
}

.back-btn {
  margin-top: 2px;
  color: #6c757d;
}

.otp-info {
  flex: 1;
}

.otp-title {
  font-size: 18px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 4px 0;
}

.otp-subtitle {
  font-size: 13px;
  color: #6c757d;
  line-height: 1.4;
  margin: 0;
}

.otp-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
}

.otp-input-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.otp-input {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  backdrop-filter: blur(10px);

  :deep(.q-field__control) {
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  :deep(.q-field__native) {
    font-size: 20px;
    font-weight: 800;
    text-align: center;
    letter-spacing: 5px;
  }
}

.resend-container {
  text-align: center;
  padding: 4px 0;
}

.countdown-text {
  font-size: 13px;
  color: #6c757d;
}

.resend-btn {
  color: #00d4aa;
  font-weight: 600;
  font-size: 13px;
}

.auth-btn {
  width: 100%;
  height: 48px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 12px;
  transition: all 0.3s ease;
  text-transform: none;
  margin-top: auto;
  flex-shrink: 0;

  &:hover {
    transform: translateY(-1px);
  }

  &.login-btn {
    margin-bottom: 100px;
    background: linear-gradient(135deg, #00d4aa 0%, #00b894 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(0, 212, 170, 0.3);

    &:hover {
      box-shadow: 0 6px 16px rgba(0, 212, 170, 0.4);
    }
  }

  &.register-btn {
      margin-bottom: 100px;
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);

    &:hover {
      box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
    }
  }

  &.otp-btn {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);

    &:hover {
      box-shadow: 0 6px 16px rgba(255, 107, 107, 0.4);
    }
  }

  &:disabled {
    opacity: 0.6;
    transform: none;
  }
}

// Page transition animations
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

// Responsive adjustments
@media (max-width: 320px) {
  .circular-logo {
    width: 70px;
    height: 70px;
  }

  .text-content .title {
    font-size: 18px;
  }

  .green-circle {
    width: 180px;
    height: 180px;
  }

  .corner-icon {
    width: 24px;
    height: 24px;
  }

  .auth-input :deep(.q-field__native) {
    font-size: 15px;
  }

  .auth-btn {
    height: 44px;
    font-size: 14px;
  }

  .main-content {
    padding: 8px 16px 16px;
  }
}

@media (max-height: 600px) {
  .main-content {
    justify-content: flex-start;
    padding-top: 10px;
  }

  .logo-container {
    margin: 5px 0 8px;
  }

  .text-content {
    margin: 4px 0 12px;
  }

  .circular-logo {
    width: 70px;
    height: 70px;
  }

  .text-content .title {
    font-size: 18px;
    margin-bottom: 4px;
  }

  .text-content .description {
    font-size: 12px;
  }

  .input-container {
    gap: 10px;
  }

  .auth-form {
    gap: 12px;
  }
}

// Capacitor/Mobile specific adjustments
@media screen and (min-width: 376px) {
  .auth-container {
    max-width: none;
    width: 100vw;
  }

  .green-circle {
    width: min(200px, 30vw);
    height: min(200px, 30vw);

    &.login-position {
      top: -30px;
      left: -30px;
    }

    &.register-position {
      top: -50px;
      right: -50px;
    }
  }
}

// Swipe gesture support
.auth-container {
  touch-action: pan-x;
}

// Tab panel transitions
.auth-panels :deep(.q-tab-panel) {
  transition: all 0.3s ease;
}
</style>
