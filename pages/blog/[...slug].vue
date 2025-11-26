<template>
  <div class="max-w-3xl mx-auto p-8 font-serif text-black bg-white min-h-screen">
    <header class="mb-8 border-b-2 border-black pb-4">
      <NuxtLink to="/blog" class="text-sm hover:underline">&larr; Back to Blog</NuxtLink>
    </header>

    <main class="prose max-w-none">
      <div v-if="doc">
        <article>
          <h1 class="text-3xl font-bold mb-4">{{ doc.title }}</h1>
          <div class="text-sm text-gray-500 mb-8 border-b pb-4">
            {{ doc.description }}
          </div>
          <ContentRenderer :value="doc" />
        </article>
      </div>
      <div v-else>
        <h1>Document not found</h1>
      </div>
    </main>
  </div>
</template>

<script setup>
const route = useRoute()
const { data: doc } = await useAsyncData(route.path, () => queryCollection('content').path(route.path).first())
</script>

<style>
/* Basic typography for markdown content */
.prose h1 { font-size: 1.875rem; line-height: 2.25rem; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; }
.prose h2 { font-size: 1.5rem; line-height: 2rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.75rem; border-bottom-width: 1px; padding-bottom: 0.5rem; }
.prose h3 { font-size: 1.25rem; line-height: 1.75rem; font-weight: 700; margin-top: 1rem; margin-bottom: 0.5rem; }
.prose p { margin-bottom: 1rem; line-height: 1.625; text-align: justify; }
.prose ul { list-style-type: disc; list-style-position: inside; margin-bottom: 1rem; }
.prose ol { list-style-type: decimal; list-style-position: inside; margin-bottom: 1rem; }
.prose li { margin-bottom: 0.25rem; }
.prose a { color: #2563eb; text-decoration: none; }
.prose a:hover { text-decoration: underline; }
.prose code { background-color: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-size: 0.875rem; font-family: monospace; }
.prose pre { background-color: #111827; color: white; padding: 1rem; border-radius: 0.25rem; margin-bottom: 1rem; overflow-x: auto; }
.prose pre code { background-color: transparent; padding: 0; color: white; }
.prose blockquote { border-left-width: 4px; border-color: #d1d5db; padding-left: 1rem; font-style: italic; margin-top: 1rem; margin-bottom: 1rem; }
.prose table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; }
.prose th, .prose td { border-width: 1px; border-color: #d1d5db; padding: 0.5rem; text-align: left; }
.prose th { background-color: #f3f4f6; font-weight: 700; }
</style>
