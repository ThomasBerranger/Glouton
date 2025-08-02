<script lang="ts" setup>
import {useTokenStore} from "@/stores/token.ts";
import {useShoppingListCounterStore} from "@/stores/shoppingListCount.ts";
import {onMounted} from "vue";
import axios from "axios";
import {PRODUCT_URL} from "@/constants/api";

const tokenStore = useTokenStore();
const shoppingListCounterStore = useShoppingListCounterStore();

onMounted(async () => {
  axios.get(`${PRODUCT_URL}/shopping-list?count=true`, {
    headers: {Authorization: `Bearer ${tokenStore.token}`},
  }).then(response => shoppingListCounterStore.setShoppingListCount(response.data))
      .catch(error => console.error("Shopping list count error :", error));
});
</script>

<template>
  <footer class="w-full flex justify-evenly items-center bg-white z-50" v-if="tokenStore.token">
    <router-link to="/" class="text-3xl">
      <font-awesome-icon icon="fa-solid fa-utensils"/>
    </router-link>

    <router-link to="/scan" class="px-5 py-2 rounded-full mb-12 green-background text-white">
      <font-awesome-icon icon="fa-solid fa-barcode" class="text-3xl"/>
    </router-link>

    <router-link to="/shopping-list" class="relative text-3xl">
      <span class="absolute top-1 pl-1 left-1/2 transform -translate-x-1/2 font-semibold text-xs text-white">
        {{ shoppingListCounterStore.shoppingListCount }}
      </span>
      <font-awesome-icon icon="fa-solid fa-cart-shopping"/>
    </router-link>
  </footer>
</template>

<style scoped>
.text-3xl.router-link-active {
  color: #49A078;
}
</style>