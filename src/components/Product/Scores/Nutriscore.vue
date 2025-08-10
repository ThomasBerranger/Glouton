<script lang="ts" setup>

const props = defineProps<{
  nutriscore: string | null | undefined
}>();

</script>

<template>
  <img v-if="props.nutriscore === 'a'" src="/public/nutriscore/A-nutriscore.svg" class="h-10" alt="a nutriscore">
  <img v-else-if="props.nutriscore === 'b'" src="/public/nutriscore/B-nutriscore.svg" class="h-10"
       alt="b nutriscore">
  <img v-else-if="props.nutriscore === 'c'" src="/public/nutriscore/C-nutriscore.svg" class="h-10"
       alt="c nutriscore">
  <img v-else-if="props.nutriscore === 'd'" src="/public/nutriscore/D-nutriscore.svg" class="h-10"
       alt="d nutriscore">
  <img v-else-if="props.nutriscore === 'e'" src="/public/nutriscore/E-nutriscore.svg" class="h-10"
       alt="e nutriscore">
  <img v-else src="/public/nutriscore/unknown-nutriscore.svg" class="h-12" alt="unknown nutriscore">
</template>