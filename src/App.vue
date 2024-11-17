<script setup>
import Header from "@/views/Layout/Header.vue";
import Footer from "@/views/Layout/Footer.vue";
</script>

<template>
  <Header />

  <main>
    <router-view v-slot="{ Component, route }">
      <transition name="fade">
        <component :is="Component" :key="route.path"></component>
      </transition>
    </router-view>
  </main>

  <Footer />
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>