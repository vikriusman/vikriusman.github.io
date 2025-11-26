<template>
  <div ref="container" class="mermaid">
    {{ code }}
  </div>
</template>

<script setup>
import { onMounted, ref, watch, nextTick } from 'vue'
import mermaid from 'mermaid'

const props = defineProps({
  code: {
    type: String,
    required: true
  }
})

const container = ref(null)

onMounted(async () => {
  mermaid.initialize({ 
    startOnLoad: false,
    theme: 'default',
    securityLevel: 'loose'
  })
  await renderDiagram()
})

watch(() => props.code, async () => {
  await renderDiagram()
})

async function renderDiagram() {
  if (!container.value) return
  
  // Reset container content to original code before rendering
  // This is important because mermaid.run processes the DOM content
  container.value.removeAttribute('data-processed')
  container.value.innerHTML = props.code
  
  try {
    await mermaid.run({
      nodes: [container.value]
    })
  } catch (error) {
    console.error('Mermaid rendering error:', error)
    container.value.innerHTML = `<pre class="text-red-500">${error.message}</pre>`
  }
}
</script>

<style scoped>
.mermaid {
  background: white;
  padding: 1rem;
  border-radius: 0.5rem;
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}
</style>
