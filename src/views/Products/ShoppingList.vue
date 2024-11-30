<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {useTokenStore} from "@/stores/token.ts";
import axios from "axios";
import type {Product} from "@/interfaces/product.ts";

const tokenStore = useTokenStore();

const shoppingListProducts = ref<Product[]>([]);

onMounted(async () => {
  axios.get(
      "https://glouton-fd999217b246.herokuapp.com/products/shopping-list",
      {headers: {Authorization: `Bearer ${tokenStore.token}`}}
  ).then(response => shoppingListProducts.value = response.data)
      .catch(error => console.error("Shopping list error:", error));
});
</script>

<template>
  <div class="grid grid-cols-1 gap-2 p-2">
    <ul>
      <li v-for="product in shoppingListProducts">
        {{ product.name }}
      </li>
    </ul>
  </div>
</template>