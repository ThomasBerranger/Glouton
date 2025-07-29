<script lang="ts" setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import type {Product} from "@/interfaces/product";
import {useTokenStore} from "@/stores/token";
import ListByDate from "@/components/Product/ListByDate.vue";
import ListByCategory from "@/components/Product/ListByCategory.vue";
import {PRODUCT_URL} from "@/constants/api.ts";

const tokenStore = useTokenStore();
const products = ref<Product[]>([]);
const isListByCategoryActive = ref<boolean>(true)

onMounted(async () => {
  axios.get(`${PRODUCT_URL}?limit=1000`, {
    headers: {Authorization: `Bearer ${tokenStore.token}`},
  }).then(response => products.value = response.data)
      .catch(error => console.error("Products error:", error));
});
</script>

<template>
  <div class="min-screen-height bg-gray-100">
    <div class="w-full flex justify-around mt-3">
      <button class="rounded-md p-0.5 text-white green-background pt-1.5 pl-2 pr-3">
        <font-awesome-icon icon="fa-solid fa-arrow-down-1-9" class="text-2xl pl-1"/>
      </button>
      <button class="rounded-md text-white green-background p-1" @click="isListByCategoryActive = !isListByCategoryActive">
        <font-awesome-icon icon="fa-solid fa-carrot" class="text-2xl pl-3 pr-2"/>
      </button>
    </div>

    <Transition name="slide" mode="out-in">
      <component
          :is="isListByCategoryActive ? ListByDate : ListByCategory"
          :products="products"
      />
    </Transition>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.1s ease;
}

.slide-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>