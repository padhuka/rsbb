<template>
  <q-page class="flex flex-center bg-grey-1">
    <div class="quest-container">
      <!-- Main Content -->
      <div class="main-content">
        <!-- Green Circle Background -->
        <div class="green-circle" :style="{ background: currentPage.circleColor }"></div>

        <!-- Image Container -->
        <div class="image-container">
          <div class="circular-image" :style="{ backgroundImage: `url(${currentPage.bgImage})` }">
            <!-- <q-icon
              :name="currentPage.icon"
              :color="currentPage.iconColor"
              size="80px"
            /> -->
            <!-- Medical Cross Icon -->
            <div class="corner-icon" :style="{ background: currentPage.cornerIconBg }">
              <q-icon :name="currentPage.cornerIcon" color="white" size="24px" />
            </div>
          </div>
        </div>

        <!-- Text Content -->
        <div class="text-content">
          <h2 class="title">{{ currentPage.title }}</h2>
          <p class="description">{{ currentPage.description }}</p>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <q-btn
            v-if="isLastPage"
            class="get-started-btn"
            label="Lanjut"
            no-caps
            unelevated
            rounded
            size="lg"
            @click="goToAuth"
          />

          <q-btn
            v-else
            class="get-started-btn"
            label="Lanjut"
            no-caps
            unelevated
            rounded
            size="lg"
            @click="nextPage"
          />

          <q-btn
            class="skip-btn"
            label="Skip"
            flat
            no-caps
            color="grey-7"
            @click="goToAuth"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import page1 from 'src/assets/gambar5.jpg'
import page2 from 'src/assets/gambar2.jpg'
import page3 from 'src/assets/gambar6.jpg'

// Composables
const router = useRouter()

// Reactive state
const currentPageIndex = ref(0)

// Data untuk 3 halaman quest
const questPages = ref([
  {
    id: 1,
    title: 'Pilih Layanan Home Care',
    description: 'Kami memberikan layanan home care yang membantu pasien lebih mudah',
    icon: 'local_hospital',
    iconColor: 'primary',
    circleColor: 'linear-gradient(135deg, #00d4aa 0%, #00b894 100%)',
    cornerIcon: 'add',
    cornerIconBg: '#00d4aa',
    bgImage: page1
  },
  {
    id: 2,
    title: 'Perawat Profesional',
    description: 'Tim perawat berpengalaman dan tersertifikasi siap memberikan perawatan terbaik untuk Anda',
    icon: 'people',
    iconColor: 'secondary',
    circleColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    cornerIcon: 'verified',
    cornerIconBg: '#667eea',
    bgImage: page2
  },
  {
    id: 3,
    title: 'Layanan 24/7',
    description: 'Tersedia kapan saja Anda membutuhkan, dengan respons cepat dan pelayanan terpercaya',
    icon: 'schedule',
    iconColor: 'orange',
    circleColor: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    cornerIcon: 'notifications_active',
    cornerIconBg: '#ff9a56',
    bgImage: page3
  }
])


// Computed properties
const currentPage = computed(() => questPages.value[currentPageIndex.value])
const isLastPage = computed(() => currentPageIndex.value === questPages.value.length - 1)

// Methods
const nextPage = () => {
  if (currentPageIndex.value < questPages.value.length - 1) {
    currentPageIndex.value++
  }
}

// const previousPage = () => {
//   if (currentPageIndex.value > 0) {
//     currentPageIndex.value--
//   }
// }

const goToAuth = () => {
  // Navigasi ke halaman auth
  console.log('Navigating to auth page...')
   router.push({ name: 'authPage' })
}

// const goToPage = (index) => {
//   currentPageIndex.value = index
// }
</script>

<style lang="scss" scoped>
.quest-container {
  width: 100vw;
  min-width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  position: relative;
  overflow: hidden;

  @supports (-webkit-touch-callout: none) {
    height: 100vh;
    height: -webkit-fill-available;
  }

  @media screen and (max-width: 768px) {
    max-width: none;
    width: 100vw;
  }
}

.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px 8px;
  background: transparent;

  .time {
    font-weight: 600;
    font-size: 16px;
    color: #000;
  }

  .status-icons {
    display: flex;
    gap: 4px;
    align-items: center;
  }
}

.progress-container {
  display: flex;
  justify-content: center;
  padding: 20px 0 10px;
  z-index: 3;
  position: relative;
}

.progress-dots {
  display: flex;
  gap: 12px;
}

.progress-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &.active {
    background: #00d4aa;
    transform: scale(1.2);
  }
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  height: calc(100vh - 120px);
  position: relative;
}

.green-circle {
  position: absolute;
  top: -50px;
  left: -50px;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  z-index: 1;
  transition: all 0.5s ease;
}

.image-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  margin-top: 40px;
}

.circular-image {
  width: 280px;
  height: 280px;
  border-radius: 50%;
  overflow: visible;
  background: #fff;
  background-size: cover;      /* gambar cover penuh lingkaran */
  background-position: center; /* fokus di tengah */
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s ease;
}

.corner-icon {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.text-content {
  text-align: center;
  margin: 40px 0;
  z-index: 2;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .title {
    font-size: 28px;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 16px;
    line-height: 1.3;
    transition: all 0.3s ease;
  }

  .description {
    font-size: 16px;
    color: #6c757d;
    line-height: 1.5;
    margin: 0;
    padding: 0 20px;
    transition: all 0.3s ease;
  }
}

.action-buttons {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 2;
  margin-bottom: 40px;
}

.get-started-btn {
  width: 100%;
  height: 56px;
  font-size: 16px;

  font-weight: 600;
  background: linear-gradient(135deg, #00d4aa 0%, #00b894 100%);
  box-shadow: 0 8px 24px rgba(0, 212, 170, 0.3);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 12px 32px rgba(0, 212, 170, 0.4);
    transform: translateY(-2px);
  }
}

.skip-btn {
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(108, 117, 125, 0.1);
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
  .circular-image {
    width: 240px;
    height: 240px;
  }

  .text-content .title {
    font-size: 24px;
  }

  .green-circle {
    width: 250px;
    height: 250px;
  }
}

// Swipe gesture support (optional)
.quest-container {
  touch-action: pan-x;
}
</style>
