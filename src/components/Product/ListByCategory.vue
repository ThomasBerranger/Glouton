<script lang="ts" setup>
import type {Product} from "@/interfaces/product";

const props = defineProps<{
  products: Product[]
}>()
</script>

<template>
  <div class="screen-height w-screen">
    <div class="w-full flex justify-start text-xl pt-2 pl-2">
      <button class="border border-amber-800 rounded-md p-1">
        Catégories
        <font-awesome-icon icon="fa-solid fa-poo" class="text-2xl pl-1"/>
      </button>
    </div>

    <h1 class="text-xl mt-5">Catégories</h1>
    <h2 class="">{{ props.products.length }} produit{{ props.products.length > 1 ? 's' : '' }} à afficher.</h2>
  </div>
</template>