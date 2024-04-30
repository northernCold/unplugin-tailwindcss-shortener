<script setup>
defineProps({
  msg: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div>
    <h1 class="text-3xl bg-red-500">Hello World 1 {{ msg }}</h1>
  </div>
</template>
