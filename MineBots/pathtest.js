const mineflayer = require("mineflayer")
const { pathfinder, Movements, goals } = require("mineflayer-pathfinder")
const { GoalBlock, GoalFollow } = goals

const bot = mineflayer.createBot({
  host: "localhost",
  port: 51255,
  username: "PathBot"
})

bot.loadPlugin(pathfinder)

bot.once("spawn", () => {
  const mcData = require("minecraft-data")(bot.version)
  const defaultMove = new Movements(bot, mcData)
  bot.pathfinder.setMovements(defaultMove)
  console.log("Bot spawned")
})

bot.on("chat", (username, message) => {
  if (username === bot.username) return

  const args = message.split(" ")

  if (args[0] === "!goto") {
    const x = parseInt(args[1])
    const y = parseInt(args[2])
    const z = parseInt(args[3])

    bot.pathfinder.setGoal(new GoalBlock(x, y, z))
    bot.chat(`Going to ${x} ${y} ${z}`)
  }

  if (args[0] === "!follow") {
    const target = bot.players[username].entity
    if (!target) return bot.chat("I can't see you")

    bot.pathfinder.setGoal(new GoalFollow(target, 1))
    bot.chat("Following you")
  }

  if (args[0] === "!stop") {
    bot.pathfinder.setGoal(null)
    bot.chat("Stopped")
  }
})
