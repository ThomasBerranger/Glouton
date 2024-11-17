<script lang="ts" setup>
import {computed, onMounted, ref} from "vue";
import axios from "axios";
import type {Product} from "@/interfaces/product";

import store from "@/assets/store"; // todo: remplacer par pinia
import ListByDate from "@/components/Product/ListByDate.vue";
import ListByCategory from "@/components/Product/ListByCategory.vue";


import {Carousel, Slide, Pagination, Navigation} from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css';

const currentSlide = ref<number>(0);


const products = ref<Record<number, Product>>({});
const productsArray = computed(() => Object.values(products.value))

// todo: manifestement il y a un souci avec le carousel -> peut être gérer l'envoie des ids depuis l'API et la reception en Product[] avant de revenir sur le sujet
// todo: l'option 2 component et une transition slide horizontale est envisageable

onMounted(async () => {
  axios.get("https://glouton-fd999217b246.herokuapp.com/products", {
    headers: {Authorization: `Bearer ${store.state.token}`},
  }).then(response => products.value = response.data)
      .catch(error => console.error("Products error:", error));
});
</script>

<template>
  <carousel :items-to-show="1" :wrap-around="true" v-if="productsArray.length > 0" v-model="currentSlide">
    <slide key="0">
      <ListByDate :products="productsArray"/>
    </slide>
    <slide key=" 1">
      <ListByCategory :products="productsArray"/>
    </slide>
  </carousel>
</template>