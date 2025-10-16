<template>
  <div class="page">
    <div class="hud">
      <div class="score">Score: {{ state.score }}</div>
      <div class="best">Best: {{ state.bestScore }}</div>
    </div>

    <canvas
      ref="canvas"
      class="game-canvas"
      :width="canvasSize.width"
      :height="canvasSize.height"
    />

    <div class="overlay" v-if="!state.isRunning">
      <h1>Nuxty Bird</h1>
      <p v-if="!state.started">Tap, press space, or click to start</p>
      <p v-else>Game over – tap, click, or press space to try again</p>
    </div>

    <footer class="instructions">
      <p>Controls: Space / Click / Tap</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'

interface Pipe {
  x: number
  gapY: number
  passed: boolean
}

const canvas = ref<HTMLCanvasElement | null>(null)
const canvasSize = reactive({ width: 360, height: 600 })
const state = reactive({
  birdY: 0,
  velocity: 0,
  pipes: [] as Pipe[],
  score: 0,
  bestScore: 0,
  isRunning: false,
  started: false
})

const BIRD_X = 80
const BIRD_RADIUS = 16
const GRAVITY = 1800
const JUMP_FORCE = -520
const PIPE_WIDTH = 60
const PIPE_GAP = 150
const PIPE_INTERVAL = 1500
const PIPE_SPEED = 200
const FLOOR_HEIGHT = 80

let frameId: number | null = null
let lastTime: number | null = null
let spawnTimer = 0

const isClient = typeof window !== 'undefined'

const resetGame = () => {
  state.birdY = canvasSize.height / 2
  state.velocity = 0
  state.pipes = []
  state.score = 0
  spawnTimer = 0
  lastTime = null
}

const startGame = () => {
  resetGame()
  state.isRunning = true
  state.started = true
  jump()
  frameId = requestAnimationFrame(loop)
}

const stopGame = () => {
  state.isRunning = false
  if (frameId) {
    cancelAnimationFrame(frameId)
    frameId = null
  }
  if (isClient) {
    state.bestScore = Math.max(state.bestScore, state.score)
    localStorage.setItem('nuxty-bird-best', String(state.bestScore))
  }
}

const jump = () => {
  state.velocity = JUMP_FORCE
}

const handleInput = () => {
  if (!state.started) {
    startGame()
    return
  }
  if (!state.isRunning) {
    startGame()
    return
  }
  jump()
}

const update = (deltaMs: number) => {
  const deltaSeconds = deltaMs / 1000
  state.velocity += GRAVITY * deltaSeconds
  state.birdY += state.velocity * deltaSeconds

  spawnTimer += deltaMs
  if (spawnTimer >= PIPE_INTERVAL) {
    spawnTimer = 0
    const gapMargin = 60
    const gapY =
      Math.random() * (canvasSize.height - FLOOR_HEIGHT - PIPE_GAP - gapMargin * 2) + gapMargin
    state.pipes.push({ x: canvasSize.width + PIPE_WIDTH, gapY, passed: false })
  }

  state.pipes.forEach((pipe) => {
    pipe.x -= PIPE_SPEED * deltaSeconds
    if (!pipe.passed && pipe.x + PIPE_WIDTH < BIRD_X - BIRD_RADIUS) {
      pipe.passed = true
      state.score += 1
    }
  })

  state.pipes = state.pipes.filter((pipe) => pipe.x + PIPE_WIDTH > 0)

  const groundY = canvasSize.height - FLOOR_HEIGHT
  if (state.birdY + BIRD_RADIUS > groundY) {
    state.birdY = groundY - BIRD_RADIUS
    stopGame()
    return
  }
  if (state.birdY - BIRD_RADIUS < 0) {
    state.birdY = BIRD_RADIUS
    state.velocity = 0
  }

  for (const pipe of state.pipes) {
    if (BIRD_X + BIRD_RADIUS > pipe.x && BIRD_X - BIRD_RADIUS < pipe.x + PIPE_WIDTH) {
      const topEnd = pipe.gapY
      const bottomStart = pipe.gapY + PIPE_GAP
      if (state.birdY - BIRD_RADIUS < topEnd || state.birdY + BIRD_RADIUS > bottomStart) {
        stopGame()
        return
      }
    }
  }
}

const draw = (ctx: CanvasRenderingContext2D) => {
  ctx.clearRect(0, 0, canvasSize.width, canvasSize.height)

  const gradient = ctx.createLinearGradient(0, 0, 0, canvasSize.height)
  gradient.addColorStop(0, '#70c5ce')
  gradient.addColorStop(1, '#b2dcee')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvasSize.width, canvasSize.height)

  ctx.fillStyle = '#2ecc71'
  ctx.fillRect(0, canvasSize.height - FLOOR_HEIGHT, canvasSize.width, FLOOR_HEIGHT)

  ctx.fillStyle = '#2ecc71'
  ctx.strokeStyle = '#27ae60'
  ctx.lineWidth = 4
  state.pipes.forEach((pipe) => {
    ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.gapY)
    ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, pipe.gapY)

    const lowerHeight = canvasSize.height - FLOOR_HEIGHT - (pipe.gapY + PIPE_GAP)
    ctx.fillRect(pipe.x, pipe.gapY + PIPE_GAP, PIPE_WIDTH, lowerHeight)
    ctx.strokeRect(pipe.x, pipe.gapY + PIPE_GAP, PIPE_WIDTH, lowerHeight)
  })

  ctx.save()
  ctx.translate(BIRD_X, state.birdY)
  ctx.fillStyle = '#f1c40f'
  ctx.beginPath()
  ctx.arc(0, 0, BIRD_RADIUS, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#e67e22'
  ctx.beginPath()
  ctx.moveTo(BIRD_RADIUS, -6)
  ctx.lineTo(BIRD_RADIUS + 10, 0)
  ctx.lineTo(BIRD_RADIUS, 6)
  ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.arc(6, -6, 6, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#2c3e50'
  ctx.beginPath()
  ctx.arc(8, -6, 2, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
  ctx.font = 'bold 28px "Nunito", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(String(state.score), canvasSize.width / 2, 60)
}

const loop = (timestamp: number) => {
  if (!state.isRunning) {
    return
  }
  if (!canvas.value) {
    return
  }

  const ctx = canvas.value.getContext('2d')
  if (!ctx) {
    return
  }

  if (!lastTime) {
    lastTime = timestamp
  }
  const deltaMs = timestamp - lastTime
  lastTime = timestamp

  update(deltaMs)
  draw(ctx)

  frameId = requestAnimationFrame(loop)
}

const resizeCanvas = () => {
  if (!isClient) {
    return
  }
  const maxWidth = Math.min(window.innerWidth - 32, 420)
  const width = Math.max(320, maxWidth)
  const height = width * (600 / 360)
  canvasSize.width = Math.round(width)
  canvasSize.height = Math.round(height)
  if (!state.isRunning && canvas.value) {
    const ctx = canvas.value.getContext('2d')
    if (ctx) {
      draw(ctx)
    }
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.code === 'Space' || event.code === 'ArrowUp') {
    event.preventDefault()
    handleInput()
  }
}

const handlePointerDown = () => {
  handleInput()
}

onMounted(() => {
  if (!isClient) {
    return
  }
  const storedBest = window.localStorage.getItem('nuxty-bird-best')
  if (storedBest) {
    state.bestScore = Number.parseInt(storedBest) || 0
  }
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('pointerdown', handlePointerDown)

  // Draw initial frame
  nextTick(() => {
    if (canvas.value) {
      const ctx = canvas.value.getContext('2d')
      if (ctx) {
        draw(ctx)
      }
    }
  })
})

onBeforeUnmount(() => {
  if (frameId) {
    cancelAnimationFrame(frameId)
  }
  if (isClient) {
    window.removeEventListener('resize', resizeCanvas)
    window.removeEventListener('pointerdown', handlePointerDown)
    window.removeEventListener('keydown', handleKeyDown)
  }
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
  color: #fff;
  padding: 1.5rem 1rem 2rem;
  gap: 1rem;
  position: relative;
  overflow: hidden;
}

.hud {
  display: flex;
  gap: 1.25rem;
  font-family: 'Nunito', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.game-canvas {
  background: #87ceeb;
  border-radius: 1rem;
  border: 4px solid rgba(255, 255, 255, 0.35);
  max-width: 100%;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.35);
}

.overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: rgba(15, 32, 39, 0.68);
  padding: 2rem 1.5rem;
  gap: 0.5rem;
}

.overlay h1 {
  font-size: clamp(2.5rem, 7vw, 3.5rem);
  margin: 0;
}

.instructions {
  font-family: 'Nunito', sans-serif;
  opacity: 0.8;
  font-size: 0.9rem;
}
</style>
