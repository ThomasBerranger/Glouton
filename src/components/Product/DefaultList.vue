<script lang="ts" setup>
import type {Product} from "@/interfaces/product";
import Card from "@/components/Product/Card.vue";

const props = defineProps<{
  products: Product[]
}>();
</script>

<template>
  <div class="grid grid-cols-4 gap-2 pb-32 text-center p-3">
    <Card v-for="product in products" :product="product" :key="product.id" />
  </div>
</template>