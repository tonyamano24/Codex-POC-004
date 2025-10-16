<template>
  <section class="relative flex flex-col gap-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <span class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500/20 text-2xl text-sky-300 shadow-inner shadow-sky-500/40">
          🐥
        </span>
        <div>
          <h2 class="text-2xl font-semibold text-white sm:text-3xl">Arcade Mode</h2>
          <p class="text-sm text-slate-300/80">
            Tap anywhere inside the arena or press the space bar to flap your wings.
          </p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <StatCard label="Score" :value="score" />
        <StatCard label="Best" :value="bestScore" variant="emerald" />
      </div>
    </div>

    <div
      ref="gameBoard"
      class="relative isolate flex aspect-[3/4] w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-700/80 bg-gradient-to-b from-sky-500 via-sky-600 to-sky-700 shadow-2xl ring-1 ring-sky-400/40"
      tabindex="0"
      @click="handleFlap"
      @keydown.space.prevent="handleFlap"
    >
      <div class="absolute inset-0 opacity-60">
        <div class="absolute inset-0 bg-[url('https://raw.githubusercontent.com/tailwindlabs/tailwindcss/master/.github/images/clouds.svg')] bg-cover bg-center mix-blend-screen"></div>
      </div>

      <div class="pointer-events-none absolute inset-0">
        <div class="absolute left-0 right-0 top-0 flex h-16 justify-between px-6">
          <div class="h-full w-28 animate-cloud-drift rounded-full bg-white/10 blur-xl"></div>
          <div class="h-full w-20 animate-cloud-drift rounded-full bg-white/10 blur-xl"></div>
        </div>
      </div>

      <transition-group name="pipe" tag="div" class="absolute inset-0">
        <div
          v-for="pipe in pipes"
          :key="pipe.id"
          class="absolute flex flex-col items-center"
          :style="{ transform: `translateX(${pipe.x}px)` }"
        >
          <div
            class="h-full w-16 rounded-b-3xl bg-gradient-to-b from-emerald-200 via-emerald-400 to-emerald-500 shadow-[0_16px_40px_-15px_rgba(16,185,129,0.6)]"
            :style="{ height: `${pipe.gapTop}px` }"
          ></div>
          <div class="h-28 w-20 -mt-6 rounded-3xl bg-gradient-to-b from-emerald-100 to-emerald-400 shadow-lg shadow-emerald-500/40"></div>
          <div
            class="h-full w-16 rounded-t-3xl bg-gradient-to-b from-emerald-500 via-emerald-400 to-emerald-200 shadow-[0_-16px_40px_-15px_rgba(16,185,129,0.6)]"
            :style="{ height: `${boardHeight - pipe.gapBottom}px` }"
          ></div>
        </div>
      </transition-group>

      <div
        class="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3 text-center"
        v-if="showBanner"
      >
        <div class="rounded-full bg-black/40 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200">
          {{ bannerSubtitle }}
        </div>
        <div class="rounded-3xl bg-black/60 px-6 py-4 text-3xl font-bold text-white shadow-xl shadow-black/40">
          {{ bannerTitle }}
        </div>
        <button
          class="inline-flex items-center gap-2 rounded-full bg-sky-500/90 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-700/40 transition hover:scale-[1.02] hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-200"
          @click.stop="startGame"
        >
          <IconPlay class="h-5 w-5" />
          {{ actionLabel }}
        </button>
      </div>

      <div
        class="absolute bottom-28 left-8 flex items-center gap-3 rounded-2xl bg-black/35 px-4 py-3 text-sm font-medium text-slate-100 shadow-lg shadow-black/40"
        v-if="isRunning"
      >
        <IconLightning class="h-4 w-4 text-amber-300" />
        <span class="tracking-wider uppercase text-slate-200/90">Keep tapping to stay aloft!</span>
      </div>

      <div class="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-emerald-700 via-emerald-600 to-emerald-500">
        <div class="h-1/2 bg-[url('https://raw.githubusercontent.com/tailwindlabs/tailwindcss/master/.github/images/grass.png')] bg-repeat-x opacity-80"></div>
      </div>

      <div
        class="absolute flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-yellow-200 via-yellow-300 to-amber-400 shadow-2xl shadow-yellow-500/40 transition-transform"
        :style="{ transform: `translate(${birdX}px, ${birdY}px) rotate(${birdRotation}deg)` }"
      >
        <div class="relative">
          <div class="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-100 via-yellow-300 to-amber-500 shadow-inner shadow-amber-500/30"></div>
          <div class="absolute left-1/2 top-1/3 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1">
            <span class="h-3 w-3 rounded-full bg-white"></span>
            <span class="h-1.5 w-1.5 rounded-full bg-slate-800"></span>
          </div>
          <div class="absolute -right-3 top-1/2 h-3 w-6 -translate-y-1/2 rounded-r-full bg-gradient-to-r from-orange-300 via-orange-400 to-rose-400"></div>
          <div class="absolute -left-3 top-1/2 h-10 w-6 -translate-y-1/2 -rotate-12 animate-float rounded-3xl bg-gradient-to-br from-sky-200 via-sky-300 to-sky-400 shadow-inner shadow-sky-400/40"></div>
        </div>
      </div>
    </div>

    <div class="flex flex-col items-center gap-4 rounded-3xl border border-slate-800/80 bg-slate-900/70 p-6 text-sm text-slate-300 shadow-lg shadow-black/30 sm:flex-row sm:justify-between">
      <div class="flex items-center gap-3">
        <IconSparkle class="h-5 w-5 text-sky-300" />
        <span>
          <strong class="font-semibold text-white">Pro tip:</strong> Save your bursts for the moment right before a pipe!
        </span>
      </div>
      <div class="flex flex-wrap justify-center gap-3">
        <button
          class="inline-flex items-center gap-2 rounded-full border border-sky-400/50 bg-sky-500/20 px-4 py-2 font-semibold text-sky-200 shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5 hover:bg-sky-500/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-200"
          @click="startGame"
        >
          <IconRotate class="h-4 w-4" />
          Restart
        </button>
        <button
          class="inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-800/60 px-4 py-2 font-medium text-slate-200 transition hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-100"
          @click="pauseGame"
        >
          <IconPause class="h-4 w-4" />
          {{ isRunning ? 'Pause' : 'Resume' }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, onBeforeUnmount, onMounted, reactive, ref } from 'vue'

const GRAVITY = 0.35
const FLAP_VELOCITY = -6.5
const PIPE_SPACING = 230
const PIPE_SPEED = 2.6
const GAP_SIZE = 180
const BOARD_WIDTH = 640
const BOARD_HEIGHT = 800

interface PipePair {
  id: number
  x: number
  gapTop: number
  gapBottom: number
  scored: boolean
}

const state = reactive({
  birdY: BOARD_HEIGHT / 2,
  velocity: 0,
  pipes: [] as PipePair[],
  score: 0,
  bestScore: 0,
  running: false,
  started: false,
  gameOver: false
})

const gameBoard = ref<HTMLDivElement | null>(null)
let animationFrame: number | null = null
let lastTimestamp = 0
let pipeId = 0

const birdX = BOARD_WIDTH / 3
const boardHeight = BOARD_HEIGHT

const birdY = computed(() => state.birdY)
const birdRotation = computed(() => Math.max(Math.min(state.velocity * 4, 40), -40))
const pipes = computed(() => state.pipes)
const score = computed(() => state.score)
const bestScore = computed(() => state.bestScore)
const isRunning = computed(() => state.running)
const showBanner = computed(() => !state.started || state.gameOver)
const bannerTitle = computed(() => (state.gameOver ? 'Game Over' : 'Ready?'))
const bannerSubtitle = computed(() =>
  state.gameOver ? 'Tap to retry and beat your high score!' : state.started ? 'You can do this!' : 'Tap to Begin'
)
const actionLabel = computed(() => (state.started ? 'Try Again' : 'Start'))

function loadBestScore() {
  if (process.client) {
    const stored = window.localStorage.getItem('flappy-best-score')
    if (stored) {
      state.bestScore = Number(stored)
    }
  }
}

function persistBestScore() {
  if (process.client) {
    window.localStorage.setItem('flappy-best-score', String(state.bestScore))
  }
}

function resetGame() {
  state.birdY = BOARD_HEIGHT / 2
  state.velocity = 0
  state.pipes = []
  state.score = 0
  state.gameOver = false
  state.started = false
  state.running = false
  lastTimestamp = 0
  pipeId = 0
}

function spawnPipe() {
  const gapCenter = 200 + Math.random() * (BOARD_HEIGHT - 400)
  const gapTop = gapCenter - GAP_SIZE / 2
  const gapBottom = gapCenter + GAP_SIZE / 2
  state.pipes.push({
    id: pipeId++,
    x: BOARD_WIDTH + 80,
    gapTop,
    gapBottom,
    scored: false
  })
}

function updateGame(delta: number) {
  state.velocity += GRAVITY * delta
  state.birdY += state.velocity * delta * 3

  if (state.birdY < 40) {
    state.birdY = 40
    state.velocity = 0
  }
  if (state.birdY > BOARD_HEIGHT - 140) {
    endGame()
    return
  }

  state.pipes.forEach((pipe) => {
    pipe.x -= PIPE_SPEED * delta * 16
  })

  if (state.pipes.length === 0 || BOARD_WIDTH - (state.pipes[state.pipes.length - 1].x + 80) > PIPE_SPACING) {
    spawnPipe()
  }

  state.pipes = state.pipes.filter((pipe) => pipe.x > -160)

  state.pipes.forEach((pipe) => {
    const pipeLeft = pipe.x + BOARD_WIDTH / 2
    const pipeRight = pipeLeft + 64
    const birdLeft = birdX - 24
    const birdRight = birdX + 24
    const birdTop = state.birdY - 24
    const birdBottom = state.birdY + 24

    const hitHorizontal = birdRight > pipeLeft && birdLeft < pipeRight
    const hitTop = birdTop < pipe.gapTop
    const hitBottom = birdBottom > pipe.gapBottom

    if (hitHorizontal && (hitTop || hitBottom)) {
      endGame()
    }

    if (!pipe.scored && pipeLeft + 32 < birdLeft) {
      pipe.scored = true
      state.score += 1
      if (state.score > state.bestScore) {
        state.bestScore = state.score
        persistBestScore()
      }
    }
  })
}

function loop(timestamp: number) {
  if (!state.running) {
    animationFrame = null
    return
  }

  if (!lastTimestamp) {
    lastTimestamp = timestamp
  }

  const delta = (timestamp - lastTimestamp) / 16.7
  lastTimestamp = timestamp

  updateGame(delta)

  animationFrame = window.requestAnimationFrame(loop)
}

function startGame() {
  if (state.running) return

  if (state.gameOver || !state.started) {
    resetGame()
    state.started = true
  }

  state.running = true
  if (animationFrame === null) {
    animationFrame = window.requestAnimationFrame(loop)
  }
}

function pauseGame() {
  if (!state.started) return
  state.running = !state.running
  if (state.running) {
    lastTimestamp = 0
    if (animationFrame === null) {
      animationFrame = window.requestAnimationFrame(loop)
    }
  }
}

function endGame() {
  state.running = false
  state.gameOver = true
  if (animationFrame !== null) {
    window.cancelAnimationFrame(animationFrame)
    animationFrame = null
  }
}

function handleFlap() {
  if (!state.started) {
    startGame()
  }
  if (!state.running) return
  state.velocity = FLAP_VELOCITY
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.code === 'Space') {
    event.preventDefault()
    handleFlap()
  }
  if (event.code === 'Enter') {
    event.preventDefault()
    if (state.gameOver) {
      startGame()
    } else {
      pauseGame()
    }
  }
}

onMounted(() => {
  loadBestScore()
  resetGame()

  const el = gameBoard.value
  if (el) {
    el.focus({ preventScroll: true })
  }

  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (animationFrame !== null) {
    window.cancelAnimationFrame(animationFrame)
  }
})

const IconPlay = defineComponent({
  name: 'IconPlay',
  setup() {
    return () =>
      h('svg', { viewBox: '0 0 20 20', fill: 'currentColor', 'aria-hidden': 'true' }, [
        h('path', { d: 'M4.5 3.3a1 1 0 0 1 1.53-.85l9 5.7a1 1 0 0 1 0 1.7l-9 5.7A1 1 0 0 1 4 14.7V3.3z' })
      ])
  }
})

const IconRotate = defineComponent({
  name: 'IconRotate',
  setup() {
    return () =>
      h('svg', { viewBox: '0 0 20 20', fill: 'currentColor', 'aria-hidden': 'true' }, [
        h('path', {
          'fill-rule': 'evenodd',
          d: 'M4.083 9a6 6 0 1 1 10.53 3.53l.97.97a.75.75 0 0 1-1.06 1.06l-2.25-2.25a.75.75 0 0 1 0-1.06l2.25-2.25a.75.75 0 1 1 1.06 1.06l-.59.59A7.5 7.5 0 1 0 3.25 9a.75.75 0 0 1 1.5 0Z',
          'clip-rule': 'evenodd'
        })
      ])
  }
})

const IconPause = defineComponent({
  name: 'IconPause',
  setup() {
    return () =>
      h('svg', { viewBox: '0 0 20 20', fill: 'currentColor', 'aria-hidden': 'true' }, [
        h('path', { d: 'M6.75 4A.75.75 0 0 1 7.5 4.75v10.5a.75.75 0 0 1-1.5 0V4.75A.75.75 0 0 1 6.75 4Zm6.5 0a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-1.5 0V4.75a.75.75 0 0 1 .75-.75Z' })
      ])
  }
})

const IconLightning = defineComponent({
  name: 'IconLightning',
  setup() {
    return () =>
      h('svg', { viewBox: '0 0 20 20', fill: 'currentColor', 'aria-hidden': 'true' }, [
        h('path', {
          d: 'M11.3 1.046a.75.75 0 0 1 .616.429l5.25 11a.75.75 0 0 1-1.348.665L13.69 9.75l-2.002 9.008a.75.75 0 0 1-1.43.06l-1.85-5.55-3.193 2.873a.75.75 0 0 1-1.243-.79l2.25-6.5a.75.75 0 0 1 .225-.322l7-6a.75.75 0 0 1 .853-.094Z'
        })
      ])
  }
})

const IconSparkle = defineComponent({
  name: 'IconSparkle',
  setup() {
    return () =>
      h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.6', 'aria-hidden': 'true' }, [
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          d: 'm12 3 1.6 4.4 4.4 1.6-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Zm-6 12 1.2 3.2 3.2 1.2-3.2 1.2L6 25l-1.2-3.2L1.6 20l3.2-1.2L6 15Zm12 0 1.2 3.2 3.2 1.2-3.2 1.2L18 25l-1.2-3.2-3.2 1.2 3.2-1.2L18 15Z'
        })
      ])
  }
})

const StatCard = defineComponent({
  name: 'StatCard',
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    variant: {
      type: String,
      default: 'sky'
    }
  },
  setup(props) {
    const colorClasses = computed(() =>
      props.variant === 'emerald'
        ? 'from-emerald-400/30 via-emerald-500/40 to-emerald-400/20 text-emerald-100 shadow-emerald-500/20'
        : 'from-sky-400/30 via-sky-500/40 to-sky-400/20 text-sky-100 shadow-sky-500/20'
    )

    return () =>
      h(
        'div',
        {
          class: `relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br px-6 py-4 text-left shadow-lg backdrop-blur-xl ${colorClasses.value}`
        },
        [
          h(
            'p',
            { class: 'text-xs font-semibold uppercase tracking-[0.3em] text-white/70' },
            props.label
          ),
          h('p', { class: 'mt-2 text-3xl font-bold tabular-nums' }, props.value.toString().padStart(2, '0'))
        ]
      )
  }
})
</script>

<style scoped>
.pipe-enter-active,
.pipe-leave-active {
  transition: opacity 0.3s ease;
}
.pipe-enter-from,
.pipe-leave-to {
  opacity: 0;
}
</style>
