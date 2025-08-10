<script lang="ts" setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import type {Product} from "@/interfaces/product";
import {useTokenStore} from "@/stores/token.ts";
import {useProductOrderStore} from "@/stores/productOrder.ts";
import {PRODUCT_URL} from "@/constants/api.ts";
import {PRODUCT_ORDER} from "@/constants/productOrder.ts";
import DefaultList from "@/components/Product/DefaultList.vue";
import ListByCategory from "@/components/Product/ListByCategory.vue";
import Shelves from '@/assets/shelves.png'

const tokenStore = useTokenStore();
const productOrderStore = useProductOrderStore();

const products = ref<Product[]>([]);
const productOrder = ref(PRODUCT_ORDER[productOrderStore.productOrderKey]);
const defaultListMode = ref<boolean>(true);

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

      <button @click="defaultListMode = !defaultListMode" class="rounded-md text-white green-background p-2 px-4">
        <img :src="Shelves" alt="kitchen logo" class="brightness-0 invert h-8"/>
      </button>
    </div>

    <component
        :is="defaultListMode ? DefaultList : ListByCategory"
        :products="products"
    />
  </div>
</template>