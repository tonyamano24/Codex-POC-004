<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const title = runtimeConfig.public.gameTitle

const gravity = 0.35
const jumpForce = -6
const pipeSpacing = 220
const pipeWidth = 80
const gameHeight = 520
const gameWidth = 640

interface PipeSegment {
  id: number
  x: number
  gapY: number
  gapHeight: number
  scored?: boolean
}

const isRunning = ref(false)
const isGameOver = ref(false)
const score = ref(0)
const bestScore = ref(0)
const birdY = ref(gameHeight / 2)
const velocity = ref(0)
const pipes = ref<PipeSegment[]>([])
let animationId: number | null = null
let pipeCounter = 0

const resetGame = () => {
  isRunning.value = false
  isGameOver.value = false
  score.value = 0
  velocity.value = 0
  birdY.value = gameHeight / 2
  pipes.value = []
  pipeCounter = 0
  spawnPipe()
}

const startGame = () => {
  if (isRunning.value) {
    return
  }
  isRunning.value = true
  isGameOver.value = false
  animationId && cancelAnimationFrame(animationId)
  animationId = requestAnimationFrame(update)
}

const endGame = () => {
  isRunning.value = false
  isGameOver.value = true
  animationId && cancelAnimationFrame(animationId)
  bestScore.value = Math.max(bestScore.value, score.value)
}

const flap = () => {
  if (!isRunning.value) {
    startGame()
  }
  velocity.value = jumpForce
}

const spawnPipe = () => {
  const gapHeight = 160
  const gapY = Math.random() * (gameHeight - gapHeight - 140) + 70
  pipes.value.push({
    id: pipeCounter++,
    x: gameWidth + pipeWidth,
    gapY,
    gapHeight
  })
}

const update = () => {
  if (!isRunning.value) {
    return
  }

  velocity.value += gravity
  birdY.value += velocity.value

  if (birdY.value < 0 || birdY.value > gameHeight - 40) {
    endGame()
    return
  }

  const speed = 2.75
  pipes.value = pipes.value
    .map(pipe => ({ ...pipe, x: pipe.x - speed }))
    .filter(pipe => pipe.x + pipeWidth > 0)

  const lastPipe = pipes.value[pipes.value.length - 1]
  if (!lastPipe || lastPipe.x < gameWidth - pipeSpacing) {
    spawnPipe()
  }

  for (const pipe of pipes.value) {
    const birdTop = birdY.value
    const birdBottom = birdY.value + 40
    const pipeLeft = pipe.x
    const pipeRight = pipe.x + pipeWidth

    if (pipeLeft < 160 && pipeRight > 120) {
      if (birdTop < pipe.gapY || birdBottom > pipe.gapY + pipe.gapHeight) {
        endGame()
        return
      }
    }

    if (!isGameOver.value && pipeRight < 120 && !pipe.scored) {
      score.value += 1
      pipe.scored = true
    }
  }

  animationId = requestAnimationFrame(update)
}

const handlePrimaryCta = () => {
  if (isGameOver.value) {
    resetGame()
    return
  }
  if (isRunning.value) {
    isRunning.value = false
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
  } else {
    startGame()
  }
}

const onKeydown = (event: KeyboardEvent) => {
  if ([' ', 'ArrowUp', 'w', 'W'].includes(event.key)) {
    event.preventDefault()
    flap()
  }
  if (event.key === 'p' || event.key === 'P') {
    event.preventDefault()
    handlePrimaryCta()
  }
  if (event.key === 'r' || event.key === 'R') {
    resetGame()
  }
}

const scoreboardLabel = computed(() =>
  isGameOver.value
    ? `Game over! Press R or tap restart to play again.`
    : 'Press space, W, or tap to flap.'
)

const onGameTap = () => {
  if (isGameOver.value) {
    resetGame()
  } else {
    flap()
  }
}

onMounted(() => {
  resetGame()
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('keydown', onKeydown)
})

const ctaLabel = computed(() => (isRunning.value ? 'Pause' : isGameOver.value ? 'Restart' : 'Start'))
</script>

<template>
  <section
    class="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 md:px-8 lg:px-12"
  >
    <header class="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
      <div class="space-y-2">
        <p class="text-sm font-semibold uppercase tracking-[0.25em] text-brand-400">
          {{ title }}
        </p>
        <h1 class="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
          Glide through neon pipes and chase the high score.
        </h1>
        <p class="max-w-2xl text-base text-slate-300 sm:text-lg">
          Tap, click, or press space to keep the bird in the air. Timing is everything—thread the gap,
          survive the night sky, and share your best run.
        </p>
      </div>
      <div class="card w-full max-w-xs space-y-2 p-6 text-left">
        <p class="text-xs uppercase tracking-wide text-brand-200">Controls</p>
        <ul class="space-y-1 text-sm text-slate-200">
          <li><kbd class="rounded bg-slate-800 px-2 py-1 text-xs text-brand-200">Space</kbd> or tap to flap</li>
          <li><kbd class="rounded bg-slate-800 px-2 py-1 text-xs text-brand-200">R</kbd> to reset</li>
          <li><kbd class="rounded bg-slate-800 px-2 py-1 text-xs text-brand-200">P</kbd> to pause</li>
        </ul>
      </div>
    </header>

    <div class="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <div class="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl shadow-brand-500/20">
        <div
          class="relative aspect-[8/6] w-full cursor-pointer select-none touch-none"
          role="button"
          aria-label="Flappy bird playground"
          @click="onGameTap"
        >
          <div
            class="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/80 to-slate-950"
          />

          <div class="absolute inset-x-10 top-6 flex items-center justify-between text-sm font-semibold text-brand-100">
            <div class="flex items-center gap-3">
              <span class="rounded-full bg-brand-500/20 px-3 py-1 text-brand-100">Score {{ score }}</span>
              <span class="rounded-full bg-white/5 px-3 py-1 text-slate-200">Best {{ bestScore }}</span>
            </div>
            <span
              class="hidden rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-widest text-white/70 sm:inline-flex"
            >
              {{ scoreboardLabel }}
            </span>
          </div>

          <div
            class="absolute left-28 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 shadow-lg shadow-orange-500/40 transition-transform"
            :style="{ transform: `translateY(${birdY - gameHeight / 2}px)` }"
          />

          <transition-group name="pipe" tag="div">
            <div
              v-for="pipe in pipes"
              :key="pipe.id"
              class="absolute top-0 flex h-full flex-col items-center"
              :style="{ transform: `translateX(${pipe.x}px)` }"
            >
              <div
                class="h-[calc(50%-theme(spacing.20))] w-[80px] rounded-b-3xl bg-gradient-to-b from-brand-400 to-brand-600 shadow-pipe"
                :style="{ height: `${pipe.gapY}px` }"
              />
              <div class="h-40 w-[80px]" />
              <div
                class="h-[calc(50%-theme(spacing.20))] w-[80px] rounded-t-3xl bg-gradient-to-t from-brand-400 to-brand-600 shadow-pipe"
                :style="{ height: `${gameHeight - pipe.gapY - pipe.gapHeight}px` }"
              />
            </div>
          </transition-group>

          <div
            v-if="isGameOver"
            class="absolute inset-0 flex items-center justify-center bg-slate-950/70 backdrop-blur"
          >
            <div class="card w-full max-w-sm space-y-4 p-6 text-center">
              <h2 class="text-xl font-semibold text-white">
                Crash! Try again?
              </h2>
              <p class="text-sm text-slate-300">
                You cleared {{ score }} pipes. Beat your best of {{ bestScore }}.
              </p>
              <button
                class="w-full rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-brand-500/50 transition hover:bg-brand-400"
                type="button"
                @click="resetGame"
              >
                Restart run
              </button>
            </div>
          </div>
        </div>
      </div>

      <aside class="card flex flex-col gap-6 p-6">
        <div class="space-y-2">
          <h2 class="text-xl font-semibold text-white">
            How to play
          </h2>
          <p class="text-sm leading-relaxed text-slate-300">
            Stay aloft by timing your flaps. Every pipe you clear scores one point. Colliding with the top or
            bottom of a pipe—or the ground—ends the run.
          </p>
        </div>
        <div class="space-y-4">
          <button
            type="button"
            class="w-full rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-brand-500/40 transition hover:bg-brand-400"
            @click="handlePrimaryCta"
          >
            {{ ctaLabel }}
          </button>
          <button
            type="button"
            class="w-full rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
            @click="flap"
          >
            Tap / flap
          </button>
        </div>
        <p class="text-xs uppercase tracking-wide text-brand-200">
          {{ scoreboardLabel }}
        </p>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.pipe-enter-active,
.pipe-leave-active {
  transition: transform 0.35s ease;
}
.pipe-enter-from {
  transform: translateX(40px);
}
.pipe-leave-to {
  transform: translateX(-40px);
}
</style>
