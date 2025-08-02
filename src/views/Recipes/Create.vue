<script lang="ts" setup>
import {computed, onMounted, ref} from "vue";
import axios from "axios";
import type {Product} from "@/interfaces/product";
import {useTokenStore} from "@/stores/token";
import {PRODUCT_URL, RECIPE_URL} from "@/constants/api.ts";
import router from "@/router";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {RouterLink} from "vue-router";
import ExpirationLabel from "@/components/ExpirationLabel.vue";

const tokenStore = useTokenStore();
const products = ref<Product[]>([]);

const recipeName = ref<string>("");
const recipeDuration = ref<string>("00:00");
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
        "duration": recipeDuration.value,
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
  <div class="screen-height w-screen bg-gray-100 p-5">
    <div class="flex items-center my-2">
      <p class="flex-shrink-0">Ma nouvelle recette :</p>
      <input v-model="recipeName" type="text" name="name" placeholder="Burritos"
             class="flex-1 min-w-0 rounded-md border-0 text-gray-900 shadow-sm ml-2 p-2"/>
    </div>

    <div class="flex items-center mb-2">
      <p class="flex-shrink-0">Recherche d'ingrédients : </p>
      <input type="text" name="name" placeholder="Tomates" v-model="searchedProductName"
             class="flex-1 min-w-0 rounded-md border-0 text-gray-900 shadow-sm ml-2 p-2"/>
    </div>

    <div class="grid grid-cols-4 gap-3 p-2">
      <img
          v-for="product in filteredProducts"
          :src="product.image"
          :alt="product.name"
          :class="[selectedProductIds.includes(product.id) ? 'border-2 border-green-600 p-3 rounded' : '', 'p-1 w-full h-24 shadow-md object-contain']"
          @click="toggleSelectedProductIds(product.id)"
      />
    </div>

    <div class="mt-3 flex justify-center items-center">
      <p class="flex-nowrap">Le temps de préparation : </p>
      <input v-model="recipeDuration" type="time" name="duration" class="rounded-md p-2.5 text-gray-900 ml-2"/>
    </div>

    <div class="w-full text-center mt-2">
      <button @click="postRecipe()" class="rounded p-2 border-solid border-2 border-emerald-600">Enregistrer</button>
    </div>
  </div>
</template>