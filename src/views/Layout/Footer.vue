<script setup></script>

<template>
  <footer class="w-full flex justify-evenly items-center bg-white">
    <router-link to="/" class="text-2xl">
      <font-awesome-icon icon="fa-solid fa-utensils"/>
    </router-link>

    <router-link to="/scan" class="px-5 py-2 rounded-full mb-12 green-background text-white">
      <font-awesome-icon icon="fa-solid fa-barcode" class="text-3xl"/>
    </router-link>

    <router-link to="/shopping-list" class="text-2xl">
      <font-awesome-icon icon="fa-solid fa-cart-shopping"/>
    </router-link>
  </footer>
</template>

<style scoped>
.text-2xl.router-link-active {
  color: #49A078;
}
</style>