const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const { GoalFollow } = goals

const bot = mineflayer.createBot({
  host: 'localhost',
  port: 25565,
  username: 'HunterBot'
})

bot.loadPlugin(pathfinder)

let mcData
let movements

// Combat state
let fighting = false
let targetName = null
let lastAttack = 0
let strafeDir = 1

bot.once('spawn', () => {
  mcData = require('minecraft-data')(bot.version)
  movements = new Movements(bot, mcData)
  movements.allowSprinting = true
  movements.canDig = false
  bot.pathfinder.setMovements(movements)
})

// ===== CHAT COMMANDS =====
bot.on('chat', (username, message) => {
  if (username === bot.username) return

  if (message === 'ready') {
    fighting = true
    targetName = username
    bot.chat("Hunting you.")
  }

  if (message === 'stop') {
    fighting = false
    targetName = null
    bot.chat("Stopped.")
  }
})

// ===== MAIN COMBAT LOOP =====
bot.on('physicsTick', () => {
  if (!fighting || !targetName) return

  const target = bot.players[targetName]?.entity
  if (!target) {
    fighting = false
    bot.chat("Target lost.")
    return
  }

  bot.pathfinder.setGoal(new GoalFollow(target, 1), true)

  const dist = bot.entity.position.distanceTo(target.position)
  const now = Date.now()

  bot.lookAt(target.position.offset(0, target.height, 0), true)

  bot.setControlState('sprint', dist > 3)

  if (dist < 10) {
    if (Math.random() < 0.02) strafeDir *= -1
    bot.setControlState('left', strafeDir === -1)
    bot.setControlState('right', strafeDir === 1)
  }
  
  if (dist < 3.2 && now - lastAttack >= 600) {
    lastAttack = now

    // Jump to set up crit
    bot.setControlState('jump', true)
    setTimeout(() => bot.setControlState('jump', false), 50)

    // Attack while falling
    setTimeout(() => {
      bot.lookAt(target.position.offset(0, target.height, 0), true)
      bot.attack(target)
    }, 450)
  }
})
