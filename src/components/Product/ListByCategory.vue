<script lang="ts" setup>
import type {Product} from "@/interfaces/product";
import {computed, onMounted, ref} from "vue";
import {productCategories} from "@/constants/productCategories.ts";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import ExpirationLabel from "@/components/Product/ExpirationLabel.vue";
import Card from "@/components/Product/Card.vue";

const props = defineProps<{
  products: Product[]
}>();

const productsByCategory = computed((): Record<string, any> => {
  const result = {...productCategories};

  Object.entries(productCategories).forEach(([categoryId, categoryData]) => {
    result[categoryId] = {...categoryData, products: []};
  });

  props.products.forEach((product: Product) => {
    result[product.category.id]['products'].push(product);
  });

  return result;
});
</script>

<template>
  <div class="w-screen p-3 pb-32">
    <div v-for="category in productsByCategory">
      <div class="flex w-full mt-3 mb-2">
        <font-awesome-icon :icon="category.icon"/>
        <p class="ml-1">{{ category.name }}</p>
      </div>

      <div class="grid grid-cols-4 gap-3 text-center">
        <Card v-for="product in category.products" :product="product" :key="product.id" />
      </div>
    </div>
  </div>
</template>