<template>
  <main class="mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-4 py-16 lg:px-8">
    <section class="flex flex-col items-center gap-6 text-center">
      <p class="rounded-full bg-slate-800/70 px-5 py-2 text-sm font-semibold uppercase tracking-widest text-sky-300 shadow-lg shadow-sky-500/20 ring-1 ring-sky-500/40">
        Powered by Nuxt 3 & Tailwind CSS
      </p>
      <h1 class="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
        Flappy Bird Reimagined
      </h1>
      <p class="max-w-3xl text-lg text-slate-300">
        Take to the skies with a buttery-smooth Nuxt experience. Tap or press the space bar to keep your bird aloft, thread the needle through endless pipe formations, and chase a new personal best.
      </p>
    </section>

    <FlappyGame />
  </main>
</template>

<script setup lang="ts">
useHead({
  title: 'Flappy Bird Reimagined',
  meta: [
    {
      name: 'description',
      content:
        'A fully responsive Flappy Bird experience crafted with Nuxt 3 and Tailwind CSS.'
    }
  ]
})
</script>
