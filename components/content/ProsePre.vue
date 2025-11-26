<template>
  <div v-if="language === 'mermaid'" class="my-4">
    <ClientOnly>
      <MermaidRenderer :code="code" />
      <template #fallback>
        <pre class="p-4 bg-gray-100 rounded">Loading diagram...</pre>
      </template>
    </ClientOnly>
  </div>
  <pre v-else :class="$props.class"><slot /></pre>
</template>

<script setup>
defineProps({
  code: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: null
  },
  filename: {
    type: String,
    default: null
  },
  highlights: {
    type: Array,
    default: () => []
  },
  meta: {
    type: String,
    default: null
  },
  class: {
    type: String,
    default: null
  }
})
</script>

<style>
/* Ensure standard pre blocks are styled if they lose default styling */
pre {
  overflow-x: auto;
}
</style>
