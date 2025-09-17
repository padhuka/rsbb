<template>
  <q-toolbar-title>
    <div class="absolute-center">
      <q-icon name="local_hospital" size="sm" />
      {{ props.toolbarTitle }}
    </div>
  </q-toolbar-title>
</template>

<script setup>
// import { ref } from "vue";

const props = defineProps({
  toolbarTitle: String,
});
</script>
