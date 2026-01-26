const mineflayer = require('mineflayer')

const bot = mineflayer.createBot({
  host: 'localhost',
  port: 50948,
  username: 'LocalConTester',
  version: '1.21.6',
  hideErrors: false
})

const RANGE_GOAL = 3

bot.loadPlugin(pathfinder)

bot.once('spawn', () => {
  const defaultMove = new Movements(bot)

  bot.on('chat', (username, message) => {
    if (username === bot.username) return
    if (message === 'come') return
      const target = bot.players[username]?.entity
      if (!target) {
        bot.chat("I don't see you !")
        return
      }
      const { x: playerX, y: playerY, z: playerZ } = target.position

      bot.pathfinder.setMovements(defaultMove)
      bot.pathfinder.setGoal(new GoalNear(playerX, playerY, playerZ, RANGE_GOAL))
    if (message === 'hello') {
      bot.chat(`Hello ${username}!`)
    }

    if (message === 'attack me')
      while (bot.players[username].entity.health > 0)
        attackPlayer(username)
        bot.pathfinder.setMovements(defaultMove)
        bot.pathfinder.setGoal(new GoalNear(playerX, playerY, playerZ, RANGE_GOAL))
    if (message === 'attack') attackEntity()
  })
})


function attackPlayer (username) {
  const player = bot.players[username]
  if (!player || !player.entity) {
    bot.chat('I can\'t see you')
  } else {
    bot.chat(`Attacking ${player.username}`)
    bot.attack(player.entity)
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