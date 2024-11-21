<script lang="ts" setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import type {Product} from "@/interfaces/product";

import store from "@/assets/store"; // todo: remplacer par pinia

import ListByDate from "@/components/Product/ListByDate.vue";
import ListByCategory from "@/components/Product/ListByCategory.vue";

const products = ref<Product[]>([]);

onMounted(async () => {
  axios.get("https://glouton-fd999217b246.herokuapp.com/products", {
    headers: {Authorization: `Bearer ${store.state.token}`},
  }).then(response => products.value = response.data)
      .catch(error => console.error("Products error:", error));
});
</script>

<template>
  <div v-if="products.length > 0" class="min-screen-height">
    <ListByDate :products="products"/>
<!--    <ListByCategory :products="products"/>-->
  </div>
</template>