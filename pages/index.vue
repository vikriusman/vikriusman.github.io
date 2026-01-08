<template>
  <div>
    <div class="fixed top-0 md:left-4 left-2 z-50">
      <div
        class="flex flex-col items-center gap-3 text-gray-500 dark:text-gray-400 h-80"
      >
        <div class="flex-1 w-[2px] bg-gray-300 dark:bg-gray-700"></div>

        <a
          v-for="(data, key) in socials"
          :key="key"
          :href="containsHttps(data.link) ? data.link : 'mailto:' + data.link"
          target="_blank"
        >
          <img :src="data.icon" width="20" class="hidden dark:block" />
          <img :src="data.dark_icon" width="20" class="block dark:hidden" />
        </a>
        <ExportPdfButton />
      </div>
    </div>
    <div class="md:p-25 p-10">

      <div class="grid grid-cols-2 gap-4 justify-items-center items-center">
        <div class="col-span-2 md:col-span-1 md:mb-0 mb-7">
          <div class="text-4xl md:text-4xl font-bold mb-3">
            {{ profile.name }} | <span class="text-violet-400">{{ profile.title }}</span>
          </div>
          <div class="text-2xl md:text-3xl font-bold">
            {{ profile.summary_title_prefix }}
            <span class="text-violet-400"
              >{{ profile.summary_title }}</span
            >
          </div>

          <div class="my-9">
            {{ profile.summary }}
          </div>
        </div>
        <div class="col-span-2 md:col-span-1 w-full">
          <div class="relative w-full">
            <img
              :src="shape"
              width="200"
              class="z-1 absolute top-1/5 md:left-1/6 left-0"
            />
            <img
              :src="shape"
              width="150"
              class="z-3 absolute bottom-1/11 md:right-1/5 right-0 rotate-90"
            />

            <div class="flex items-center flex-col">
              <img
                :src="mylofly"
                class="aspect-2/3 object-cover relative z-2"
                width="300"
              />
              <div
                class="w-80 p-2 border-2 border-zinc-400 flex gap-3 items-center mt-2"
              >
                <div class="w-5 h-5 bg-violet-400"></div>
                Working on <span class="font-bold">Large-scale system</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section class="mt-25">
        <div class="flex items-center md:w-120 w-full">
          <UIcon
            name="i-mingcute-dot-grid-line"
            class="text-2xl text-violet-400"
          />

          <span class="text-2xl font-bold ml-1 mr-3">Skills</span>
          <hr class="flex-1 border-violet-400" />
        </div>

        <div class="mt-5 grid grid-cols-3 gap-5 mt-5 justify-items-center">
          <div class="col-span-3 md:col-span-2 w-full">
            <div class="grid grid-cols-4 gap-5">
              <div
                class="border-2 col-span-4 md:col-span-1 border-zinc-400 divide-y-1 divide-gray-200"
                v-for="(data, key) in skills"
                :key="key + 'skill'"
              >
                <div class="mb-3 text-xl text-violet-400 font-medium p-3">
                  {{ data.title }}
                </div>
                <div class="p-3 flex flex-wrap gap-3">
                  <span v-for="(item, i) in data.item" :key="i + 'item'">{{
                    item
                  }}</span>
                </div>
              </div>
            </div>
          </div>
          <div
            class="col-span-3 md:col-span-1 justify-items-center content-center hidden md:block"
          >
            <div
              class="border-2 border-zinc-400 w-80 max-h-40 flex justify-center"
            >
              <div class="dark:bg-zinc-900 bg-white -mt-40 p-6">
                <img :src="skill" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="mt-25">
        <div class="flex items-center md:w-100 w-full">
          <UIcon
            name="i-mingcute-dot-grid-line"
            class="text-2xl text-violet-400"
          />

          <span class="text-2xl font-bold ml-1 mr-3">Projects</span>
          <hr class="flex-1 border-violet-400" />
        </div>

        <div
          class="mt-5 grid grid-cols-1 md:grid-cols-4 gap-5 mt-5 justify-between"
        >
          <div
            class="border-2 border-zinc-400 divide-y-1 divide-gray-200"
            v-for="(project, key) in projects"
            :key="key + 'pr'"
          >
            <div class="relative aspect-3/2 overflow-hidden">
              <UCarousel
                v-slot="{ item }"
                :dots="project.icon.length > 1 ? true : false"
                :ui="{
                  controls: 'absolute bottom-1 inset-x-12',
                  dots: 'bottom-2 ',
                  dot: 'w-6 h-1  shadow-2xl',
                }"
                :items="project.icon"
                class="justify-center w-full h-full"
              >
                <div class="w-full h-full aspect-3/2 flex justify-center">
                  <img
                    :src="item"
                    @click="previewImage(item)"
                    class="object-cover"
                  />
                </div>
              </UCarousel>
            </div>

            <div
              class="text-l text-gray-600 dark:text-gray-400 font-medium p-3"
            >
              {{ project.sub_title }}
            </div>
            <div class="p-3 justify-between">
              <div class="mb-3 text-xl text-violet-400 font-medium">
                {{ project.title }}
              </div>
              <div>
                {{ project.description.slice(0, 200) }}...
                <div
                  class="font-bold text-violet-400 cursor-pointer mt-2"
                  @click="openDescription(project)"
                >
                  Read more
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="mt-25">
        <div class="flex items-center md:w-140 w-full">
          <UIcon
            name="i-mingcute-dot-grid-line"
            class="text-2xl text-violet-400"
          />

          <span class="text-2xl font-bold ml-1 mr-3">Certification</span>
          <hr class="flex-1 border-violet-400" />
        </div>

        <div
          class="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5 mt-5 justify-between"
        >
          <div
            class="border-2 border-zinc-400 divide-y-1 divide-gray-200"
            v-for="(project, key) in certs"
            :key="key + 'pr'"
          >
            <div class="relative aspect-3/2 overflow-hidden">
              <UCarousel
                v-slot="{ item }"
                :dots="project.icon.length > 1 ? true : false"
                :ui="{
                  controls: 'absolute bottom-1 inset-x-12',
                  dots: 'bottom-2 ',
                  dot: 'w-6 h-1  shadow-2xl',
                }"
                :items="project.icon"
                class="flex justify-center w-full h-full"
              >
                <div class="w-full h-full aspect-3/2 object-cover">
                  <img
                    :src="item"
                    @click="previewImage(item)"
                    class="object-cover"
                  />
                </div>
              </UCarousel>
            </div>

            <div class="text-l text-violet-400 font-medium font-medium p-3">
              <a :href="project.verification" target="_blank"
                >{{ project.sub_title }} : {{ project.title }}</a
              >
            </div>
          </div>
        </div>
      </section>
    </div>

    <div
      class="border-t-2 border-zinc-300 bg-zinc-200 dark:bg-zinc-800 md:px-25 md:py-5 py-5 px-10 md:justify-between justify-center h-full"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div
          class="justify-items-center text-center md:justify-items-start md:text-start"
        >
          <div>
            Currently accepting freelance projects and open to job opportunities
          </div>
          <div>as {{ profile.title }}</div>
        </div>
        <div class="md:justify-items-end justify-items-center">
          <div class="font-bold mb-2">Contact Me :</div>
          <div class="flex gap-3 flex-wrap">
            <a
              v-for="(data, key) in socials"
              :key="key"
              :href="
                containsHttps(data.link) ? data.link : 'mailto:' + data.link
              "
              target="_blank"
            >
              <img :src="data.icon" width="25" class="hidden dark:block" />
              <img :src="data.dark_icon" width="25" class="block dark:hidden" />
            </a>
          </div>
        </div>
      </div>

      <div
        class="justify-center mt-10 dark:text-gray-400 text-gray-600 flex gap-1 flex-wrap"
      >
        <span>&copy; Copyright {{ year }}.</span>
        <span
          >Made by
          <a
            class="text-violet-400"
            href="https://kintanr.github.io"
            target="_blank"
            >Kintan Umari
          </a></span
        >
      </div>

      <UModal v-model:open="open" class="!max-w-[900px] overflow-y-auto">
        <template #content>
          <img :src="imagePrev" class="rounded-lg" />
        </template>
      </UModal>

      <UModal v-model:open="open_description" :title="project_title">
        <template #body>
          <div>
            {{ all_description }}
          </div>
        </template>
      </UModal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
// import mylofly from "~/assets/images/mylofly.png";
import mylofly from "/images/me.png";
import banner from "~/assets/images/banner.png";
import github from "~/assets/images/github.png";
import github_dark from "~/assets/images/github-dark.png";
import linkedin from "~/assets/images/linkedin.png";
import linkedin_dark from "~/assets/images/linkedin-dark.png";
import shape from "~/assets/images/shape.png";
import gmail from "~/assets/images/gmail.png";
import gmail_dark from "~/assets/images/gmail-dark.png";
import skill from "~/assets/images/skills.png";

import skills from "~/data/skills.json";
import projects from "~/data/projects.json";
import certs from "~/data/certification.json";
import profile from "~/data/profile.json";

const year = new Date().getFullYear();

const open = ref(false);
const imagePrev = ref(null);

function previewImage(image: any) {
  open.value = true;
  imagePrev.value = image;
}

const open_description = ref(false);
const project_title = ref(null);
const all_description = ref(null);

function openDescription(data: any) {
  open_description.value = true;
  project_title.value = data.title;
  all_description.value = data.description;
}

const socials = [
  {
    icon: github,
    dark_icon: github_dark,
    link: profile.socials.find(s => s.name === 'GitHub')?.link || "https://github.com/vikriusman",
  },
  {
    icon: linkedin,
    dark_icon: linkedin_dark,
    link: profile.socials.find(s => s.name === 'LinkedIn')?.link || "https://www.linkedin.com/in/vikri-usman-rizky",
  },
  {
    icon: gmail,
    dark_icon: gmail_dark,
    link: profile.socials.find(s => s.name === 'Gmail')?.link || "vikriusman2@gmail.com",
  },
];

const email = profile.email;

definePageMeta({
  alias: '/export'
});

const route = useRoute();
const { exportToPdf } = usePdfExport();

onMounted(async () => {
  console.log('Current route path:', route.path);
  if (route.path === '/export' || route.path === '/export/') {
    console.log('Triggering export...');
    await exportToPdf();
  }
});

useHead({
  titleTemplate: profile.name,
});

function containsHttps(text: string | string[]) {
  return text.includes("https");
}
</script>
