const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const { GoalFollow } = goals


const bot = mineflayer.createBot({
  host: 'localhost',
  port: 25565,
  username: 'HunterBot'
})

bot.loadPlugin(pathfinder)

bot.once('spawn', () => {
  const mcData = require('minecraft-data')(bot.version)
  const movements = new Movements(bot, mcData)
  movements.allowSprinting = true
  bot.pathfinder.setMovements(movements)
})
bot.on('whisper', (message) => {
  bot.chat(message)
})
bot.on('chat', (username, message) => {
  if (username === bot.username) return
  if (message.toLowerCase() === 'come'){
    if (!bot.players[username].entity) {
      bot.chat("I don't see you")
      return
    }
    bot.pathfinder.setGoal(new GoalFollow(bot.players[username].entity, 1))
  }

  if (message.toLowerCase() === 'hello') {
    bot.chat(`Hey`)
  }

  if (message.toLowerCase() === 'ready'){
    const followinterval = setInterval(() => {
      const target = bot.players[username].entity
      if (!target) return

      bot.pathfinder.setGoal(new GoalFollow(target, 1), true)

      const dist = bot.entity.position.distanceTo(target.position)

      if (dist < 3.2) {
        bot.setControlState('jump', true)
        bot.setControlState('sprint', false)
        bot.setControlState('jump', false)
        setTimeout(() => {
          bot.lookAt(target.position.offset(0, target.height, 0), true)
          bot.attack(target)
        }, 400);     
      }

      if (target.health === 0){
        clearInterval(followinterval)
      }
    }, 600)
  }
})
