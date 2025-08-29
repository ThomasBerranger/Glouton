<script lang="ts" setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import type {Recipe} from "@/interfaces/recipe";
import {useTokenStore} from "@/stores/token";
import {PRODUCT_URL, RECIPE_URL} from "@/constants/api.ts";
import {RouterLink} from "vue-router";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import kitchenImg from "@/assets/kitchen.png";
import Confirmation from "@/components/Confirmation.vue";
import router from "@/router";

const tokenStore = useTokenStore();
const recipes = ref<Recipe[]>([]);

const recipeToRemove = ref<Recipe | null>(null);

const remove = (isRemoved: boolean): void => {
  if (isRemoved && recipeToRemove.value) {
    axios.delete(`${RECIPE_URL}/${recipeToRemove.value.id}`, {
      headers: {Authorization: `Bearer ${tokenStore.token}`},
    }).then((): void => {
      recipes.value = recipes.value.filter(recipe => recipe.id !== recipeToRemove.value?.id);
      recipeToRemove.value = null;
    });
  } else {
    recipeToRemove.value = null;
  }
};

onMounted(async () => {
  axios.get(RECIPE_URL, {
    headers: {Authorization: `Bearer ${tokenStore.token}`},
  }).then(response => {
    recipes.value = response.data.sort((a: Recipe, b: Recipe) =>
        a.unavailableProducts - b.unavailableProducts
    )
  })
      .catch(error => console.error("Recipe error:", error));
});
</script>

<template>
  <div class="min-screen-height w-screen p-4">

    <div v-for="recipe in recipes" class="mb-5">
      <div class="flex justify-between bg-white shadow-md mb-2 p-2">
        <div class="pr-2">{{ recipe.name }}</div>
        <div class="flex items-center gap-2">

          <div v-if="recipe.products?.length >= 0"
               :class="[ recipe.unavailableProducts <= 0 ? 'border-emerald-600 green-color' : 'border-red-400 text-red-400'
              ,'flex items-center font-semibold text-sm border border-1 rounded px-1.5 h-6']">
            {{ recipe.products.length - recipe.unavailableProducts }} / {{ recipe.products.length }}
            <font-awesome-icon icon="fa-solid fa-basket-shopping" class="ml-1"/>
          </div>

          <div class="flex items-center rounded text-sm px-1.5 h-6 tracking-wider">
            {{ recipe.duration?.slice(0, -3) }}
          </div>

          <button @click="recipeToRemove = recipe" class="text-red-400 opacity-80 px-1 py-0.5">
            <font-awesome-icon icon="fa-solid fa-trash"/>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-2 mx-1 mb-1">
        <router-link :to="{name: 'product.details', params: { id: product.id }}" v-for="product in recipe.products">
          <font-awesome-icon :icon="`fa-solid ${product.closestExpirationDate ? 'fa-check' : 'fa-xmark'}`"/>
          {{ product.name }}
        </router-link>
      </div>
    </div>

    <div class="mt-10 w-full text-center">
      <router-link to="/create-recipe" class="green-background text-white rounded px-3 py-1.5 mb-38">
        Nouvelle recette
      </router-link>
    </div>

    <Confirmation v-if="recipeToRemove" @closeConfirmation="remove"
                  :body="`Veux-tu retirer <span class='font-semibold'>${recipeToRemove.name}</span> de la liste de tes recettes enregistrées ?`"/>
  </div>

</template>