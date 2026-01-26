const mineflayer = require('mineflayer')

const bot = mineflayer.createBot({
  host: 'localhost',
  port: 25565,
  username: 'LocalConTester',
  version: '1.21.6',
  hideErrors: false
})


bot.on('chat', (username, message) => {
  if (username === bot.username) return

  if (message === 'hello') {
    bot.chat(`Hello ${username}!`)
  }
})

bot.on('kicked', reason => {
  console.log('Kicked:', reason)
})

bot.on('error', err => {
  console.log('Error:', err)
})