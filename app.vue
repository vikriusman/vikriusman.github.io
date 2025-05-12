<template>
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
          <img :src="data.icon" width="20" />
        </a>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4 justify-items-center items-center">
      <div class="col-span-2 md:col-span-1 md:mb-0 mb-7">
        <div class="text-4xl md:text-5xl font-bold">
          Oniel and Azizi are
          <span class="text-violet-400">Kintan's Oshi</span> and
          <span class="text-violet-400">JKT48's Member</span>
        </div>

        <div class="my-9">
          They singing and dancing on stage, also an actres who meet their fans
          on JKT48 Theater
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
            class="z-1 absolute bottom-1/11 md:right-1/5 right-0 rotate-90"
          />

          <div class="flex items-center flex-col">
            <img
              :src="zeeOniel"
              class="aspect-2/3 object-cover relative z-2"
              width="300"
            />
            <div
              class="w-80 p-2 border-2 border-zinc-400 flex gap-3 items-center"
            >
              <div class="w-5 h-5 bg-violet-400"></div>
              currently working on<span class="font-bold">JKT48</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <section class="mt-20">
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

          <div class="text-l text-gray-600 dark:text-gray-400 font-medium p-3">
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

    <section class="mt-20">
      <div class="flex items-center md:w-120 w-full">
        <UIcon
          name="i-mingcute-dot-grid-line"
          class="text-2xl text-violet-400"
        />

        <span class="text-2xl font-bold ml-1 mr-3">Skills</span>
        <hr class="flex-1 border-violet-400" />
      </div>

      <div class="mt-5 grid grid-cols-2 gap-5 mt-5">
        <div class="grid grid-cols-3 gap-5 col-span-2 md:col-span-1">
          <div
            class="border-2 col-span-3 md:col-span-1 border-zinc-400 divide-y-1 divide-gray-200"
            v-for="(data, key) in skills"
            :key="key + 'skill'"
          >
            <div class="mb-3 text-xl text-violet-400 font-medium p-3">
              {{ data.title }}
            </div>
            <div class="p-3 gap-3">
              <span v-for="(item, i) in data.item" :key="i + 'item'">{{
                item
              }}</span>
            </div>
          </div>
        </div>
        <div
          class="col-span-2 md:col-span-1 justify-items-center content-center hidden md:block"
        >
          <div
            class="border-2 border-double border-zinc-400 w-90 h-40 flex justify-center"
          >
            <div class="bg-zinc-900 -mt-40 p-6">
              <img :src="skill" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import zeeOniel from "~/assets/images/oniel-zee.png";
import banner from "~/assets/images/banner.png";
import github from "~/assets/images/github.png";
import linkedin from "~/assets/images/linkedin.png";
import shape from "~/assets/images/shape.png";
import gmail from "~/assets/images/gmail.png";
import skill from "~/assets/images/skills.png";

const socials = [
  {
    icon: github,
    link: "https://www.instagram.com/zeeasadel/",
  },
  {
    icon: linkedin,
    link: "https://www.instagram.com/jkt48.oniel/",
  },
  {
    icon: gmail,
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

const skills = [
  {
    title: "skill title",
    item: ["html", "js", "abacadabra"],
  },
  {
    title: "skill title",
    item: ["html", "js", "abacadabra"],
  },
  {
    title: "skill title",
    item: ["html", "js", "abacadabra"],
  },
  {
    title: "skill title",
    item: ["html", "js", "abacadabra"],
  },
  {
    title: "skill title",
    item: ["html", "js", "abacadabra"],
  },
];

useHead({
  titleTemplate: "Vikri Usman Rizky",
});

function containsHttps(text: string | string[]) {
  return text.includes("https");
}
</script>
