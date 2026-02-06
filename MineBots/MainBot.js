const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals } = require("mineflayer-pathfinder")
const { GoalBlock, GoalFollow } = goals

const bot = mineflayer.createBot({
  host: 'localhost',
  port: 58037,
  username: 'LocalConTester',
  version: '1.21.6',
  hideErrors: false
})


bot.loadPlugin(pathfinder)

bot.once("spawn", () => {
  const mcData = require("minecraft-data")(bot.version)
  console.log("Bot spawned")
})


bot.on('chat', (username, message) => {
  if (username === bot.username) return
  if (message.toLowerCase() === 'come') return
    if (!bot.players[username].entity) {
      bot.chat("I don't see you !")
      return
    }

    bot.pathfinder.setGoal(new GoalFollow(bot.players[username].entity, 1))
  if (message.toLowerCase() === 'hello') {
    bot.chat(`Hello ${username}!`)
  }

  if (message.toLowerCase() === 'attack me'){
    while (bot.players[username].entity.health != 0){
      bot.pathfinder.setGoal(new GoalFollow(bot.players[username].entity, 1))
      if (bot.entity.position.xzDistanceTo(bot.players[username].entity.position.xy <= 3)){
        bot.attack(bot.players[username].entity)
      }
      
    }
  }
    
  if (message === 'attack') attackEntity()
})



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