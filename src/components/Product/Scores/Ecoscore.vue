<script lang="ts" setup>

const props = defineProps<{
  ecoscore: string | undefined
}>();
</script>

<template>
  <img v-if="props.ecoscore === 'a'" src="/public/ecoscore/A-ecoscore.svg" class="h-8" alt="a ecoscore">
  <img v-else-if="props.ecoscore === 'b'" src="/public/ecoscore/B-ecoscore.svg" class="h-8" alt="b ecoscore">
  <img v-else-if="props.ecoscore === 'c'" src="/public/ecoscore/C-ecoscore.svg" class="h-8" alt="c ecoscore">
  <img v-else-if="props.ecoscore === 'd'" src="/public/ecoscore/D-ecoscore.svg" class="h-8" alt="d ecoscore">
  <img v-else-if="props.ecoscore === 'e'" src="/public/ecoscore/E-ecoscore.svg" class="h-8" alt="e ecoscore">
  <img v-else src="/public/ecoscore/unknown-ecoscore.svg" class="h-8" alt="unknown ecoscore">
</template>