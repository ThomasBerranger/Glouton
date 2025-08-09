<script lang="ts" setup>

import {onMounted, ref} from "vue";
import {useTokenStore} from "@/stores/token.ts";
import {useShoppingListCounterStore} from "@/stores/shoppingListCount.ts";
import axios from "axios";
import moment from "moment/moment";
import type {Product} from "@/interfaces/product.ts";
import {getProductUrlByType, PRODUCT_SHOPPING_LIST_URL} from "@/constants/api.ts";
import Datepicker from "@/components/Datepicker.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const tokenStore = useTokenStore();
const shoppingListCounterStore = useShoppingListCounterStore();

const shoppingListProducts = ref<Product[]>([]);
const productToRemove = ref<Product | null>(null);
const removedProducts = ref<Product[]>([]);

const remove = (expirationDate: string | null): void => {
  if (productToRemove.value !== null && expirationDate) {
    productToRemove.value?.expirationDates.push({date: expirationDate});

    axios.patch(
        `${getProductUrlByType(productToRemove.value)}/${productToRemove.value.id}`,
        {
          addedToListAt: null,
          expirationDates: productToRemove.value.expirationDates
        },
        {headers: {Authorization: `Bearer ${tokenStore.token}`}}
    )
        .then(response => {
          if (productToRemove.value !== null) {
            removedProducts.value.push(productToRemove.value);
            productToRemove.value = null;
            shoppingListCounterStore.removeOne();
          }
        })
  }
};

onMounted((): void => {
  axios.get(
      `${PRODUCT_SHOPPING_LIST_URL}`,
      {headers: {Authorization: `Bearer ${tokenStore.token}`}}
  ).then(response => shoppingListProducts.value = response.data);
});
</script>

<template>
  <div class="min-screen-height w-screen p-3 bg-gray-100">
    <div class="flex items-center text-lg mt-1 mb-2">
      <font-awesome-icon icon="fa-solid fa-carrot"/>
      <p class="ml-1">Légumes</p>
    </div>

    <div v-for="product in shoppingListProducts"
         class="flex justify-between items-center bg-white shadow-md mb-3 p-2 rounded"
         @click="productToRemove = product">
      <div class="flex">
        <font-awesome-icon v-if="removedProducts.includes(product)" icon="fa-regular fa-circle-check"
                           class="green-color text-xl"/>
        <font-awesome-icon v-else icon="fa-regular fa-circle" class="text-xl"/>
        <p :class="['ml-2', { 'line-through green-color': removedProducts.includes(product) }]">{{ product.name }}</p>
      </div>
      <p class="text-sm">2 jours</p>
    </div>

    <Datepicker v-if="productToRemove" :date="moment().format('L')" @update-date="remove"/>
  </div>
</template>