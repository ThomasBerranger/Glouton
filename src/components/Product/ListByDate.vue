<script lang="ts" setup>
import {onMounted, ref} from "vue";
import moment from "moment/moment";
import {getNearestExpirationDate} from "@/functions/product";
import type {Product} from "@/interfaces/product";

const props = defineProps<{
  products: Product[]
}>();

const productBeforeNow = ref<Product | null>(null);
const productBeforeNextWeek = ref<Product | null>(null);
const productBeforeNextMonth = ref<Product | null>(null);
const productBeforeNextYear = ref<Product | null>(null);

onMounted(() => {
  productBeforeNow.value = findProductBefore(props.products, moment().endOf('day'));
  productBeforeNextWeek.value = findProductBefore(props.products, moment().add(1, 'week').endOf('day'));
  productBeforeNextMonth.value = findProductBefore(props.products, moment().add(1, 'month').endOf('day'));
  productBeforeNextYear.value = findProductBefore(props.products, moment().add(1, 'year').endOf('day'));
});

function findProductBefore(products: Product[], date: moment.Moment): Product | null {
  for (let i = 0; i < products.length; i++) {
    if (moment(getNearestExpirationDate(products[i]).date).isAfter(date)) {
      return products[i];
    }
  }

  return null;
}
</script>

<template>
  <div class="grid grid-cols-4 gap-1 p-3 mb-32 text-center">
    <template v-for="product in props.products">

      <div v-if="productBeforeNow === product" class="h-24 flex items-center bg-black/20">
        <p class="w-full">Trop tard</p>
      </div>

      <div v-if="productBeforeNextWeek === product" class="h-24 flex items-center bg-red-300">
        <p class="w-full">Dans la semaine</p>
      </div>

      <div v-if="productBeforeNextMonth === product" class="h-24 flex items-center bg-blue-200">
        <p class="w-full">Dans le mois</p>
      </div>

      <div v-if="productBeforeNextYear === product" class="h-24 flex items-center bg-green-200">
        <p class="w-full">Dans l'années</p>
      </div>

      <router-link :to="{name: 'product.details', params: { id: product.id }}"
                   class="border border-1 border-amber-800 h-24 relative p-2">
        <img
            :src="product.image"
            :alt="product.name"
            class="w-full h-full object-contain"
        />
      </router-link>

    </template>
  </div>
</template>