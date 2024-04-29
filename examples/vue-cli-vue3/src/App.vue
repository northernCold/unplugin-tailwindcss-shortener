<script setup>
import HelloWorld1 from './components/HelloWorld1.vue'
import HelloWorld2 from './components/HelloWorld2.vue'
import HelloWorld3 from './components/HelloWorld3.vue';
</script>

<template>
  <HelloWorld1 msg="one" />
  <HelloWorld2 msg="two" />
  <HelloWorld3 msg="three" />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
