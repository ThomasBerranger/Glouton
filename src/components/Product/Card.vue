<script lang="ts" setup>

import type {Product} from "@/interfaces/product.ts";
import ExpirationLabel from "@/components/Product/ExpirationLabel.vue";
import {RouterLink} from "vue-router";

const props = withDefaults(defineProps<{
  product: Product,
  displayTitle?: boolean,
}>(), {
  displayTitle: true
});
</script>

<template>
  <router-link :to="{name: 'product.details', params: { id: props.product.id }}" class="relative bg-white shadow-md">
    <ExpirationLabel :expiration-date="props.product.closestExpirationDate"/>
    <img
        :src="props.product.image"
        :alt="props.product.name"
        class="h-24 w-full aspect-square object-contain p-1"
    />
    <p v-if="displayTitle" class="text-xs my-2 px-1 text-center truncate">{{ product.name }}</p>
  </router-link>
</template>