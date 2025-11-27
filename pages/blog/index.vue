<template>
  <div class="max-w-3xl mx-auto p-8 font-serif text-black bg-white min-h-screen">
    <header class="mb-8 border-b-2 border-black pb-4 flex justify-between items-end">
      <div>
        <h1 class="text-3xl font-bold uppercase mb-2">Blog</h1>
        <p class="text-md italic">Notes and thoughts on technology.</p>
      </div>
      <NuxtLink to="/" class="text-sm hover:underline">&larr; Back to Home</NuxtLink>
    </header>

    <div class="grid gap-8">
      <div v-if="!hasArticles" class="text-center text-gray-500">
        No posts found.
      </div>
      
      <div v-else v-for="(languages, topic) in groupedArticles" :key="topic" class="border-b border-gray-200 pb-4">
        <button 
          @click="toggleTopic(topic)" 
          class="w-full flex justify-between items-center text-left py-2 hover:bg-gray-50 transition-colors focus:outline-none"
        >
          <h2 class="text-2xl font-bold capitalize">{{ topic }}</h2>
          <span class="text-xl transform transition-transform duration-200" :class="{ 'rotate-180': expandedTopics.has(topic) }">
            ▼
          </span>
        </button>

        <div v-if="expandedTopics.has(topic)" class="mt-4 space-y-6 pl-4 border-l-2 border-gray-100">
          <div v-for="(articles, lang) in languages" :key="lang">
            <h3 class="text-lg font-semibold mb-3 text-gray-700 flex items-center gap-2">
              <span class="uppercase text-xs font-bold px-2 py-1 bg-gray-100 rounded">{{ lang === 'id' ? 'Indonesia' : (lang === 'en' ? 'English' : lang) }}</span>
            </h3>
            <div class="grid gap-3">
              <div v-for="article in articles" :key="article.path" class="group">
                <NuxtLink :to="article.path" class="block hover:bg-gray-50 p-2 rounded transition-colors -ml-2">
                  <h4 class="text-md font-bold group-hover:text-blue-600">{{ article.title || 'Untitled' }}</h4>
                  <p class="text-sm text-gray-500 line-clamp-1">{{ article.description }}</p>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data: articles } = await useAsyncData('blog', () => queryCollection('content').all())

const expandedTopics = ref(new Set())

const toggleTopic = (topic) => {
  if (expandedTopics.value.has(topic)) {
    expandedTopics.value.delete(topic)
  } else {
    expandedTopics.value.add(topic)
  }
}

const groupedArticles = computed(() => {
  if (!articles.value) return {}
  
  const groups = {}
  
  articles.value.forEach(article => {
    // Expected path: /blog/<topic>/<lang>/<slug>
    // Example: /blog/kubernetes/id/modul-0
    const parts = article.path.split('/').filter(Boolean)
    
    // parts[0] = 'blog'
    // parts[1] = topic (e.g., 'kubernetes')
    // parts[2] = lang (e.g., 'id', 'en') or filename if legacy
    
    if (parts.length < 2) return // Skip invalid paths
    
    const topic = parts[1]
    let lang = 'General'
    
    if (parts.length >= 3) {
      // Check if parts[2] is a known language code or folder
      if (['id', 'en'].includes(parts[2])) {
        lang = parts[2]
      } else {
        // Fallback for files directly in topic folder or other structure
        // If the file is like /blog/kubernetes/modul-0.md, parts[2] is 'modul-0'
        // We can treat it as 'General' or try to infer
        lang = 'General' 
      }
    }

    if (!groups[topic]) {
      groups[topic] = {}
    }
    if (!groups[topic][lang]) {
      groups[topic][lang] = []
    }
    
    groups[topic][lang].push(article)
  })
  
  // Sort articles within languages
  for (const topic in groups) {
    for (const lang in groups[topic]) {
      groups[topic][lang].sort((a, b) => (a.title || '').localeCompare(b.title || ''))
    }
  }
  
  return groups
})

const hasArticles = computed(() => Object.keys(groupedArticles.value).length > 0)

useHead({
  title: 'Blog - Vikri Usman Rizky'
})
</script>
