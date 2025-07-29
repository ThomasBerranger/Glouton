<script lang="ts" setup>

import moment from "moment/moment";
import {onMounted, ref} from "vue";

const props = defineProps<{
  expirationDate: string
}>();

const formattedNumber = ref<number>();
const formattedUnit = ref<string>();
const labelColor = ref<string>();

onMounted(async () => {
  if (moment(props.expirationDate).diff(moment(), 'months')) {
    formattedNumber.value = moment(props.expirationDate).diff(moment(), 'months');
    formattedUnit.value = 'mois';
    labelColor.value = formattedNumber.value > 0 ? 'green-background' : 'bg-stone-500';
  } else {
    formattedNumber.value = moment(props.expirationDate).diff(moment(), 'days');
    formattedUnit.value = `jour${[-1, 0, 1].includes(formattedNumber.value) ? '' : 's'}`

    if (formattedNumber.value < 0) {
      labelColor.value = 'bg-stone-500';
    } else if (formattedNumber.value <= 3) {
      labelColor.value = 'bg-red-500';
    } else if (formattedNumber.value <= 7) {
      labelColor.value = 'bg-red-400';
    } else if (formattedNumber.value <= 10) {
      labelColor.value = 'bg-orange-500';
    } else if (formattedNumber.value <= 13) {
      labelColor.value = 'bg-amber-500';
    } else if (formattedNumber.value <= 13) {
      labelColor.value = 'bg-yellow-500';
    } else if (formattedNumber.value <= 16) {
      labelColor.value = 'bg-emerald-500';
    } else {
      labelColor.value = 'bg-emerald-500';
    }
  }
})
</script>

<template>
  <div :class="labelColor"
       class="absolute top-0 left-0 text-white rounded-br-3xl pl-1.5 pr-3 pb-1 text-sm font-semibold">
    {{ formattedNumber }} <span class="text-xs font-normal">{{ formattedUnit }}</span>
  </div>
</template>
