<script lang="ts" setup>
import {computed, onMounted, onUnmounted, ref, watchEffect} from "vue";
import axios from "axios";
import type {Product} from "@/interfaces/product";
import {useTokenStore} from "@/stores/token";
import {PRODUCT_URL, RECIPE_URL} from "@/constants/api.ts";
import router from "@/router";
import {PRODUCT_ORDER} from "@/constants/productOrder.ts";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import { useDebounce } from '@vueuse/core';

const tokenStore = useTokenStore();
const products = ref<Product[]>([]);
const searchResults = ref<Product[]>([]);

const recipeName = ref<string>("");
const recipeDuration = ref<string>("00:05");
const selectedProductIds = ref<string[]>([]);
const offset = ref<number>(24);
const isLoading = ref<boolean>(false);
const hasMoreProducts = ref<boolean>(true);
const searchedTerm = ref('');
const debouncedTerm = useDebounce(searchedTerm, 400);

watchEffect(async () => {
  if (!debouncedTerm.value) {
    searchResults.value = [];
    return;
  }

  try {
    const response = await axios.get(`${PRODUCT_URL}?search=${debouncedTerm.value}&order=${PRODUCT_ORDER['all'].order}`, {
      headers: {Authorization: `Bearer ${tokenStore.token}`}
    });
    searchResults.value = response.data;
  } catch (error) {
    console.error("Search error:", error);
  }
});

const displayedProducts = computed(() => {
  return debouncedTerm.value ? searchResults.value : products.value;
});

const toggleSelectedProductIds = (id: string): void => {
  if (selectedProductIds.value.includes(id)) {
    selectedProductIds.value = selectedProductIds.value.filter(productId => productId !== id);
  } else {
    selectedProductIds.value.push(id)
  }
}

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

const handleScroll = (): void => {
  // Désactiver le scroll infini pendant la recherche
  if (isLoading.value || !hasMoreProducts.value || debouncedTerm.value) return;

  const scrollTop = window.scrollY;
  const windowHeight = window.innerHeight;
  const docHeight = document.documentElement.scrollHeight;

  if (scrollTop + windowHeight >= docHeight - 10) {
    loadMoreProducts();
  }
};

const loadMoreProducts = (): void => {
  if (isLoading.value || !hasMoreProducts.value || debouncedTerm.value) return;

  isLoading.value = true;

  axios.get(`${PRODUCT_URL}?offset=${offset.value}&limit=10&order=${PRODUCT_ORDER['all'].order}`, {
    headers: {Authorization: `Bearer ${tokenStore.token}`},
  }).then(response => {
    products.value.push(...response.data);
    offset.value += 10;

    if (response.data.length <= 0) {
      hasMoreProducts.value = false;
    }
  })
      .catch(error => console.error("Recipe error:", error))
      .finally(() => {
        isLoading.value = false;
      });
};

onMounted(async () => {
  axios.get(`${PRODUCT_URL}?limit=${offset.value}&order=${PRODUCT_ORDER['all'].order}`, {
    headers: {Authorization: `Bearer ${tokenStore.token}`},
  }).then(response => products.value = response.data)
      .catch(error => console.error("Recipe error:", error));

  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div class="min-screen-height w-screen bg-gray-100 p-3">

    <div class="flex items-center my-2 gap-2">
      <input v-model="recipeName" type="text" name="name" placeholder="Ma recette"
             class="flex-1 min-w-0 rounded-md border-0 text-gray-900 shadow-sm p-2"/>
      <input v-model="recipeDuration" type="time" name="duration" class="rounded-md p-2 text-gray-900"/>
    </div>

    <div class="flex items-center mb-2 gap-2">
      <input type="text" name="name" placeholder="Recherche" v-model="searchedTerm"
             class="flex-1 min-w-0 rounded-md border-0 text-gray-900 shadow-sm p-2"/>
      <button @click="postRecipe()" class="rounded green-background text-white px-5 py-2">Enregistrer</button>
    </div>

    <div class="grid grid-cols-4 gap-3 p-2">
      <img
          v-for="product in displayedProducts"
          :key="product.id"
          :src="product.image"
          :alt="product.name"
          :class="[selectedProductIds.includes(product.id) ? 'border-2 border-green-600 p-3 rounded' : '', 'bg-white p-1 w-full h-24 shadow-md object-contain']"
          @click="toggleSelectedProductIds(product.id)"
      />
    </div>

    <div class="w-full text-center mt-5 mb-36">
      <div v-if="isLoading" class="text-xl">
        <font-awesome-icon icon="fa-solid fa-circle-notch" class="animate-spin"/>
        Chargement...
      </div>
    </div>
  </div>
</template>