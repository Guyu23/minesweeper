<script lang="ts" setup>

defineProps(['win'])
</script>

<template>
  <div v-if="!win" class="bg-slate-900/20" fixed backdrop-blur >
    <div>you lose</div>
  </div>
</template>

<style scoped></style>
