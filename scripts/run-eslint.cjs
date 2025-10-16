#!/usr/bin/env node

const { existsSync } = require('node:fs')
const { resolve } = require('node:path')
const { spawn, spawnSync } = require('node:child_process')
const { exit } = require('node:process')

const nuxtTsconfigPath = resolve(__dirname, '../.nuxt/tsconfig.json')

if (!existsSync(nuxtTsconfigPath)) {
  const npxCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx'
  const prepare = spawnSync(npxCommand, ['nuxi', 'prepare'], {
    stdio: 'inherit',
    env: process.env
  })

  if (prepare.status !== 0) {
    exit(prepare.status ?? 1)
  }
}

const child = spawn(process.execPath, [
  require.resolve('eslint/bin/eslint.js'),
  '--config',
  '.eslintrc.cjs',
  '.'
], {
  stdio: 'inherit',
  env: {
    ...process.env,
    ESLINT_USE_FLAT_CONFIG: 'false'
  }
})

child.on('exit', code => {
  exit(code)
})
