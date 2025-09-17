<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header Section -->
<q-header class="custom-header text-white">
  <HeaderSection />
</q-header>
    <!-- Main Content -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Bottom Navigation -->
    <q-footer class="bg-primary">
      <q-tabs
        v-model="currentTab"
        dense
        class="text-white bottom-navigation"
        active-color="white"
        indicator-color="transparent"
        align="justify"
      >
        <q-tab
          name="home"
          icon="home"
          label="Home"
          @click="navigateTo('/')"
          class="nav-tab"
        />
        <q-tab
          name="search"
          icon="favorite"
          label="Cari"
          @click="navigateTo('/search')"
          class="nav-tab"
        />
        <q-tab
          name="booking"
          icon="calendar_today"
          label="Pesanan"
          @click="navigateTo('/booking')"
          class="nav-tab"
        />
        <q-tab
          name="profile"
          icon="person"
          label="Profile"
          @click="navigateTo('/profile-setup')"
          class="nav-tab"
        />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const currentTab = ref('home')

// Watch for route changes to update active tab
watch(
  () => route.path,
  (newPath) => {
    if (newPath === '/') currentTab.value = 'home'
    else if (newPath.includes('/search')) currentTab.value = 'search'
    else if (newPath.includes('/booking')) currentTab.value = 'booking'
    else if (newPath.includes('/profile')) currentTab.value = 'profile'
  },
  { immediate: true }
)

const navigateTo = (path) => {
  router.push(path)
}
</script>

<style lang="scss" scoped>
.q-layout {
  background: #f5f5f5;
}
.custom-header {
  background: linear-gradient(135deg, #00C896 0%, #00B386 100%);
    border-radius: 0 0 25px 25px;
}

.bottom-navigation {
  background: linear-gradient(135deg, #00C896 0%, #00B386 100%);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);

  .nav-tab {
    flex-direction: column;
    min-height: 60px;

    :deep(.q-tab__content) {
      .q-tab__icon {
        font-size: 24px;
        margin-bottom: 4px;
      }

      .q-tab__label {
        font-size: 12px;
        font-weight: 500;
      }
    }
  }
}

:deep(.q-page-container) {
  padding-bottom: 60px; // Space for bottom navigation
}
</style>
