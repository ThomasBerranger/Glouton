<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import "vue3-carousel/dist/carousel.css";
import store from "@/assets/store"; // todo: remplacer par pinia
import axios from "axios";
import type { Product } from "@/interfaces/product";
import type { Recipe } from "@/interfaces/recipe";

const products = ref<Record<number, Product>>({});
const recipes = ref<Record<number, Recipe>>({});

onMounted(async () => {
  try {
    const [productsResponse, recipesResponse] = await Promise.all([
      axios.get("https://glouton-fd999217b246.herokuapp.com/products?limit=8", {
        headers: { Authorization: `Bearer ${store.state.token}` },
      }),
      axios.get("https://glouton-fd999217b246.herokuapp.com/recipes", {
        headers: { Authorization: `Bearer ${store.state.token}` },
      }),
    ]);

    products.value = productsResponse.data;
    recipes.value = recipesResponse.data;
  } catch (error) {
    console.error("Error during fetch:", error);
  }
});
</script>

<template>
  <div class="screen-height">
    <section div class="h-3/5 w-screen p-1 grid gap-1 grid-cols-4 grid-rows-3">
      <div v-for="product in products" class="relative">
        <img
          :src="product.image"
          :alt="product.name"
          class="w-full h-full object-contain"
        />
        <div class="absolute bottom-0 right-0 p-2 bg-red-300">3</div>
      </div>
      <div class="rounded-xl bg-green-200"></div>
      <div class="rounded-xl bg-green-200"></div>
      <div
        class="col-span-2 flex justify-center items-center relative rounded-xl border border-1 border-gray-200 text-white font-semibold bg-slate-400"
      >
        Tout voir
      </div>
    </section>
    <div class="h-1/5 border border-1 border-red-600">
      <ul>
        <li v-for="recipe in recipes" class="p-2">
          - {{ recipe.name }} : {{ recipe.duration }}
        </li>
      </ul>
    </div>
    <div class="h-1/5 border border-1 border-green-600 p-2">Shopping List</div>
  </div>
</template>
