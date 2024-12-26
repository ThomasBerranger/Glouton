<script lang="ts" setup>

import type {Product} from "@/interfaces/product.ts";
import axios from "axios";
import {useTokenStore} from "@/stores/token.ts";

const tokenStore = useTokenStore();

const props = defineProps<{
  productToDelete: Product
}>();

const emits = defineEmits<{
  closeConfirmation: [isRemoved: boolean]
}>();

const removeFromShoppingList = () => {
  axios.patch(
      'https://glouton-fd999217b246.herokuapp.com/scanned-products/' + props.productToDelete?.id,
      {addedToListAt: null},
      {headers: {Authorization: `Bearer ${tokenStore.token}`}}
  )
      .then(response => {
        emits('closeConfirmation', true)
      })
      .catch(error => {
        console.error('Error during remove from shopping list:', error);
      });
};
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-10 h-screen animate-overlay"
       @click="$emit('closeConfirmation', false)">
    <div class="w-3/4 bg-white z-20 p-2 rounded animate-modal" @click.stop>
      <h1 class="text-xl">Attention</h1>
      <p class="py-2">Veux-tu retirer <span class="font-semibold">{{ props.productToDelete?.name }}</span> de ta liste
        de course ?</p>
      <div class="w-full flex justify-end">
        <button class="btn py-1.5 px-3 rounded border border-red-400"
                @click="removeFromShoppingList()">Oui
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-overlay {
  animation: fadeIn 0.3s ease;
}

.animate-modal {
  animation: slideIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-40px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>