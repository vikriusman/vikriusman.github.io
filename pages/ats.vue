<template>
  <div class="max-w-3xl mx-auto p-8 font-serif text-black bg-white">
    <!-- Header -->
    <header class="mb-8 border-b-2 border-black pb-4">
      <h1 class="text-3xl font-bold uppercase mb-2">{{ profile.name }}</h1>
      <h2 class="text-xl font-semibold mb-2">{{ profile.title }}</h2>
      <p class="text-md italic mb-2">{{ profile.summary_title_prefix }} {{ profile.summary_title }}</p>
      <div class="flex flex-wrap gap-4 text-sm">
        <!-- <a :href="'mailto:' + profile.email" class="hover:underline">{{ profile.email }}</a> -->
        <span v-for="(social, index) in profile.socials" :key="index">
          <a v-if="social.link.includes('@')" :href="'mailto:' + social.link" target="_blank" class="hover:underline">{{ social.link }}</a>
          <a v-else :href="social.link" target="_blank" class="hover:underline">{{ social.link }}</a>
        </span>
      </div>
    </header>

    <!-- Summary -->
    <section class="mb-6">
      <h3 class="text-lg font-bold uppercase border-b border-black mb-3">Professional Summary</h3>
      <p class="text-justify leading-relaxed">
        {{ profile.summary }}
      </p>
    </section>

    <!-- Skills -->
    <section class="mb-6">
      <h3 class="text-lg font-bold uppercase border-b border-black mb-3">Skills</h3>
      <div class="grid grid-cols-1 gap-2">
        <div v-for="(skillGroup, index) in skills" :key="index" class="flex">
          <span class="font-bold w-40 flex-shrink-0">{{ skillGroup.title }}:</span>
          <span>{{ skillGroup.item.join(' ') }}</span>
        </div>
      </div>
    </section>

    <!-- Portfolio -->
    <section class="mb-6">
      <h3 class="text-lg font-bold uppercase border-b border-black mb-3">Portfolio</h3>
      <p class="text-sm mb-3">
        github.com/vikriusman/curated. Labs are runnable and rebuilt from scratch with recorded proof;
        field notes are anonymized write-ups of real production work.
      </p>
      <div v-for="(item, index) in portfolio" :key="index" class="mb-4">
        <div class="flex justify-between items-baseline mb-1">
          <h4 class="font-bold text-lg">{{ item.title }}</h4>
          <span class="italic text-sm">{{ item.kind }} {{ item.code }}</span>
        </div>
        <p class="text-sm text-justify leading-relaxed">{{ item.summary }} {{ item.proof }}</p>
        <p class="text-sm">Stack: {{ item.stack.join(', ') }}</p>
        <a :href="item.link" target="_blank" class="text-xs text-blue-600">{{ item.link }}</a>
      </div>
    </section>

    <!-- Certifications -->
    <section class="mb-6">
      <h3 class="text-lg font-bold uppercase border-b border-black mb-3">Certifications</h3>
      <ul class="list-disc list-inside">
        <li v-for="(cert, index) in certs" :key="index" class="mb-1">
          <span class="font-bold">{{ cert.title }}</span> - {{ cert.sub_title }}
          <a v-if="cert.verification" :href="cert.verification" target="_blank" class="text-xs text-blue-600 ml-2">[Verify]</a>
        </li>
      </ul>
    </section>

    <!-- Disclaimer -->
    <footer class="mt-8 pt-4 border-t border-gray-300">
      <p class="text-xs italic text-gray-500 text-justify leading-relaxed">
        Infrastructure estimates are approximate and assumption-based in the absence of product incubation. Exact requirements depend on finalized product scope, tech stack, and user targets.
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import profile from "~/data/profile.yml";
import skills from "~/data/skills.yml";
import portfolio from "~/data/portfolio.yml";
import certs from "~/data/certification.yml";

useHead({
  title: `${profile.name} - ATS CV`,
  meta: [
    { name: 'description', content: 'ATS-friendly CV of Vikri Usman Rizky, DevOps & Cloud Engineer: skills, portfolio, and certifications in plain text.' },
    { property: 'og:title', content: `${profile.name} - ATS CV` },
    { property: 'og:description', content: 'ATS-friendly CV of Vikri Usman Rizky, DevOps & Cloud Engineer: skills, portfolio, and certifications in plain text.' },
    { property: 'og:url', content: 'https://vikriusman.github.io/ats' }
  ],
  link: [{ rel: 'canonical', href: 'https://vikriusman.github.io/ats' }]
});
</script>

<style scoped>
/* Minimal print styles */
@media print {
  body {
    font-size: 12pt;
  }
  a {
    text-decoration: none;
    color: black;
  }
  .max-w-3xl {
    max-width: 100%;
    margin: 0;
    padding: 0;
  }
}
</style>
