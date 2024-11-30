<script lang="ts" setup>
import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import axios from "axios";
import {useTokenStore} from "@/stores/token.ts";
import type {Product} from "@/interfaces/product.ts";
import moment from "moment";
import Nutriscore from "@/components/Product/Scores/Nutriscore.vue";
import Novagroup from "@/components/Product/Scores/Novagroup.vue";
import Ecoscore from "@/components/Product/Scores/Ecoscore.vue";

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
    <p v-for="expirationDate in product?.expirationDates">{{
        moment(expirationDate.date).format('DD/MM/YYYY')
      }}
    </p>

    <p class="font-semibold pt-3 pb-1">Recettes associées</p>
    <p>?</p>

    <div class="w-full flex justify-evenly">
      <Nutriscore :nutriscore="product?.nutriscore"/>
      <Novagroup :novagroup="product?.novagroup"/>
      <Ecoscore :ecoscore="product?.ecoscore"/>
    </div>

    <div class="w-full flex justify-evenly text-3xl mt-5">
      <font-awesome-icon icon="fa-solid fa-flask-vial"/>
      <font-awesome-icon icon="fa-solid fa-trash"/>
      <font-awesome-icon icon="fa-solid fa-cart-shopping"/>
      <font-awesome-icon icon="fa-solid fa-pen-to-square"/>
    </div>
  </div>
</template>