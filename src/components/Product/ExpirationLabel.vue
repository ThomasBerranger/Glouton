<script lang="ts" setup>

import moment from "moment/moment";
import {onMounted, ref} from "vue";

const props = defineProps<{
  expirationDate: string | null;
}>();

const formattedNumber = ref<number | null>();
const formattedUnit = ref<string>();
const labelColor = ref<string>();

onMounted(async () => {
  if (props.expirationDate) {
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
        labelColor.value = 'bg-orange-400';
      } else if (formattedNumber.value <= 15) {
        labelColor.value = 'bg-orange-300';
      } else {
        labelColor.value = 'green-background';
      }
    }
  } else {
    labelColor.value = 'bg-indigo-300';
    formattedNumber.value = null;
    formattedUnit.value = "Vide";
  }
})
</script>

<template>
  <div :class="labelColor"
       class="text-white text-center font-semibold">
    {{ formattedNumber }} <span class="text-xs font-normal">{{ formattedUnit }}</span>
  </div>
</template>
