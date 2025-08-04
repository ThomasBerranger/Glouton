<script lang="ts" setup>

const props = defineProps<{
  novagroup: number | undefined
}>();
</script>

<template>
  <img v-if="props.novagroup === 1" src="/public/novagroup/1-novagroup.svg" class="h-10" alt="1 novagroup">
  <img v-else-if="props.novagroup === 2" src="/public/novagroup/2-novagroup.svg" class="h-10" alt="2 novagroup">
  <img v-else-if="props.novagroup === 3" src="/public/novagroup/3-novagroup.svg" class="h-10" alt="3 novagroup">
  <img v-else-if="props.novagroup === 4" src="/public/novagroup/4-novagroup.svg" class="h-10" alt="4 novagroup">
  <img v-else src="/public/novagroup/unknown-novagroup.svg" class="h-10" alt="unknown novagroup">
</template>