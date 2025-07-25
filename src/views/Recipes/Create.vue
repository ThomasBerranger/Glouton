<script lang="ts" setup>
import {computed, onMounted, ref} from "vue";
import axios from "axios";
import type {Product} from "@/interfaces/product";
import {useTokenStore} from "@/stores/token";
import {getProductUrlByType, PRODUCT_URL, RECIPE_URL} from "@/constants/api.ts";
import router from "@/router";

const tokenStore = useTokenStore();
const products = ref<Product[]>([]);

const recipeName = ref<string>("");
const searchedProductName = ref<string>('')
const selectedProductIds = ref<string[]>([]);

const toggleSelectedProductIds = (id: string): void => {
  if (selectedProductIds.value.includes(id)) {
    selectedProductIds.value = selectedProductIds.value.filter(productId => productId !== id);
  } else {
    selectedProductIds.value.push(id)
  }
}

const filteredProducts = computed(() => {
  if (!searchedProductName.value) return products.value

  return products.value.filter(product =>
      product.name.toLowerCase().includes(searchedProductName.value.toLowerCase())
  )
})

const postRecipe = (): void => {
  axios.post(
      RECIPE_URL,
      {
        "name": recipeName.value,
        "products": selectedProductIds.value
      },
      {headers: {Authorization: `Bearer ${tokenStore.token}`}}
  )
      .then(response => {
        router.push('/recipes');
      });
}

onMounted(async () => {
  axios.get(PRODUCT_URL, {
    headers: {Authorization: `Bearer ${tokenStore.token}`},
  }).then(response => products.value = response.data)
      .catch(error => console.error("Recipes error:", error));
});
</script>

<template>
  <div class="screen-height w-screen p-5">
    <p>Ma nouvelle recette</p>
    <input v-model="recipeName" type="text" name="name" placeholder="Burritos"
           class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm my-3 px-2"/>

    <p class="mb-2">Mes ingrédients</p>
    <input type="text" name="name" placeholder="Tomates" v-model="searchedProductName"
           class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm my-3 px-2"/>

    <div class="grid grid-cols-6">
      <img
          v-for="product in filteredProducts"
          :src="product.image"
          :alt="product.name"
          :class="[selectedProductIds.includes(product.id) ? 'bg-green-200 rounded' : '', 'p-1 w-full h-24 object-contain']"
          @click="toggleSelectedProductIds(product.id)"
      />
    </div>

    <div class="w-full text-center mt-2">
      <button @click="postRecipe()" class="rounded p-2 border-solid border-2 border-yellow-500">Enregistrer</button>
    </div>
  </div>
</template>