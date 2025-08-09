<script lang="ts" setup>

import type {Product} from "@/interfaces/product.ts";

const props = defineProps<{
  product: Product,
  body: string
}>();

const emits = defineEmits<{
  closeConfirmation: [isRemoved: boolean]
}>();

const confirm = (): void => {
  emits('closeConfirmation', true)
};
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-10 h-screen animate-overlay"
       @click="$emit('closeConfirmation', false)">

    <div class="w-3/4 bg-white z-20 p-3 rounded animate-modal" @click.stop>
      <h1 class="text-xl">Attention</h1>
      <p class="py-2" v-html="props.body"></p>
      <div class="w-full flex justify-end">
        <button class="btn py-1 px-3 rounded bg-red-400 text-white" @click="confirm()">Oui</button>
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