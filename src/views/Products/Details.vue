<script lang="ts" setup>

import {useRoute} from "vue-router";
import {onMounted, ref, watch} from "vue";
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
import NutritionalDetails from "@/components/Product/NutritionalDetails.vue";
import Datepicker from "@/components/Datepicker.vue";
import type {ExpirationDate} from "@/interfaces/expiration-date.ts";

const route = useRoute();
const tokenStore = useTokenStore();

const productId = route.params.id as string;
const product = ref<Product>({} as Product);
const isToRemove = ref<boolean>(false);
const showNutritionalDetails = ref<boolean>(false);
const isToEdit = ref<boolean>(false);
const showDatePicker = ref<boolean>(false);

const addToShoppingList = (): void => {
  axios.patch(
      `${getProductUrlByType(product.value)}/${product.value.id}`,
      {addedToListAt: new Date()},
      {headers: {Authorization: `Bearer ${tokenStore.token}`}}
  )
      .then(response => {
        product.value = response.data;
      })
};

const remove = (isRemoved: boolean): void => {
  if (isRemoved) {
    axios.delete(`${PRODUCT_URL}/${productId}`, {
      headers: {Authorization: `Bearer ${tokenStore.token}`},
    }).then((): void => {
      router.push('/');
    });
  } else {
    isToRemove.value = false;
  }
};

const edit = (): void => {
  axios.patch(
      `${getProductUrlByType(product.value)}/${product.value.id}`,
      {name: product.value.name, description: product.value.description},
      {headers: {Authorization: `Bearer ${tokenStore.token}`}}
  )
      .then(response => {
        product.value = response.data;
        isToEdit.value = false;
      })
};

const addExpirationDate = (expirationDate: string | null): void => {
  if (expirationDate) {
    const newExpirationDate: ExpirationDate = {
      date: expirationDate
    };

    product.value.expirationDates.push(newExpirationDate);

    patchExpirationDates();
  }

  showDatePicker.value = false;
};

const removeExpirationDate = (index: number | null = null): void => {
  if (index !== null) {
    product.value.expirationDates.splice(index, 1);
  } else {
    product.value.expirationDates = [];
  }

  patchExpirationDates();
}

const patchExpirationDates = (): void => {
  axios.patch(
      `${getProductUrlByType(product.value)}/${product.value.id}`,
      {expirationDates: product.value.expirationDates},
      {headers: {Authorization: `Bearer ${tokenStore.token}`}}
  )
};

onMounted((): void => {
  axios.get(`${PRODUCT_URL}/${productId}`, {
    headers: {Authorization: `Bearer ${tokenStore.token}`},
  }).then(response => product.value = response.data);
});
</script>

<template>
  <div class="w-screen p-2">
    <img
        :src="product.image"
        :alt="product.name"
        class="w-full h-48 object-contain"
    />

    <p v-if="!isToEdit" class="text-center mt-2">{{ product.name }}</p>
    <input v-else v-model="product.name" class="w-full mt-2 border text-center"/>
    <p v-if="!isToEdit" class="text-center">{{ product.description ?? 'Aucune description' }}</p>
    <input v-else v-model="product.description" class="w-full border text-center" placeholder="Aucune description"/>

    <p class="font-semibold pt-3 pb-1">Expiration dates</p>
    <p v-for="(expirationDate, index) in product.expirationDates" :key="index">
      {{ moment(expirationDate.date).format('DD/MM/YYYY') }}
      <button @click="removeExpirationDate(index)" class="btn border border-red-600 px-2 mb-1">remove</button>
    </p>
    <button @click="showDatePicker = true" class="btn border border-green-600 px-2 py-1 mb-1">Ajouter une date</button>
    <br>
    <button @click="removeExpirationDate()" class="btn border border-red-600 px-2 py-1">J'ai tout bouffé</button>

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
      <font-awesome-icon v-if="product.scanned" @click="showNutritionalDetails = true" icon="fa-solid fa-flask-vial"/>
      <font-awesome-icon @click="isToRemove = true" icon="fa-solid fa-trash"/>
      <font-awesome-icon @click="addToShoppingList" icon="fa-solid fa-cart-shopping"
                         :class="{ 'text-green-700' : product.addedToListAt }"/>
      <font-awesome-icon v-if="!isToEdit" @click="isToEdit = true" icon="fa-solid fa-pen-to-square"/>
      <font-awesome-icon v-else @click="edit" icon="fa-solid fa-pen-to-square"
                         :class="{ 'text-green-700' : isToEdit }"/>
    </div>

    <NutritionalDetails v-if="showNutritionalDetails"
                        @closeNutritionalDetails="showNutritionalDetails = !showNutritionalDetails" :product="product"/>

    <Datepicker v-if="showDatePicker" :date="moment().format('L')" @update-date="addExpirationDate"/>

    <Confirmation v-if="product && isToRemove" @closeConfirmation="remove"
                  :product="product"
                  :body="`Veux-tu retirer <span class='font-semibold'>${product.name}</span> de la liste de tes produits enregistrés ?`"/>
  </div>
</template>