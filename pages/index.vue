<template>
  <div class="relative">
    <!-- top bar -->
    <header
      class="sticky top-0 z-40 backdrop-blur-md border-b rule"
      style="background: color-mix(in srgb, var(--bg) 82%, transparent)"
    >
      <div class="mx-auto max-w-6xl px-5 h-12 flex items-center justify-between">
        <div class="flex items-center gap-3 label !text-[var(--ink)]">
          <span class="pulse"></span>
          vikriusman<span class="text-[var(--signal)]">@</span>prod
          <span class="hidden sm:inline text-[var(--ink-dim)]">· all systems operational</span>
        </div>
        <nav class="flex items-center gap-1 sm:gap-4 label">
          <a href="#skills" class="hidden sm:inline hover:text-[var(--signal)]">Stack</a>
          <a href="#portfolio" class="hidden sm:inline hover:text-[var(--signal)]">Portfolio</a>
          <a href="#certs" class="hidden sm:inline hover:text-[var(--signal)]">Certs</a>
          <ExportPdfButton />
          <UButton
            :icon="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'"
            size="sm"
            color="neutral"
            variant="ghost"
            aria-label="Toggle theme"
            @click="colorMode.preference = isDark ? 'light' : 'dark'"
          />
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-5">
      <!-- HERO -->
      <section class="grid md:grid-cols-[1.25fr_1fr] gap-12 lg:gap-16 pt-14 md:pt-24 pb-20 items-center">
        <div>
          <p class="label rise" style="--i: 0">// {{ profile.title }}</p>
          <h1
            class="font-display text-[clamp(3.4rem,8vw,7rem)] leading-[0.9] tracking-tight mt-4 rise"
            style="--i: 1"
          >
            {{ firstName }}<br />
            <em class="text-[var(--signal)]">{{ restName }}</em>
          </h1>
          <p class="mt-8 text-xl md:text-2xl max-w-xl leading-snug rise" style="--i: 2">
            {{ profile.summary_title_prefix }}
            <span class="underline decoration-[var(--signal)] decoration-2 underline-offset-4">{{ profile.summary_title }}</span>
          </p>
          <p class="mt-5 max-w-xl text-[var(--ink-dim)] leading-relaxed rise" style="--i: 3">
            {{ profile.summary }}
          </p>

          <p class="mt-6 flex items-center gap-2 font-mono text-sm rise" style="--i: 4">
            <span class="pulse"></span>
            Available for freelance DevOps &amp; cloud projects
          </p>

          <div class="mt-5 flex flex-wrap items-center gap-3 rise" style="--i: 4">
            <a
              :href="mailHref"
              class="font-mono text-sm px-4 py-2.5 bg-[var(--signal)] text-[var(--signal-ink)] font-bold hover:translate-x-0.5 hover:-translate-y-0.5 transition"
            >
              say hello →
            </a>
            <a
              v-for="s in socials.slice(0, 2)"
              :key="s.name"
              :href="s.href"
              target="_blank"
              class="font-mono text-sm px-4 py-2.5 border rule hover:border-[var(--signal)] hover:text-[var(--signal)] transition flex items-center gap-2"
            >
              <UIcon :name="s.icon" /> {{ s.name }}
            </a>
          </div>
        </div>

        <!-- status panel: balances the hero -->
        <aside class="rise border rule bg-[var(--bg)] shadow-[10px_10px_0_var(--signal)]" style="--i: 3">
          <div class="flex items-center justify-between border-b rule px-4 py-2.5 label">
            <span>status.yml</span>
            <span class="flex items-center gap-2"><span class="pulse"></span> live</span>
          </div>
          <dl class="p-5 md:p-6 font-mono text-sm leading-7">
            <div v-for="row in statusRows" :key="row.k" class="grid grid-cols-[8rem_1fr] gap-3">
              <dt class="text-[var(--signal)]">{{ row.k }}:</dt>
              <dd>{{ row.v }}</dd>
            </div>
            <div class="mt-3 text-[var(--ink-dim)]">
              <span class="text-[var(--signal)]">$</span> kubectl get vikri<span class="cursor">▌</span>
            </div>
          </dl>
        </aside>
      </section>
    </main>

    <!-- TICKER -->
    <div class="overflow-hidden border-b rule py-3 font-mono text-sm text-[var(--ink-dim)]" aria-hidden="true">
      <div class="ticker">
        <span v-for="(t, i) in tickerItems" :key="i" class="px-5 whitespace-nowrap">
          <span class="text-[var(--signal)]">■</span> {{ t }}
        </span>
      </div>
    </div>

    <main class="mx-auto max-w-6xl px-5">
      <!-- SKILLS -->
      <section id="skills" class="pt-24 scroll-mt-12">
        <div class="flex items-baseline gap-4 mb-10">
          <span class="label text-[var(--signal)]">01.</span>
          <h2 class="font-display text-5xl md:text-6xl">The stack</h2>
        </div>
        <div class="grid md:grid-cols-3 gap-px bg-[var(--line)] border rule">
          <div
            v-for="group in skills"
            :key="group.title"
            class="bg-[var(--bg)] p-6 hover:bg-[var(--bg-raised)] transition-colors"
          >
            <div class="label mb-4">{{ group.title }}</div>
            <div class="flex flex-wrap gap-2">
              <span v-for="item in group.item" :key="item" class="chip">{{ clean(item) }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- PORTFOLIO -->
      <section id="portfolio" class="pt-24 scroll-mt-12">
        <div class="flex items-baseline gap-4 mb-4">
          <span class="label text-[var(--signal)]">02.</span>
          <h2 class="font-display text-5xl md:text-6xl">Portfolio</h2>
          <a
            href="https://github.com/vikriusman/curated"
            target="_blank"
            rel="noopener"
            class="label hidden sm:inline hover:text-[var(--signal)]"
          >github.com/vikriusman/curated ↗</a>
        </div>
        <p class="max-w-2xl text-[var(--ink-dim)] leading-relaxed mb-10">
          Labs are runnable, rebuilt from scratch around dummy apps, with recorded proof.
          Field notes are anonymized write-ups of real production work that cannot be reproduced publicly.
          Playbooks are how I set things up by default.
        </p>

        <div>
          <a
            v-for="item in portfolio"
            :key="item.kind + item.code"
            :href="item.link"
            target="_blank"
            rel="noopener"
            class="row w-full text-left grid grid-cols-[1fr_auto] md:grid-cols-[8rem_1fr_1.2fr_auto] gap-4 md:gap-6 items-start p-4 md:px-4 md:py-6"
          >
            <div class="hidden md:block">
              <div class="label text-[var(--signal)]">{{ item.kind }}</div>
              <div class="font-mono text-sm text-[var(--ink-dim)] mt-1">{{ item.code }}</div>
            </div>
            <div>
              <div class="label text-[var(--signal)] md:hidden mb-1">{{ item.kind }} {{ item.code }}</div>
              <div class="font-display text-2xl md:text-3xl leading-tight">{{ item.title }}</div>
              <p class="mt-2 text-sm text-[var(--ink-dim)] leading-relaxed">{{ item.summary }}</p>
            </div>
            <div class="hidden md:block">
              <div class="flex flex-wrap gap-1.5">
                <span v-for="t in item.stack" :key="t" class="chip">{{ t }}</span>
              </div>
              <p class="mt-3 text-sm text-[var(--ink-dim)]">
                <span class="text-[var(--signal)] font-mono">↳</span> {{ item.proof }}
              </p>
            </div>
            <UIcon name="i-heroicons-arrow-up-right" class="row-arrow text-2xl" />
          </a>
        </div>
      </section>

      <!-- CERTS -->
      <section id="certs" class="pt-24 scroll-mt-12">
        <div class="flex items-baseline gap-4 mb-10">
          <span class="label text-[var(--signal)]">03.</span>
          <h2 class="font-display text-5xl md:text-6xl">Certifications</h2>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <a
            v-for="cert in certs"
            :key="cert.title"
            :href="cert.verification"
            target="_blank"
            class="cert group border rule bg-[var(--bg)] hover:border-[var(--signal)] transition-colors"
          >
            <div class="aspect-[3/2] overflow-hidden border-b rule">
              <img
                :src="cert.icon[0]"
                :alt="cert.title"
                class="thumb w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div class="p-4">
              <div class="label text-[var(--signal)]">{{ cert.sub_title }}</div>
              <div class="mt-1 text-sm leading-snug">{{ cert.title }}</div>
              <div class="label mt-3 group-hover:text-[var(--signal)]">verify ↗</div>
            </div>
          </a>
        </div>
      </section>
    </main>

    <!-- FOOTER / CONTACT -->
    <footer class="mt-28 border-t rule bg-[var(--bg-raised)]">
      <div class="mx-auto max-w-6xl px-5 py-16">
        <p class="label">// open to work</p>
        <a
          :href="mailHref"
          class="block font-display text-[clamp(2.5rem,8vw,6.5rem)] leading-none mt-4 hover:text-[var(--signal)] transition-colors break-all"
        >
          Let's build something<span class="text-[var(--signal)]">.</span>
        </a>
        <p class="mt-6 max-w-lg text-[var(--ink-dim)]">
          Currently accepting freelance projects and open to job opportunities as {{ profile.title }}.
        </p>

        <div class="mt-10 flex flex-wrap gap-3">
          <a
            v-for="s in socials"
            :key="s.name"
            :href="s.href"
            target="_blank"
            class="font-mono text-sm px-4 py-2.5 border rule hover:border-[var(--signal)] hover:text-[var(--signal)] transition flex items-center gap-2"
          >
            <UIcon :name="s.icon" /> {{ s.name }}
          </a>
        </div>

        <div class="mt-14 pt-6 border-t rule flex flex-col md:flex-row gap-3 justify-between label !normal-case !tracking-normal">
          <span>&copy; {{ year }} {{ profile.name }}</span>
          <span class="max-w-xl md:text-right italic">
            Infrastructure estimates are approximate and assumption-based in the absence of product incubation.
            Exact requirements depend on finalized product scope, tech stack, and user targets.
          </span>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup lang="ts">

import skills from "~/data/skills.yml";
import portfolio from "~/data/portfolio.yml";
import certs from "~/data/certification.yml";
import profile from "~/data/profile.yml";

const year = new Date().getFullYear();

const groupItems = (title: string) =>
  (skills.find((g: any) => g.title === title)?.item ?? []).map((i: string) => i.replace(/,$/, ""));

const statusRows = [
  { k: "role", v: profile.title },
  { k: "focus", v: "CI/CD · Reliability" },
  { k: "cloud", v: groupItems("Cloud Provider").join(" · ") },
  { k: "orchestration", v: "Kubernetes" },
  { k: "pipelines", v: groupItems("DevOps Tools").filter((t: string) => t !== "Kubernetes").slice(0, 3).join(" · ") },
  { k: "availability", v: "open to work" },
];

const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");

const [firstName, ...rest] = profile.name.split(" ");
const restName = rest.join(" ");

const iconFor: Record<string, string> = {
  Gmail: "i-simple-icons-gmail",
  LinkedIn: "i-simple-icons-linkedin",
  GitHub: "i-simple-icons-github",
};

const socials = profile.socials.map((s: any) => ({
  name: s.name,
  icon: iconFor[s.name] ?? "i-heroicons-link",
  href: containsHttps(s.link) ? s.link : "mailto:" + s.link,
}));
const mailHref = socials.find((s: any) => s.name === "Gmail")?.href ?? "#";

const clean = (s: string) => s.replace(/,$/, "");
const tickerItems = [
  ...skills.flatMap((g: any) => g.item.map(clean)),
  ...skills.flatMap((g: any) => g.item.map(clean)),
];

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

const siteUrl = "https://vikriusman.github.io";
const seoTitle = `${profile.name} | Freelance DevOps & Cloud Engineer`;
const seoDescription =
  "Freelance DevOps & cloud engineer, open to work. 5+ years in cloud, CI/CD, Kubernetes, and reliability across telecom, AI, and public sector.";

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogUrl: siteUrl + "/",
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
});
useHead({ link: [{ rel: "canonical", href: siteUrl + "/" }] });

function containsHttps(text: string | string[]) {
  return text.includes("https");
}
</script>
