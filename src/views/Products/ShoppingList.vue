<script lang="ts" setup>

import {onMounted, ref} from "vue";
import {useTokenStore} from "@/stores/token.ts";
import axios from "axios";
import type {Product} from "@/interfaces/product.ts";
import Confirmation from "@/components/Confirmation.vue";

const tokenStore = useTokenStore();

const shoppingListProducts = ref<Product[]>([]);
const productToDelete = ref<Product | null>(null);

const closeConfirmation = (isRemoved: boolean) => {
  if (isRemoved) {
    shoppingListProducts.value = shoppingListProducts.value.filter(product => product.id !== productToDelete.value?.id);
  }
  productToDelete.value = null;
};

onMounted(async () => {
  axios.get(
      "https://glouton-fd999217b246.herokuapp.com/products/shopping-list",
      {headers: {Authorization: `Bearer ${tokenStore.token}`}}
  ).then(response => shoppingListProducts.value = response.data)
      .catch(error => console.error("Shopping list error:", error));
});
</script>

<template>
  <div class="w-screen p-3">
    <ul>
      <li v-for="product in shoppingListProducts">
        {{ product.name }}
        <button class="btn px-2 border border-red-400 rounded" @click="productToDelete = product">supprimer</button>
      </li>
    </ul>

    <Confirmation v-if="productToDelete" :productToDelete="productToDelete" @closeConfirmation="closeConfirmation"/>
  </div>
</template>