<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {RouterLink} from "vue-router";
import axios from "axios";
import {useTokenStore} from "@/stores/token";
import type {Product} from "@/interfaces/product";
import type {Recipe} from "@/interfaces/recipe";
import {PRODUCT_URL, RECIPE_URL} from "@/constants/api.ts";
import kitchenImg from '@/assets/kitchen.png'
import List from "@/components/Recipe/List.vue";
import Card from "@/components/Product/Card.vue";

const tokenStore = useTokenStore();
const products = ref<Product[]>([]);
const recipes = ref<Recipe[]>([]);

onMounted(async () => {
  axios.get(`${PRODUCT_URL}?limit=15`, {
    headers: {Authorization: `Bearer ${tokenStore.token}`},
  }).then(response => products.value = response.data)
      .catch(error => console.error("Products error:", error));

  axios.get(RECIPE_URL, {
    headers: {Authorization: `Bearer ${tokenStore.token}`},
  }).then(response => recipes.value = response.data)
      .catch(error => console.error("Recipe error:", error));
});
</script>

<template>
  <div class="screen-height w-screen bg-gray-100">

    <section class="grid grid-cols-4 gap-3 p-3">
      <Card v-for="product in products" :product="product" :display-title="false" :key="product.id"/>

      <router-link
          to="/products"
          class="flex justify-center items-center relative rounded-xl border border-1 text-white green-background text-3xl"
      >
        <img :src="kitchenImg" alt="kitchen logo" class="brightness-0 invert"/>
      </router-link>
    </section>

    <section>
      <div class="flex justify-center bg-white mb-2 px-3">
        <router-link
            to="/recipes"
            class="w-full green-background text-white font-title tracking-wider py-0.5 text-center"
        >
          Recettes
        </router-link>
      </div>

      <div class="px-3">
        <List :recipes="recipes"/>
      </div>
    </section>
  </div>
</template>
