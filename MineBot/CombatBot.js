const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const { GoalFollow } = goals

const TARGET = 'Corezsl'

const bot = mineflayer.createBot({
  host: 'localhost',
  port: 63844,
  username: 'HunterBot'
})

bot.loadPlugin(pathfinder)

bot.once('spawn', () => {
  const mcData = require('minecraft-data')(bot.version)
  const movements = new Movements(bot, mcData)
  movements.allowSprinting = true
  bot.pathfinder.setMovements(movements)

  setInterval(() => {
    const target = bot.players[TARGET]?.entity
    if (!target) return

    // constantly update follow goal so it chases in real time
    bot.pathfinder.setGoal(new GoalFollow(target, 1), true)

    const dist = bot.entity.position.distanceTo(target.position)

    if (dist < 3.2) {
      bot.lookAt(target.position.offset(0, target.height, 0), true)
      bot.attack(target)
    }
  }, 600) // 5x per second path updates
})
