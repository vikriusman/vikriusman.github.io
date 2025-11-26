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
          <a :href="social.link" target="_blank" class="hover:underline">{{ social.link }}</a>
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

    <!-- Projects / Experience -->
    <section class="mb-6">
      <h3 class="text-lg font-bold uppercase border-b border-black mb-3">Professional Experience & Projects</h3>
      <div v-for="(project, index) in projects" :key="index" class="mb-4">
        <div class="flex justify-between items-baseline mb-1">
          <h4 class="font-bold text-lg">{{ project.title }}</h4>
          <span class="italic text-sm">{{ project.sub_title }}</span>
        </div>
        <p class="text-sm text-justify leading-relaxed">
          {{ project.description }}
        </p>
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import profile from "~/data/profile.json";
import skills from "~/data/skills.json";
import projectsData from "~/data/projects.json";
import certs from "~/data/certification.json";

const projects = ref(projectsData);

useHead({
  title: `${profile.name} - ATS CV`,
  meta: [
    { name: 'description', content: 'ATS Friendly CV of Vikri Usman Rizky' }
  ]
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
