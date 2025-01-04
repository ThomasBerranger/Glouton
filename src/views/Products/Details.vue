<script lang="ts" setup>

import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import {useTokenStore} from "@/stores/token.ts";
import axios from "axios";
import router from '@/router';
import moment from "moment";
import type {Product} from "@/interfaces/product.ts";
import {PRODUCT_URL, getProductUrlByType} from "@/constants/api.ts"
import Nutriscore from "@/components/Product/Scores/Nutriscore.vue";
import Novagroup from "@/components/Product/Scores/Novagroup.vue";
import Ecoscore from "@/components/Product/Scores/Ecoscore.vue";
import Confirmation from "@/components/Confirmation.vue";

const route = useRoute();
const tokenStore = useTokenStore();

const productId = route.params.id as string;
const product = ref<Product>({} as Product);
const isToRemove = ref<boolean>(false);

onMounted((): void => {
  axios.get(`${PRODUCT_URL}${productId}`, {
    headers: {Authorization: `Bearer ${tokenStore.token}`},
  }).then(response => product.value = response.data);
});

const addToShoppingList = (): void => {
  axios.patch(
      `${getProductUrlByType(product.value)}${product.value.id}`,
      {addedToListAt: new Date()},
      {headers: {Authorization: `Bearer ${tokenStore.token}`}}
  )
      .then(response => {
        product.value = response.data;
      })
};

const remove = (isRemoved: boolean): void => {
  if (isRemoved) {
    axios.delete(`${PRODUCT_URL}${productId}`, {
      headers: {Authorization: `Bearer ${tokenStore.token}`},
    }).then((): void => {
      router.push('/');
    });
  } else {
    isToRemove.value = false;
  }
};
</script>

<template>
  <div class="w-screen p-2">
    <p>{{ product.id }}</p>
    <p>Scanned : {{ product.scanned }}</p>
    <p>{{ product.name }}</p>
    <p>{{ product.description }}</p>

    <img
        :src="product.image"
        :alt="product.name"
        class="w-full h-20 object-contain"
    />

    <p>Finished at : {{ product.finishedAt ?? '/' }}</p>
    <p>Added to the shopping list : {{ product.addedToListAt ?? '/' }}</p>

    <p class="font-semibold pt-3 pb-1">Expiration dates</p>
    <p v-for="expirationDate in product.expirationDates">{{
        moment(expirationDate.date).format('DD/MM/YYYY')
      }}
    </p>

    <p class="font-semibold pt-3 pb-1">Recettes associées</p>
    <p>?</p>

    <p class="font-semibold pt-3 pb-1">Catégories</p>
    <p>?</p>

    <div class="w-full flex justify-evenly">
      <Nutriscore :nutriscore="product.nutriscore"/>
      <Novagroup :novagroup="product.novagroup"/>
      <Ecoscore :ecoscore="product.ecoscore"/>
    </div>

    <div class="w-full flex justify-evenly text-3xl mt-5">
      <font-awesome-icon icon="fa-solid fa-flask-vial"/>
      <font-awesome-icon @click="isToRemove = true" icon="fa-solid fa-trash"/>
      <font-awesome-icon @click="addToShoppingList" icon="fa-solid fa-cart-shopping"
                         :class="{ 'text-green-700' : product.addedToListAt }"/>
      <font-awesome-icon icon="fa-solid fa-pen-to-square"/>
    </div>

    <Confirmation v-if="product && isToRemove" @closeConfirmation="remove"
                  :product="product"
                  :body="`Veux-tu retirer <span class='font-semibold'>${product.name}</span> de la liste de tes produits enregistrés ?`"/>
  </div>
</template>