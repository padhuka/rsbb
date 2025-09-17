<template>
  <!-- Search Bar -->
      <div class="search-container">
        <q-input
          v-model="searchText"
          placeholder="Cari layanan"
          outlined
          dense
          bg-color="white"
          class="search-input">
          <template v-slot:prepend>
            <q-icon name="search" color="grey-6" />
          </template>
        </q-input>
      </div>
</template>

<script setup>
import { ref } from 'vue'
// import { useStoreAuth } from 'src/stores/storeAuth'

// const storeAuth = useStoreAuth()
const searchText = ref('')

// const searchService = async () => {
//   console.log('Searching for:', searchText.value)
//   // storeAuth.showSnackbar('Searching...', '#10b981', 'mdi-magnify')
// }
</script>
<style scoped>
.search-container {
  .search-input {
    border-radius: 15px;

    :deep(.q-field__control) {
      border-radius: 15px;
    }
  }
}
</style>
