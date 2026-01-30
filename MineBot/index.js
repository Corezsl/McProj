const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals } = require("mineflayer-pathfinder")
const { GoalBlock, GoalFollow } = goals

const bot = mineflayer.createBot({
  host: 'localhost',
  port: 51255,
  username: 'LocalConTester',
  version: '1.21.6',
  hideErrors: false
})

const RANGE_GOAL = 3

bot.loadPlugin(pathfinder)

bot.once("spawn", () => {
  const mcData = require("minecraft-data")(bot.version)
  console.log("Bot spawned")
})


bot.on('chat', (username, message) => {
  if (username === bot.username) return
  if (message === 'come') return
    const target = bot.players[username].entity
    if (!target) {
      bot.chat("I don't see you !")
      return
    }

    bot.pathfinder.setGoal(new GoalFollow(target, 1))
  if (message === 'hello') {
    bot.chat(`Hello ${username}!`)
  }

  if (message === 'attack me')
    stopattack = false
    while (!stopattack)
      bot.pathfinder.setGoal(new GoalFollow(target, 1))
      attackPlayer(username)
    
  if (message === 'attack') attackEntity()
})



function attackPlayer (username) {
  const player = bot.players[username]
  distance = Math.sqrt(Math.abs(bot.entity.position.x - player.entity.position.x) ** 2, Math.abs(bot.entity.position.y - player.entity.position.y) ** 2, Math.abs(bot.entity.position.z - player.entity.position.z) ** 2)
  if (!player || !player.entity) {
    bot.chat('I can\'t see you')
  } 
  if (distance < 4){
    bot.attack(player.entity)
    bot.chat(`Attacking ${player.username}`)

  }
  else {
    bot.chat(player + 'out of range')
  }
}

function attackEntity () {
  const entity = bot.nearestEntity()
  if (!entity) {
    bot.chat('No nearby entities')
  } else {
    bot.chat(`Attacking ${entity.name ?? entity.username}`)
    bot.attack(entity)
  }
}

bot.on('kicked', reason => {
  console.log('Kicked:', reason)
})

bot.on('error', err => {
  console.log('Error:', err)
})