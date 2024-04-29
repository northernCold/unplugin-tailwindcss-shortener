<script>
export default {
  name: 'HelloWorld1',
  props: {
    msg: String,
  },
}
</script>

<template>
  <div>
    <h1 class="text-3xl bg-red-500">Hello World 1 {{ msg }}</h1>
  </div>
</template>
