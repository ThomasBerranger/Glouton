<script lang="ts" setup>
import type {Product} from "@/interfaces/product";
import ExpirationLabel from "@/components/ExpirationLabel.vue";

const props = defineProps<{
  products: Product[]
}>();
</script>

<template>
  <div class="grid grid-cols-4 gap-3 p-3 mb-32 text-center">
    <template v-for="product in props.products">

      <router-link :to="{name: 'product.details', params: { id: product.id }}"
                   class="relative bg-white shadow-md p-2">
        <ExpirationLabel :expiration-date="product.expirationDates[0].date"/>
        <img
            :src="product.image"
            :alt="product.name"
            class=" h-24 w-full aspect-square object-contain"
        />
        <p class="text-xs mt-2 truncate">{{ product.name }}</p>
      </router-link>

    </template>
  </div>
</template>