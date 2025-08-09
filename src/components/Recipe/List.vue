<script lang="ts" setup>
import type {Recipe} from "@/interfaces/recipe.ts";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const props = defineProps<{
  recipes: Recipe[]
}>();
</script>

<template>
  <div v-for="recipe in recipes" class="flex justify-between bg-white shadow-md mb-2 p-2">
    <div class="pr-2">{{ recipe.name }}</div>
    <div class="flex items-center gap-2">
      <div
          class="flex items-center font-semibold text-sm border border-1 border-emerald-600 green-color rounded px-1.5 h-6 tracking-widest">
        1
        <font-awesome-icon icon="fa-solid fa-basket-shopping"/>
      </div>
      <div class="flex items-center rounded text-sm px-1.5 h-6 tracking-wider">
        {{ recipe.duration?.slice(0, -3) }}
      </div>
    </div>
  </div>
</template>