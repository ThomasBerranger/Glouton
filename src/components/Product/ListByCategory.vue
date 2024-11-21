<script lang="ts" setup>
import type {Product} from "@/interfaces/product";

const props = defineProps<{
  products: Product[]
}>()
</script>

<template>
  <div class="fixed bottom-20 right-3">
    <button class="border border-amber-800 rounded-md p-1">
      Dates
      <font-awesome-icon icon="fa-solid fa-poo" class="text-2xl pl-1"/>
    </button>
  </div>

  <div class="w-screen">
    <h1 class="text-center text-xl mt-5">Catégories</h1>
    <h2 class="text-center">{{ props.products.length }} produit{{ props.products.length > 1 ? 's' : '' }} à afficher.</h2>
  </div>
</template>