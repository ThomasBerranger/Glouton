<script lang="ts" setup>
import type {Recipe} from "@/interfaces/recipe.ts";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {RouterLink} from "vue-router";

const props = defineProps<{
  recipes: Recipe[]
}>();
</script>

<template>
  <router-link
      to="/recipes"
      v-for="recipe in recipes" class="flex justify-between bg-white shadow-md mb-2 p-2">
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
    </div>
  </router-link>
</template>