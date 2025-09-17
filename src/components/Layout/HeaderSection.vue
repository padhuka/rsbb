<template>
    <div class="header-section">
      <div class="greeting-row">
        <div class="greeting-text">  Selamat {{ timeGreeting }}, {{ storeAuth.fullname }}</div>
        <q-avatar size="35px">
               <img v-if="storeAuth.avatarUrl" :src="storeAuth.avatarUrl" alt="avatar" />
      <q-icon v-else name="person" />
        </q-avatar>
      </div>

      <SearchLink />

    </div>
</template>

<script setup>
import { computed } from 'vue'
import  { useStoreAuth } from 'src/stores/storeAuth'

const storeAuth = useStoreAuth()

// Time-based Greeting
const timeGreeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return "Pagi";
  if (hour < 18) return "Siang";
  return "Malam";
});
</script>

<style scoped>
.header-section {
  background: linear-gradient(135deg, #00C896 0%, #00B386 100%);
  padding: 10px 20px 20px;
  color: white;
  border-radius: 0 0 25px 25px;
}
.greeting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.greeting-text {
  font-size: 16px;
  font-weight: 400;
}
</style>
