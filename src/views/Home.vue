<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import "vue3-carousel/dist/carousel.css";
import store from "@/assets/store";
import axios from "axios";
import type { Product } from "@/interfaces/product";

const products = ref<Record<number, Product>>({});

onMounted(async () => {
  console.log(store.state.token);

  axios
    .get("https://glouton-fd999217b246.herokuapp.com/products?limit=7", {
      headers: { Authorization: `Bearer ${store.state.token}` },
    })
    .then((response) => {
      products.value = response.data;
      products.value.forEach((element) => {
        console.log(element.name);
        element.expirationDates.forEach((element) => {
          console.log(element.date);
        });
      });
    })
    .catch((error) => {
      console.error("Error during poducts fetch:", error);
    });
});
</script>

<template>
  <div class="screen-height">


    <div class="h-2/5 w-screen grid grid-cols-4 gap-2 border border-1 border-blue-600">


      <div
        v-for="product in products"
        :key="product.id"
        class="flex items-center relative border border-1 border-gray-200 h-1/2"
      >
        <img
          :src="product.image"
          :alt="product.name"
          class="w-full h-full object-contain"
        />
        <div class="absolute bottom-0 right-0 p-2 bg-red-300">3</div>
      </div>

      
      <div
        v-for="product in products"
        :key="product.id"
        class="flex items-center relative border border-1 border-gray-200 h-1/2"
      >
        <img
          :src="product.image"
          :alt="product.name"
          class="w-full h-full object-contain"
        />
        <div class="absolute bottom-0 right-0 p-2 bg-red-300">3</div>
      </div>


    </div>
    <div class="h-2/5 border border-1 border-red-600">Recettes</div>
    <div class="h-1/5 border border-1 border-green-600">Shopping List</div>
  </div>
</template>
