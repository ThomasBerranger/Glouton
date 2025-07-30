<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {RouterLink} from "vue-router";
import axios from "axios";
import moment from "moment";
import {useTokenStore} from "@/stores/token";
import type {Product} from "@/interfaces/product";
import type {Recipe} from "@/interfaces/recipe";
import {PRODUCT_URL, RECIPE_URL} from "@/constants/api.ts";
import ExpirationLabel from "@/components/ExpirationLabel.vue";

const tokenStore = useTokenStore();
const products = ref<Product[]>([]);
const recipes = ref<Recipe[]>([]);

onMounted(async () => {
  axios.get(`${PRODUCT_URL}?limit=11`, {
    headers: {Authorization: `Bearer ${tokenStore.token}`},
  }).then(response => products.value = response.data)
      .catch(error => console.error("Products error:", error));

  axios.get(RECIPE_URL, {
    headers: {Authorization: `Bearer ${tokenStore.token}`},
  }).then(response => recipes.value = response.data)
      .catch(error => console.error("Recipes error:", error));
});
</script>

<template>
  <div class="screen-height bg-gray-100">

    <section class="h-3/5 w-screen p-3 grid grid-cols-4 gap-3 grid-rows-3">
      <router-link :to="{name: 'product.details', params: { id: product.id }}"
                   v-for="product in products" class="relative bg-white shadow-md p-2">
        <ExpirationLabel :expiration-date="product.expirationDates[0].date"/>
        <img
            :src="product.image"
            :alt="product.name"
            class="w-full h-full object-contain"
        />
      </router-link>

      <router-link
          to="/products"
          class="flex justify-center items-center relative rounded-xl border border-1 text-white green-background text-3xl"
      >
        <font-awesome-icon icon="fa-solid fa-boxes-packing"/>
      </router-link>
    </section>

    <section class="h-1/5 border border-1 border-red-600">
      <ul>
        <li v-for="recipe in recipes" class="p-2">
          - {{ recipe.name }} : {{ recipe.duration }}
        </li>
      </ul>
      <div class="flex justify-center">
      <router-link
          to="/recipes"
          class="w-1/2 text-center rounded border border-1 text-white font-semibold bg-orange-600 opacity-60"
      >
        Recettes
      </router-link>
      </div>
    </section>
  </div>
</template>
