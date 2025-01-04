<script lang="ts" setup>

import {onMounted, ref} from "vue";
import {useTokenStore} from "@/stores/token.ts";
import axios from "axios";
import moment from "moment/moment";
import type {Product} from "@/interfaces/product.ts";
import {getProductUrlByType, PRODUCT_SHOPPING_LIST_URL} from "@/constants/api.ts"
import Datepicker from "@/components/Datepicker.vue";

const tokenStore = useTokenStore();

const shoppingListProducts = ref<Product[]>([]);
const productToRemove = ref<Product | null>(null);

const remove = (expirationDate: string | null): void => {
  if (productToRemove.value && expirationDate) {
    axios.patch(
        `${getProductUrlByType(productToRemove.value)}${productToRemove.value.id}`,
        {
          addedToListAt: null,
          expirationDates: [{
            date: expirationDate
          }]
        },
        {headers: {Authorization: `Bearer ${tokenStore.token}`}}
    )
        .then(response => {
          shoppingListProducts.value = shoppingListProducts.value.filter(product => product.id !== response.data.id);
        })
  }

  productToRemove.value = null;
};

onMounted((): void => {
  axios.get(
      `${PRODUCT_SHOPPING_LIST_URL}`,
      {headers: {Authorization: `Bearer ${tokenStore.token}`}}
  ).then(response => shoppingListProducts.value = response.data);
});
</script>

<template>
  <div class="w-screen p-3">
    <ul>
      <li v-for="product in shoppingListProducts">
        {{ product.name }}
        <button class="btn px-2 border border-red-400 rounded" @click="productToRemove = product">supprimer</button>
      </li>
    </ul>

    <Datepicker v-if="productToRemove" :date="moment().format('L')" @update-date="remove"/>
  </div>
</template>