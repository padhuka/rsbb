<template>
  <q-btn
    class="btn"
    flat
    dense
    :icon="props.icon"
    :label="props.title"
    :to="props.link"
  />
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    default: "#",
  },

  icon: {
    type: String,
    default: "",
  },
});
</script>
