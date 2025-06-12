<script lang="ts" setup>
import type {Product} from "@/interfaces/product";

const props = defineProps<{
  products: Product[]
}>();
</script>

<template>
  <div class="w-screen">
    <h1 class="text-center text-xl mt-5">Catégories</h1>
    <h2 class="text-center">{{ props.products.length }} produit{{ props.products.length > 1 ? 's' : '' }} à
      afficher.</h2>
  </div>
</template>