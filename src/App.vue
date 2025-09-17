<template>
  <div v-if="storeAuth.isLoadingSession" class="flex items-center justify-center h-screen">
    <q-spinner color="primary" size="40px" />
  </div>
  <router-view v-else />
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import { useStoreAuth } from "src/stores/storeAuth";
import supabase from "src/config/supabase";

let authSubscription = null;
const storeAuth = useStoreAuth();
onMounted(() => {
  const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
    storeAuth.handleAuthChange(event, session);
  });
  authSubscription = subscription;
});
onUnmounted(() => {
  if (authSubscription) {
    authSubscription.unsubscribe();
  }
});

</script>
