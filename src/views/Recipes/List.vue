<script lang="ts" setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import type {Recipe} from "@/interfaces/recipe";
import {useTokenStore} from "@/stores/token";
import {RECIPE_URL} from "@/constants/api.ts";
import {RouterLink} from "vue-router";

const tokenStore = useTokenStore();
const recipes = ref<Recipe[]>([]);

const removeRecipe = (recipeId: string): void => {
  axios.delete(`${RECIPE_URL}/${recipeId}`, {
    headers: {Authorization: `Bearer ${tokenStore.token}`},
  }).then((): void => {
    recipes.value = recipes.value.filter(recipe => recipe.id !== recipeId);
  });
}

onMounted(async () => {
  axios.get(RECIPE_URL, {
    headers: {Authorization: `Bearer ${tokenStore.token}`},
  }).then(response => recipes.value = response.data)
      .catch(error => console.error("Recipes error:", error));
});
</script>

<template>
  <div class="screen-height">
    <ul class="w-screen mt-3 mb-5 p-4">
      <li class="text-lg font-bold">Recettes disponibles</li>
      <li v-for="recipe in recipes" class="flex mt-2">
        <button @click="removeRecipe(recipe.id)" class="rounded font-bold text-red-600 opacity-80 px-1 py-0.5">
          <font-awesome-icon icon="fa-solid fa-trash"/>
        </button>
        <p class="pl-1.5">{{ recipe.name }}
        </p>
      </li>
    </ul>

    <div class="flex justify-center">
      <router-link
          to="/"
          class="p-2 rounded text-white font-semibold bg-green-600 opacity-60"
      >Ajouter une nouvelle recette
      </router-link>
    </div>
  </div>
</template>