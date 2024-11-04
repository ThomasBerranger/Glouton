<script setup>
import router from "@/router";
import store from "@/assets/store";

const logout = () => {
  store.commit('changeToken', '');
  router.push('/login');
}
</script>

<template>
  <div class="w-screen screen-height flex flex-1 flex-col justify-center">
    <div class="text-center bg-white shadow-md">
      <!-- <h2 class="text-xl my-5">{{ auth.currentUser.email }}</h2> -->
      <button @click="logout" class="mb-4 border-2 border-red-500 rounded py-1.5 px-3 font-medium text-red-500">
        Se déconnecter
      </button>
    </div>
  </div>
</template>
