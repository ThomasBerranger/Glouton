<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {RouterLink} from "vue-router";

import store from "@/assets/store"; // todo: remplacer par pinia

import axios from "axios";
import moment from "moment";

import type {Product} from "@/interfaces/product";
import type {Recipe} from "@/interfaces/recipe";

const products = ref<Record<number, Product>>({});
const recipes = ref<Record<number, Recipe>>({});
const shoppingListCount = ref<number>(0);

onMounted(async () => {
  axios.get("https://glouton-fd999217b246.herokuapp.com/products?limit=8", {
    headers: {Authorization: `Bearer ${store.state.token}`},
  }).then(response => products.value = response.data)
      .catch(error => console.error("Products error:", error));

  axios.get("https://glouton-fd999217b246.herokuapp.com/recipes", {
    headers: {Authorization: `Bearer ${store.state.token}`},
  }).then(response => recipes.value = response.data)
      .catch(error => console.error("Recipes error:", error));

  axios.get(
      "https://glouton-fd999217b246.herokuapp.com/products/shopping-list?count=true",
      {headers: {Authorization: `Bearer ${store.state.token}`}}
  ).then(response => shoppingListCount.value = response.data)
      .catch(error => console.error("Shopping list error:", error));
});
</script>

<template>
  <div class="screen-height">

    <section class="h-3/5 w-screen p-1 grid gap-1 grid-cols-4 grid-rows-3">
      <div v-for="product in products" class="relative p-1">
        <img
            :src="product.image"
            :alt="product.name"
            class="w-full h-full object-contain"
        />
        <div class="absolute bottom-0 right-0 p-2 bg-red-300">{{
            moment(product.expirationDates[0].date).format('d')
          }}
        </div>
      </div>
      <div class="rounded-xl bg-green-200"></div>
      <div class="rounded-xl bg-green-200"></div>

      <router-link
          to="/products"
          class="col-span-2 flex justify-center items-center relative rounded-xl border border-1 border-gray-200 text-white font-semibold bg-slate-400"
      >
        Tout voir
      </router-link>
    </section>

    <section class="h-1/5 border border-1 border-red-600">
      <ul>
        <li v-for="recipe in recipes" class="p-2">
          - {{ recipe.name }} : {{ recipe.duration }}
        </li>
      </ul>
    </section>

    <router-link to="/shopping-list" class="focus:outline-none tap-highlight-transparent">
      <section class="h-1/5 border border-1 border-green-600 p-2">
        <span class="font-semibold text-green-600">{{ shoppingListCount }}</span>
        produit{{ shoppingListCount > 1 ? "s" : "" }}
        dans la liste de course.
      </section>
    </router-link>

  </div>
</template>
