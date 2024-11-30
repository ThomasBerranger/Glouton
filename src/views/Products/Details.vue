<script lang="ts" setup>
import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import axios from "axios";
import {useTokenStore} from "@/stores/token.ts";
import type {Product} from "@/interfaces/product.ts";
import moment from "moment";

const route = useRoute();
const tokenStore = useTokenStore();
const productId = route.params.id as string;
const product = ref<Product | null>(null);

onMounted(() => {
  axios.get("https://glouton-fd999217b246.herokuapp.com/products/" + productId, {
    headers: {Authorization: `Bearer ${tokenStore.token}`},
  }).then(response => product.value = response.data)
      .catch(error => console.error("Product error:", error));
});
</script>

<template>
  <div class="w-screen p-2">
    <p>{{ product?.id }}</p>
    <p>{{ product?.name }}</p>
    <p>{{ product?.description }}</p>

    <img
        :src="product?.image"
        :alt="product?.name"
        class="w-full h-20 object-contain"
    />

    <p>{{ product?.finishedAt }}</p>
    <p>{{ product?.addedToListAt }}</p>

    <p class="font-semibold pt-3 pb-1">Expiration dates</p>
    <template v-for="expirationDate in product?.expirationDates">
      <span>{{ moment(expirationDate.date).format('DD/MM/YYYY') }}</span>
    </template>
  </div>
</template>