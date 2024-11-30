<script lang="ts" setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import type {Product} from "@/interfaces/product";
import {useTokenStore} from "@/stores/token";
import ListByDate from "@/components/Product/ListByDate.vue";
import ListByCategory from "@/components/Product/ListByCategory.vue";

const tokenStore = useTokenStore();
const products = ref<Product[]>([]);
const isListByCategoryActive = ref<boolean>(true)

onMounted(async () => {
  axios.get("https://glouton-fd999217b246.herokuapp.com/products", {
    headers: {Authorization: `Bearer ${tokenStore.token}`},
  }).then(response => products.value = response.data)
      .catch(error => console.error("Products error:", error));
});
</script>

<template>
  <div v-if="products.length > 0" class="min-screen-height">
    <Transition name="slide" mode="out-in">
      <component
          :is="isListByCategoryActive ? ListByDate : ListByCategory"
          :products="products"
      />
    </Transition>

    <div class="fixed bottom-20 right-3">
      <button class="border border-amber-800 rounded-md p-1" @click="isListByCategoryActive = !isListByCategoryActive">
        {{ isListByCategoryActive ? 'Catégories' : 'Dates' }}
        <font-awesome-icon icon="fa-solid fa-poo" class="text-2xl pl-1"/>
      </button>
    </div>
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