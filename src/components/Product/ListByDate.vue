<script lang="ts" setup>
import {onMounted, ref} from "vue";
import moment from "moment/moment";
import {getNearestExpirationDate} from "@/functions/product";
import type {Product} from "@/interfaces/product";

const props = defineProps<{
  products: Product[]
}>()

const productBeforeNow = ref<Product | null>(null);
const productBeforeNextWeek = ref<Product | null>(null);
const productBeforeNextMonth = ref<Product | null>(null);
const productBeforeNextYear = ref<Product | null>(null);

onMounted(() => {
  productBeforeNow.value = findProductBefore(props.products, moment().endOf('day'));
  productBeforeNextWeek.value = findProductBefore(props.products, moment().add(1, 'week').endOf('day'));
  productBeforeNextMonth.value = findProductBefore(props.products, moment().add(1, 'month').endOf('day'));
  productBeforeNextYear.value = findProductBefore(props.products, moment().add(1, 'year').endOf('day'));
})

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

  <div class="fixed bottom-20 right-3">
    <button class="border border-amber-800 rounded-md p-1">
      Catégories
      <font-awesome-icon icon="fa-solid fa-poo" class="text-2xl pl-1"/>
    </button>
  </div>

  <div class="grid grid-cols-4 gap-1 p-3 mb-5">
    <template v-for="product in props.products">

      <div v-if="productBeforeNow === product">
        <p class="text-center bg-red-300">Trop tard</p>
      </div>

      <div v-if="productBeforeNextWeek === product">
        <p class="text-center bg-red-300">Dans la semaine</p>
      </div>

      <div v-if="productBeforeNextMonth === product">
        <p class="text-center bg-red-300">Dans le mois</p>
      </div>

      <div v-if="productBeforeNextYear === product">
        <p class="text-center bg-red-300">Dans l'années</p>
      </div>

      <div class="border border-1 border-amber-800 text-sm text-center">
        <p class="font-semibold">{{ product.name }}</p>
        <br>
        {{ moment(getNearestExpirationDate(product).date).format('DD/MM/YYYY') }}
      </div>
    </template>
  </div>

</template>