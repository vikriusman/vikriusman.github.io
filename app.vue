<template>
  <div>
    <div class="md:p-25 p-10">
      <div class="fixed top-0 md:left-4 left-2">
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
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4 justify-items-center items-center">
        <div class="col-span-2 md:col-span-1 md:mb-0 mb-7">
          <div class="text-4xl md:text-5xl font-bold mb-3">
            Vikri Usman Rizky is a
            <span class="text-violet-400">DevOps Engineer</span>
          </div>
          <div class="text-2xl md:text-3xl font-bold">
            Specializing in
            <span class="text-violet-400"
              >Cloud Infrastructure, CI/CD Automation, and System
              Reliability.</span
            >
          </div>

          <div class="my-9">
            DevOps Engineer with over 5 years of experience delivering
            full-cycle software development for 17+ projects in the
            telecommunications, finance, and public sectors. Proficient in
            CI/CD, microservices architecture, cloud-native development, and
            cross-functional collaboration. Specialized in automating
            deployments, optimizing databases, and ensuring high availability in
            production environments.
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
                currently working on<span class="font-bold">JKT48</span>
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
          class="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5 mt-5 justify-between"
        >
          <div
            class="border-2 border-zinc-400 divide-y-1 divide-gray-200"
            v-for="(project, key) in projects"
            :key="key + 'pr'"
          >
            <img :src="project.icon" class="aspect-3/2 object-cover" />

            <div
              class="text-l text-gray-600 dark:text-gray-400 font-medium p-3"
            >
              {{ project.sub_title }}
            </div>
            <div class="p-3">
              <div class="mb-3 text-xl text-violet-400 font-medium">
                {{ project.title }}
              </div>
              <div>{{ project.description }}</div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div
      class="border-t-2 border-zinc-300 bg-zinc-200 dark:bg-zinc-800 md:px-25 md:py-5 py-5 px-10 justify-between h-full"
    >
      <div class="grid grid-cols-2 gap-4 items-center">
        <div class="col-span-2 md:col-span-1">
          <div>Oniel, Lily adn Azizi</div>
          <div>working on JKT48</div>
        </div>
        <div class="col-span-2 md:col-span-1 justify-items-end">
          <div class="font-bold mb-2">Socials Media</div>
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

      <div class="text-center mt-10 dark:text-gray-400 text-gray-600">
        &copy; Copyright {{ year }}. Made by Kintan Umari
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import mylofly from "~/assets/images/mylofly.png";
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

const year = new Date().getFullYear();

const socials = [
  {
    icon: github,
    dark_icon: github_dark,
    link: "https://www.instagram.com/zeeasadel/",
  },
  {
    icon: linkedin,
    dark_icon: linkedin_dark,
    link: "https://www.instagram.com/jkt48.oniel/",
  },
  {
    icon: gmail,
    dark_icon: gmail_dark,
    link: "vikriusman02@gmail.com",
  },
];

const email = "vikriusman02@gmail.com";

const projects = [
  {
    icon: banner,
    title: "Project Title",
    sub_title: "Maintenance",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, seddo eiusmod tempor i",
  },
  {
    icon: banner,
    title: "Project Title",
    sub_title: "Web Development",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enimad minim veniam, quis nostrud exercitation ullamco",
  },
  {
    icon: banner,
    title: "Project Title",
    sub_title: "Web Development",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enimad minim veniam, quis nostrud exercitation ullamco",
  },
  {
    icon: banner,
    title: "Project Title",
    sub_title: "Web Development",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enimad minim veniam, quis nostrud exercitation ullamco",
  },
];

useHead({
  titleTemplate: "Vikri Usman Rizky",
});

function containsHttps(text: string | string[]) {
  return text.includes("https");
}
</script>
