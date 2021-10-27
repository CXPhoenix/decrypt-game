const { resolve } = require('path')
const { defineConfig } = require('vite')



module.exports = defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        "decrypt-game-app": resolve(__dirname, 'decrypt-game-app.html'),
        "random-machine": resolve(__dirname, 'random-machine.html')
      }
    }
  }
})