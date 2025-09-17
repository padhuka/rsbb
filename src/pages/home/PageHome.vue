<template>
  <q-page class="healthcare-homepage">
    <!-- Health Check Banner -->
    <q-carousel
    v-model="slide"
    animated
    navigation
    infinite
    swipeable
    height="150px"
    class="health-check-carousel"
  >

    <q-carousel-slide
      v-for="(item, index) in banners"
      :key="index"
      :name="index"
      :style="{ background: item.bg }"
      class="health-check-banner"
    >
      <div class="banner-text">
        <div class="banner-title">{{ item.title }}</div>
        <div class="banner-title-bold">{{ item.titleBold }}</div>
        <div class="banner-subtitle">{{ item.subtitle }}</div>
      </div>
      <q-img
        :src="item.img"
        :alt="item.title"
        class="banner-image"
        width="125px"
        height="100px"
      />
    </q-carousel-slide>

  </q-carousel>

    <!-- Services Section -->
    <div class="services-section">
      <div class="section-header">
        <div class="section-title">Layanan</div>
        <div class="see-all-text" @click="viewAllServices">Semua</div>
      </div>

      <div class="services-grid">
        <q-card
          v-for="service in services"
          :key="service.id"
          class="service-card"
          @click="selectService(service)"
        >
          <q-card-section class="text-center">
            <q-icon :name="service.icon" class="service-icon" />
            <div class="service-name">{{ service.name }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Top Services Section -->
    <div class="top-services">
      <div class="section-header">
        <div class="section-title">Top Layanan</div>
      </div>

      <q-card
        v-for="topService in topServices"
        :key="topService.id"
        class="service-item"
        @click="selectTopService(topService)"
      >
        <q-card-section horizontal>
          <q-img
            :src="topService.image"
            :alt="topService.name"
            class="service-item-image"
            width="80px"
            height="80px"
          />
          <q-card-section class="service-item-content">
            <div class="service-item-title">{{ topService.name }}</div>
            <div class="service-item-subtitle">{{ topService.description }}</div>
            <div class="service-rating">
              <q-icon name="star" class="rating-star" />
              <span class="rating-text">{{ topService.rating }} ({{ topService.reviews }} Reviews)</span>
            </div>
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import banner1 from 'src/assets/gambar6.jpg'
import banner2 from 'src/assets/gambar2.jpg'
import banner3 from 'src/assets/gambar3.jpg'

const slide = ref(0)
const services = ref([
  { id: 1, name: 'Rawat Jalan', icon: 'people' },
  { id: 2, name: 'Pasang Infus', icon: 'medical_services' },
  { id: 3, name: 'Ganti Perban', icon: 'healing' },
  { id: 4, name: 'Fisoterapi', icon: 'business' },
  { id: 5, name: 'Ambulan', icon: 'local_shipping' },
  { id: 6, name: 'Cek Lab', icon: 'science' }
])

const banners = [
  {
    title: 'CEK KESEHATAN',
    titleBold: 'GRATIS',
    subtitle:
      'Akses pemeriksaan fisik gratis & Konsultasi dengan ahli kesehatan terpercaya kapan saja.',
    img: banner1,
    bg: 'linear-gradient(135deg, #00C896 0%, #00B386 100%)'
  },
  {
    title: 'KONSULTASI',
    titleBold: 'ONLINE',
    subtitle:
      'Bicara langsung dengan dokter profesional lewat smartphone kamu.',
    img: banner2,
    bg: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)'
  },
  {
    title: 'CEGAH PENYAKIT',
    titleBold: 'SEJAK DINI',
    subtitle:
      'Dapatkan tips kesehatan harian untuk menjaga tubuh tetap bugar.',
    img: banner3,
    bg: 'linear-gradient(135deg, #FF6B6B 0%, #E94E77 100%)'
  }
]

const topServices = ref([
  {
    id: 1,
    name: 'Cek Lab',
    description: 'Cek Laboratorium',
    rating: '4.9',
    reviews: '37',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=60&h=60&fit=crop'
  },
  {
    id: 2,
    name: 'Ganti Perban',
    description: 'Ganti Perban',
    rating: '4.9',
    reviews: '37',
    image: 'https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?w=60&h=60&fit=crop'
  }
])

const selectService = (service) => {
  console.log('Selected service:', service.name)
  // contoh: router.push(`/service/${service.id}`)
}

const selectTopService = (service) => {
  console.log('Selected top service:', service.name)
  // contoh: router.push(`/service/${service.id}`)
}

const viewAllServices = () => {
  console.log('View all services clicked')
}
</script>

<style lang="scss" scoped>
/* gaya sama persis dengan versi kamu */
.healthcare-homepage {
  background: #f5f5f5;
  min-height: 100vh;

}
.health-check-carousel {
  border-radius: 15px;
  margin: 15px;
  overflow: hidden;
  position: relative;
}

/* 🔽 Kustomisasi dots navigation */
.health-check-carousel .q-carousel__navigation {
  bottom: -14px; /* geser ke bawah */
}

.health-check-carousel .q-carousel__navigation .q-btn {
  width: 6px;
  height: 6px;
  min-width: 6px;
  min-height: 6px;
  border-radius: 50%;
  margin: 0 3px;
  opacity: 0.6;
}

.health-check-carousel .q-carousel__navigation .q-btn--active {
  opacity: 1;
  transform: scale(1.2); /* dot aktif sedikit lebih besar */
}

.health-check-banner {
  border-radius: 15px;
  padding: 10px;
  display: flex;
  align-items: center;
  color: white;
  position: relative;
}

.banner-text {
  flex: 1;
}

.banner-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 5px;
}

.banner-title-bold {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 5px;
}

.banner-subtitle {
  font-size: 11px;
  opacity: 0.9;
  line-height: 1.4;
}

.banner-image {
  border-radius: 10px;
  margin-left: 10px;
}

.custom-carousel .q-carousel__navigation {
  bottom: -12px;      /* geser ke bawah */
}

.custom-carousel .q-carousel__navigation .q-btn {
  width: 6px;         /* kecilkan bulat */
  height: 6px;
  min-width: 6px;
  min-height: 6px;
  border-radius: 50%;
  margin: 0 3px;      /* jarak antar bullet */
}


.services-section {
  padding: 15px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
}

.see-all-text {
  font-size: 14px;
  color: #666;
  cursor: pointer;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.service-card {
  background: linear-gradient(135deg, #4FD1C7 0%, #d2c730ff 100%);
  border-radius: 15px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  .q-card__section {
    padding: 5px 5px;
  }
}

.service-icon {
  font-size: 24px;
  color: #2d3748;
  margin-bottom: 10px;
}

.service-name {
  font-size: 12px;
  font-weight: 500;
  color: #2d3748;
  line-height: 1.3;
}

.top-services {
  padding: 0 15px 15px;
}

.service-item {
  background: linear-gradient(135deg, #f0fbfaff 0%, #ecf3eaff 100%);
  margin-bottom: 10px;
  cursor: pointer;
  transition: transform 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
  }

  .q-card__section {
    padding: 10px;
  }
}

.service-item-image {
  border-radius: 10px;
  margin-right: 15px;
}

.service-item-content {
  flex: 1;
}

.service-item-title {
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1px;
}

.service-item-subtitle {
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
}

.service-rating {
  display: flex;
  align-items: center;
  gap: 5px;
}

.rating-star {
  color: #FFC107;
  font-size: 16px;
}

.rating-text {
  font-size: 12px;
  color: #666;
}
</style>
