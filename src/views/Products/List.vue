<script lang="ts" setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import type {Product} from "@/interfaces/product";
import {useTokenStore} from "@/stores/token.ts";
import {useProductOrderStore} from "@/stores/productOrder.ts";
import {PRODUCT_URL} from "@/constants/api.ts";
import ExpirationLabel from "@/components/ExpirationLabel.vue";
import {PRODUCT_ORDER} from "@/constants/productOrder.ts";

const tokenStore = useTokenStore();
const productOrderStore = useProductOrderStore();

const products = ref<Product[]>([]);
const productOrder = ref(PRODUCT_ORDER[productOrderStore.productOrderKey]);

const changeOrder = (): void => {
  productOrderStore.setProductOrder(productOrder.value.nextKey);

  productOrder.value = PRODUCT_ORDER[productOrderStore.productOrderKey];

  fetchProducts();
};

const fetchProducts = async () => {
  axios.get(`${PRODUCT_URL}?limit=1000&order=${productOrder.value.order}`, {
    headers: {Authorization: `Bearer ${tokenStore.token}`},
  }).then(response => products.value = response.data)
      .catch(error => console.error("Products error:", error));
};

onMounted(async () => {
  await fetchProducts();
});
</script>

<template>
  <div class="min-screen-height bg-gray-100">
    <div class="w-full flex justify-around pt-3">

      <button @click="changeOrder"
              class="rounded-md p-0.5 text-white green-background pt-1.5 pl-4 pr-5">
        <font-awesome-icon :icon="productOrder.icon" class="text-2xl pl-1"/>
      </button>

      <button class="rounded-md text-white green-background p-1">
        <font-awesome-icon icon="fa-solid fa-carrot" class="text-2xl pl-5 pr-4"/>
      </button>
    </div>

    <div class="grid grid-cols-4 gap-3 pb-32 text-center p-3">
      <template v-for="product in products">

        <router-link :to="{name: 'product.details', params: { id: product.id }}"
                     class="relative bg-white shadow-md">
          <ExpirationLabel :expiration-date="product.closestExpirationDate" :key="product.id"/>
          <img
              :src="product.image"
              :alt="product.name"
              class="h-24 w-full aspect-square object-contain p-1"
          />
          <p class="text-xs my-2 px-1 truncate">{{ product.name }}</p>
        </router-link>

      </template>
    </div>
  </div>
</template>