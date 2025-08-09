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
import {useShoppingListCounterStore} from "@/stores/shoppingListCount.ts";
import List from "@/components/Recipe/List.vue";
import {productCategories} from "@/constants/productCategories.ts";

const route = useRoute();
const tokenStore = useTokenStore();
const shoppingListCounterStore = useShoppingListCounterStore();

const productId = route.params.id as string;
const product = ref<Product>({} as Product);
const isToRemove = ref<boolean>(false);
const showNutritionalDetails = ref<boolean>(false);
const isToEdit = ref<boolean>(false);
const showDatePicker = ref<boolean>(false);

const toggleShoppingList = (): void => {
  product.value.addedToListAt = product.value.addedToListAt ? null : moment().format("L");

  axios.patch(
      `${getProductUrlByType(product.value)}/${product.value.id}`,
      {addedToListAt: product.value.addedToListAt},
      {headers: {Authorization: `Bearer ${tokenStore.token}`}}
  )
      .then(response => {
        if (product.value.addedToListAt) {
          shoppingListCounterStore.addOne();
        } else {
          shoppingListCounterStore.removeOne();
        }
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

watch(() => product.value.category, async (newCategory, oldCategory) => {
  if (oldCategory && oldCategory !== newCategory) {
    axios.patch(
        `${getProductUrlByType(product.value)}/${product.value.id}`,
        {category: product.value.category},
        {headers: {Authorization: `Bearer ${tokenStore.token}`}}
    )
  }
});

onMounted((): void => {
  axios.get(`${PRODUCT_URL}/${productId}`, {
    headers: {Authorization: `Bearer ${tokenStore.token}`},
  }).then(response => {
    product.value = response.data;
    product.value.category = product.value.category.id;
  });
});
</script>

<template>
  <div class="min-screen-height w-screen p-4 bg-gray-100 pb-24">
    <p v-if="!isToEdit" class="text-center text-3xl">{{ product.name }}</p>
    <input v-else v-model="product.name" class="w-full border text-center text-2xl"/>

    <div class="bg-white shadow mt-2 p-2">
      <img
          :src="product.image"
          :alt="product.name"
          class="w-full h-48 object-contain my-2.5"
      />

      <div class="w-full flex justify-center items-baseline">
        <Nutriscore class="mx-2.5" :nutriscore="product.nutriscore"/>
        <Novagroup class="mx-2.5" :novagroup="product.novagroup"/>
        <Ecoscore class="mx-2.5" :ecoscore="product.ecoscore"/>
      </div>
    </div>

    <p class="font-semibold mt-3">Notes</p>
    <div v-if="product.description || isToEdit" class="bg-white shadow-md p-2">
      <p v-if="!isToEdit">{{ product.description }}</p>
      <textarea rows="3" v-else v-model="product.description" class="w-full" placeholder="Aucune note"/>
    </div>
    <div v-else class="text-center italic">Aucune note associée</div>

    <template v-if="isToEdit">
      <p class="font-semibold mt-3">Lien de l'image</p>
      <div class="bg-white shadow-md p-2">
        <input v-model="product.image" class="w-full"/>
      </div>
    </template>

    <p class="w-full font-semibold mt-3">Date{{ product.expirationDates?.length > 1 ? 's' : '' }} d'expiration</p>
    <div class="bg-white shadow-md p-2">
      <div class="grid grid-cols-2 gap-2 gap-x-5 mt-1 px-5 mb-1">
        <button v-for="(expirationDate, index) in product.expirationDates" :key="index"
                @click="removeExpirationDate(index)"
                class="col-span-1 bg-red-400 text-white rounded py-0.5 text-sm tracking-wider">
          {{ moment(expirationDate.date).format('DD/MM/YYYY') }}
        </button>
        <button @click="showDatePicker = true" class="col-span-1 green-background text-white rounded py-0.5 text-sm">
          Ajouter
        </button>
      </div>
    </div>

    <p class="font-semibold pt-3">Catégorie</p>
    <select v-model="product.category" class="w-full bg-white shadow-md p-2">
      <option v-for="(label, id) in productCategories" :value="id" :key="id">{{ label }}</option>
    </select>

    <p class="font-semibold pt-3">Recettes associées</p>
    <List :recipes="product.recipes" v-if="product.recipes?.length > 0"/>
    <div v-else class="text-center italic">Aucune recette associée</div>

    <div class="flex gap-5 justify-between my-4 px-5">
      <button v-if="product.scanned" class="grow btn bg-indigo-400 text-white px-5 py-1.5 rounded">
        <font-awesome-icon @click="showNutritionalDetails = true" icon="fa-solid fa-flask-vial"/>
      </button>
      <button v-if="!isToEdit" @click="isToEdit = true"
              class="grow btn green-background text-white px-5 py-1.5 rounded">
        <font-awesome-icon icon="fa-solid fa-pencil"/>
      </button>
      <button v-else @click="edit" class="grow btn green-background text-white px-5 py-1.5 rounded">
        <font-awesome-icon icon="fa-solid fa-check"/>
      </button>
      <button @click="toggleShoppingList"
              :class="[product.addedToListAt ? 'green-color border border-emerald-600 bg-white' : 'green-background text-white', 'grow btn px-5 py-1.5 rounded']">
        <font-awesome-icon v-if="product.addedToListAt" icon="fa-solid fa-cart-shopping"/>
        <font-awesome-icon v-else icon="fa-solid fa-cart-arrow-down"/>
      </button>
      <button @click="isToRemove = true" class="grow btn bg-stone-500 text-white px-5 py-1.5 rounded">
        <font-awesome-icon icon="fa-solid fa-trash"/>
      </button>
    </div>

    <NutritionalDetails v-if="showNutritionalDetails"
                        @closeNutritionalDetails="showNutritionalDetails = !showNutritionalDetails"
                        :product="product"/>

    <Datepicker v-if="showDatePicker" :date="moment().format('L')" @update-date="addExpirationDate"/>

    <Confirmation v-if="product && isToRemove" @closeConfirmation="remove"
                  :product="product"
                  :body="`Veux-tu retirer <span class='font-semibold'>${product.name}</span> de la liste de tes produits enregistrés ?`"/>
  </div>
</template>