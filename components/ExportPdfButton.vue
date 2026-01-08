<template>
  <ClientOnly>
    <div class="cursor-pointer pointer-events-auto relative z-50">
      <UButton
        icon="i-heroicons-printer"
        size="sm"
        color="gray"
        variant="ghost"
        aria-label="Export to PDF"
        @click="exportToPdf"
      />
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
const { exportToPdf } = usePdfExport();
</script>
