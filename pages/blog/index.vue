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
      <div v-if="!groupedArticles || Object.keys(groupedArticles).length === 0" class="text-center text-gray-500">
        No posts found.
      </div>
      
      <div v-else v-for="(group, groupName) in groupedArticles" :key="groupName">
        <h2 class="text-2xl font-bold mb-4 capitalize border-b-2 border-gray-800 pb-2">{{ groupName }}</h2>
        <div class="grid gap-4">
          <div v-for="article in group" :key="article.path" class="border-l-4 border-gray-200 pl-4 hover:border-blue-500 transition-colors">
            <NuxtLink :to="article.path" class="group block">
              <h3 class="text-lg font-bold group-hover:text-blue-600">{{ article.title || 'Untitled' }}</h3>
              <p class="text-sm text-gray-600 line-clamp-2">{{ article.description }}</p>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data: articles } = await useAsyncData('blog', () => queryCollection('content').all())

const groupedArticles = computed(() => {
  if (!articles.value) return {}
  
  const groups = {}
  articles.value.forEach(article => {
    // Extract folder name from path: /blog/kubernetes/modul-0 -> kubernetes
    const parts = article.path.split('/')
    // parts[0] is empty, parts[1] is 'blog', parts[2] is the folder
    const folder = parts.length > 3 ? parts[2] : 'General'
    
    if (!groups[folder]) {
      groups[folder] = []
    }
    groups[folder].push(article)
  })
  
  // Sort articles within groups if needed
  for (const folder in groups) {
    groups[folder].sort((a, b) => (a.title || '').localeCompare(b.title || ''))
  }
  
  return groups
})

useHead({
  title: 'Blog - Vikri Usman Rizky'
})
</script>
