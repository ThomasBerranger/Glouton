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
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

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
  }).then((response) => {
    recipes.value = response.data.sort((a: Recipe, b: Recipe) =>
        a.unavailableProducts - b.unavailableProducts
    ).slice(0, 3);
  })
      .catch(error => console.error("Recipe error:", error));
});
</script>

<template>
  <div class="screen-height w-screen bg-gray-100">

    <section class="grid grid-cols-4 gap-2 p-3">
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
        <router-link v-if="recipes.length <= 0" to="/recipes" class="w-full flex justify-center">
          <button class="rounded border-2 border-emerald-600 mt-2 py-1 px-3 text-emerald-800">
            <font-awesome-icon icon="fa-solid fa-plus"/>
          </button>
        </router-link>
        <List v-else :recipes="recipes"/>
      </div>
    </section>
  </div>
</template>
