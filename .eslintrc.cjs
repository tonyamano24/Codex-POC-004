module.exports = {
  extends: ['@nuxtjs/eslint-config-typescript'],
  parserOptions: {
    project: ['./tsconfig.eslint.json']
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: ['./tsconfig.eslint.json']
      }
    }
  }
}
