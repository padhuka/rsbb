<template>
  <q-page class="flex flex-center">
    <div class="profile-container">
      <!-- Main Content -->
      <div class="main-content">
        <!-- Header Section -->
        <div class="header-section">
          <div class="profile-avatar">
            <q-icon name="person_outline" size="24px" color="white" />
            <div class="avatar-badge">
              <q-icon name="edit" size="12px" color="white" />
            </div>
          </div>
          <h1 class="main-title">Setting Profile</h1>
          <p class="subtitle">Lengkapi profile Anda</p>
        </div>

        <!-- Form Container -->
        <div class="form-wrapper">
          <q-form @submit="handleSubmit" class="profile-form">
            <!-- Email Section -->
            <div class="form-group">
              <label class="form-label">
                <q-icon name="email" size="18px" />
                Email
              </label>
              <q-input
                v-model="profileForm.email"
                placeholder="your@email.com"
                outlined
                dense
                class="form-input"
                :error="!!profileErrors.email"
                :error-message="profileErrors.email"
                @blur="validateProfile('email')"
                type="email"
              />
            </div>

            <!-- Address Section -->
            <div class="form-group">
              <label class="form-label">
                <q-icon name="home" size="18px" />
                Alamat Rumah
              </label>
              <q-input
                v-model="profileForm.address"
                placeholder="Alamat lengkap Anda"
                outlined
                dense
                type="textarea"
                rows="2"
                class="form-input"
                :error="!!profileErrors.address"
                :error-message="profileErrors.address"
                @blur="validateProfile('address')"
              />
            </div>

            <!-- Location Section -->
            <div class="form-group location-group">
              <label class="form-label">
                <q-icon name="place" size="18px" />
                Koordinat Lokasi
                <q-btn
                  round
                  dense
                  unelevated
                  icon="my_location"
                  size="sm"
                  @click="getCurrentLocation"
                  :loading="locationLoading"
                  class="location-btn"
                />
              </label>

              <div class="coordinates-row">
                <div class="coord-input">
                  <span class="coord-label">Lat</span>
                  <q-input
                    v-model="profileForm.latitude"
                    placeholder="-6.2088"
                    outlined
                    dense
                    readonly
                    class="form-input coord-field"
                    :error="!!profileErrors.latitude"
                  />
                </div>
                <div class="coord-input">
                  <span class="coord-label">Lng</span>
                  <q-input
                    v-model="profileForm.longitude"
                    placeholder="106.8456"
                    outlined
                    dense
                    readonly
                    class="form-input coord-field"
                    :error="!!profileErrors.longitude"
                  />
                </div>
              </div>

              <!-- Location Status -->
              <div v-if="profileForm.latitude && profileForm.longitude" class="location-status">
                <q-icon name="check_circle" size="16px" color="positive" />
                <span>Lokasi berhasil terdeteksi</span>
              </div>
            </div>

            <!-- Photo Section -->
            <div class="form-group">
              <label class="form-label">
                <q-icon name="photo_camera" size="18px" />
                Foto Profil <span class="optional">(Opsional)</span>
              </label>

              <div class="photo-upload" @click="selectPhoto">
                <div v-if="!profilePhoto" class="upload-area">
                  <q-icon name="add_a_photo" size="24px" />
                  <span>Tambah Foto</span>
                </div>
                <div v-else class="photo-preview">
                  <img :src="profilePhoto" alt="Profile" />
                  <div class="photo-overlay">
                    <q-icon name="edit" size="16px" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
              <q-btn
                type="submit"
                unelevated
                class="save-btn"
                :loading="submitLoading"
                :disable="!isFormValid"
                no-caps
                size="md"
              >
                <q-icon name="save" size="18px" />
                Simpan Profile
              </q-btn>

              <q-btn
                flat
                class="logout-btn"
                @click="logout()"
                no-caps
                size="sm"
              >
                <q-icon name="logout" size="16px" />
                Logout
              </q-btn>
            </div>
          </q-form>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from 'src/composables/useForm'
import supabase from 'src/config/supabase'
import  { useStoreAuth } from 'src/stores/storeAuth'
import { Geolocation } from '@capacitor/geolocation'


const storeAuth = useStoreAuth()
const router = useRouter()
const locationLoading = ref(false)
const submitLoading = ref(false)
const profilePhoto = ref('') // base64 preview
const photoFile = ref(null)  // file asli untuk upload



onMounted(async () => {
  console.log('User ID:', storeAuth.userId)

  if (storeAuth.userId) {
    await loadProfile()
  }
})

// Snackbar for notifications
const snackbar = ref({
  show: false,
  message: "",
  color: "#10b981",
  icon: "check_circle",
})

function showSnackbar(message, color = "#10b981", icon = "check_circle") {
  snackbar.value = { show: true, message, color, icon }
}

// Validation rules
const profileRules = {
  email: (val) => {
    if (!val) return 'Email tidak boleh kosong'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(val)) return 'Email tidak valid'
    return null
  },
  address: (val) => {
    if (!val) return 'Alamat tidak boleh kosong'
    if (val.length < 10) return 'Alamat terlalu pendek'
    return null
  },
  latitude: (val) => {
    if (!val) return 'Latitude tidak boleh kosong'
    const lat = parseFloat(val)
    if (isNaN(lat) || lat < -90 || lat > 90) return 'Invalid latitude'
    return null
  },
  longitude: (val) => {
    if (!val) return 'Longitude tidak boleh kosong'
    const lng = parseFloat(val)
    if (isNaN(lng) || lng < -180 || lng > 180) return 'Invalid longitude'
    return null
  }
}

// Form setup
const {
  form: profileForm,
  errors: profileErrors,
  validate: validateProfile
} = useForm({
  email: '',
  address: '',
  latitude: '',
  longitude: ''
}, profileRules)

// Computed
const isFormValid = computed(() =>
  profileForm.email &&
  profileForm.address &&
  profileForm.latitude &&
  profileForm.longitude &&
  Object.keys(profileErrors.value).length === 0
)

// Logout
const logout = async () => {
 await storeAuth.logout()
 router.push({ name: 'guest' })
}

// Get current location
const getCurrentLocation = async () => {
  try {
    locationLoading.value = true

    const permission = await Geolocation.requestPermissions()
    console.log('permission:', permission)


    const coordinates = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000
    })
    console.log('coordinates', coordinates)


    profileForm.latitude = coordinates.coords.latitude.toFixed(6)
    profileForm.longitude = coordinates.coords.longitude.toFixed(6)

    validateProfile('latitude')
    validateProfile('longitude')

    console.log('Lat:', profileForm.latitude, 'Lng:', profileForm.longitude)
  } catch (error) {
    console.error('Error getting location:', error)
  } finally {
    locationLoading.value = false
  }
}

// Pilih foto
const selectPhoto = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      photoFile.value = file

      // Preview
      const reader = new FileReader()
      reader.onload = (e) => {
        profilePhoto.value = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }
  input.click()
}

// Upload foto ke Supabase Storage
const uploadPhoto = async (userId) => {
  if (!photoFile.value) return null

  const fileExt = photoFile.value.name.split('.').pop()
  const filePath = `${userId}/avatar.${fileExt}`

  const { error } = await supabase.storage
    .from('avatars')
    .upload(filePath, photoFile.value, {
      cacheControl: '3600',
      upsert: true, // kalau ada file lama, timpa
    })

  if (error) throw error

  return filePath
}

// Handle form submission
const handleSubmit = async () => {
  validateProfile()
  if (!isFormValid.value) return

  submitLoading.value = true
  try {

    const currentUser = storeAuth.userId
     // ✅ Upload foto jika ada
    let avatarPath = null
    if (photoFile.value) {
      avatarPath = await uploadPhoto(currentUser)
    }

    const updateData = {
      email: profileForm.email,
      address: profileForm.address,
      latitude: parseFloat(profileForm.latitude),
      longitude: parseFloat(profileForm.longitude),
    }

    if (avatarPath) {
      updateData.avatar = avatarPath
    }

  const { data, error } = await supabase
      .from('users_rsbb')
      .update(updateData)
      .eq('id', currentUser)
      .select()
      .single()

    if (error) throw error

       // Sync form dengan hasil terbaru dari DB
      profileForm.email = data.email
      profileForm.address = data.address
      profileForm.latitude = data.latitude.toString()
      profileForm.longitude = data.longitude.toString()

        // ✅ ambil public URL utk avatar
    if (data.avatar) {
      const { data: publicUrl } = supabase.storage
        .from('avatars')
        .getPublicUrl(data.avatar)

      profilePhoto.value = publicUrl.publicUrl
    }

      showSnackbar('Profile saved successfully!', '#10b981', 'check_circle')
      router.push({ name: 'pageHome' })
      showSnackbar('Profile saved successfully!', '#10b981', 'check_circle')
      router.push({ name: 'pageHome' })


  } catch (error) {
    console.error('Error saving profile:', error)
    showSnackbar('Failed to save profile', '#ef4444', 'error')
  } finally {
    submitLoading.value = false
  }
}

// ✅ Ambil data user dari DB
const loadProfile = async () => {
  try {
    const { data, error } = await supabase
      .from('users_rsbb')
      .select('email, avatar, address, latitude, longitude')
      .eq('id', storeAuth.userId)
      .single()

    if (error) throw error

    if (data) {
      profileForm.email = data.email || ''
      profileForm.address = data.address || ''
      profileForm.latitude = data.latitude?.toString() || ''
      profileForm.longitude = data.longitude?.toString() || ''
      if (data.avatar) {
        // ✅ ambil public URL dari storage
        const { data: publicUrl } = supabase.storage
          .from('avatars')
          .getPublicUrl(data.avatar)

        profilePhoto.value = publicUrl.publicUrl
      }
    }

    console.log('✅ Profile loaded:', data)
  } catch (err) {
    console.error('❌ Failed to load profile:', err)
    showSnackbar('Gagal mengambil data profil', '#ef4444', 'error')
  }
}
</script>

<style lang="scss" scoped>
.profile-container {
  width: 100%;
  max-width: 400px;
  min-height: 100vh;
  background: #fafafa;
  position: relative;
}

.main-content {
  padding: 20px;
  min-height: 100vh;
}

// Header Section - More compact
.header-section {
  text-align: center;
  padding: 20px 0 30px;
  background: white;
  border-radius: 16px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.profile-avatar {
  width: 60px;
  height: 60px;
  margin: 0 auto 16px;
  background: linear-gradient(135deg, #00C896 0%, #00B386 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 4px 16px rgba(0,200,150,0.3);
}

.avatar-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 20px;
  height: 20px;
  background: #667eea;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
}

.main-title {
  font-size: 22px;
  font-weight: 700;
  color: #333;
  margin: 0 0 4px;
}

.subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}

// Form - More compact
.form-wrapper {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

// Form Groups - Simplified
.form-group {
  &.location-group {
    background: #f8f9ff;
    border-radius: 12px;
    padding: 16px;
    border: 1px solid #e8eaff;
  }
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;

  .optional {
    font-weight: 400;
    color: #999;
    font-size: 12px;
  }

  .location-btn {
    margin-left: auto;
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;

    &:hover {
      background: rgba(102, 126, 234, 0.2);
    }
  }
}

// Simplified Inputs
.form-input {
  :deep(.q-field__control) {
    background: #fafafa;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    min-height: 40px;

    &:hover {
      border-color: #00C896;
    }

    &:focus-within {
      border-color: #00C896;
      box-shadow: 0 0 0 2px rgba(0,200,150,0.1);
    }
  }

  :deep(.q-field__native) {
    color: #333;
    font-size: 14px;

    &::placeholder {
      color: #999;
    }
  }
}

// Coordinates - Inline layout
.coordinates-row {
  display: flex;
  gap: 12px;
}

.coord-input {
  flex: 1;

  .coord-label {
    display: block;
    font-size: 11px;
    color: #666;
    font-weight: 500;
    margin-bottom: 4px;
  }
}

.coord-field {
  :deep(.q-field__native) {
    text-align: center;
    font-size: 12px;
    font-family: monospace;
  }
}

// Location Status
.location-status {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  padding: 6px 10px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 6px;

  span {
    font-size: 12px;
    color: #4caf50;
    font-weight: 500;
  }
}

// Photo Upload - Compact
.photo-upload {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
}

.upload-area {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  border: 2px dashed #ddd;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #999;

  span {
    font-size: 10px;
    font-weight: 500;
  }

  &:hover {
    border-color: #00C896;
    color: #00C896;
  }
}

.photo-preview {
  width: 100%;
  height: 100%;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .photo-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
    color: white;
  }

  &:hover .photo-overlay {
    opacity: 1;
  }
}

// Action Buttons - More compact
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}

.save-btn {
  height: 48px;
  background: linear-gradient(135deg, #00C896 0%, #00B386 100%);
  color: white;
  border-radius: 12px;
  font-weight: 600;
  gap: 8px;
  box-shadow: 0 4px 16px rgba(0,200,150,0.3);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0,200,150,0.4);
  }

  &:disabled {
    opacity: 0.6;
    transform: none;
  }
}

.logout-btn {
  height: 40px;
  color: #ef4444;
  border-radius: 8px;
  gap: 6px;

  &:hover {
    background: rgba(239, 68, 68, 0.1);
  }
}

// Responsive
@media (max-width: 360px) {
  .main-content {
    padding: 16px;
  }

  .coordinates-row {
    flex-direction: column;
    gap: 8px;
  }

  .coord-input {
    .coord-label {
      display: inline-block;
      margin-right: 8px;
      margin-bottom: 0;
    }
  }
}

@media screen and (min-width: 401px) {
  .profile-container {
    max-width: none;
    width: 100vw;
  }
}
</style>
