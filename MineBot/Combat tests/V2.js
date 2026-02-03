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

let fighting = false
let targetName = null
let lastAttack = 0
let lastGoalUpdate = 0
let strafeAngle = 0

bot.once('spawn', () => {
    mcData = require('minecraft-data')(bot.version)
    movements = new Movements(bot, mcData)

    movements.allowSprinting = true
    movements.canDig = false
    movements.allowParkour = true
    movements.allow1by1towers = false
    movements.scafoldingBlocks = []

    bot.pathfinder.setMovements(movements)
    bot.chat("HunterBot online.")
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

    if (message === 'auto') {
        const nearest = findNearestPlayer()
        if (nearest) {
        targetName = nearest.username
        fighting = true
        bot.chat(`Auto-targeting ${targetName}`)
        }
    }
})

function findNearestPlayer() {
    let closest = null
    let minDist = Infinity

    for (const p of Object.values(bot.players)) {
        if (!p.entity || p.username === bot.username) continue
        const dist = bot.entity.position.distanceTo(p.entity.position)
        if (dist < minDist) {
        minDist = d
        closest = p
        }
    }
    return closest
}

bot.on('physicsTick', () => {
    if (!fighting || !targetName) return

    const target = bot.players[targetName]?.entity
    if (!target) {
        fighting = false
        bot.chat("Target lost.")
        return
    }

    const dist = bot.entity.position.distanceTo(target.position)
    const now = Date.now()

    if (now - lastGoalUpdate > 500) {
    bot.pathfinder.setGoal(new GoalFollow(target, 1), true)
    lastGoalUpdate = now
    }

    // ===== Simple Prediction =====
    const predicted = target.position.plus(target.velocity.scaled(0.5))
    bot.lookAt(predicted.offset(0, target.height, 0), true)


    // ===== Sprint When Far Away =====
    bot.setControlState('sprint', dist > 3)

    // ===== Circle Strafe =====
    if (dist < 10) {
        strafeAngle += 0.05
        bot.setControlState('left', Math.sin(strafeAngle) > 0)
        bot.setControlState('right', Math.sin(strafeAngle) < 0)
    }

    // ===== W-TAP (SPRINT RESET) =====
    if (dist < 3) {
        bot.setControlState('sprint', false)
        setTimeout(() => bot.setControlState('sprint', true), 100)
    }

    // ===== Crit Jump =====
    if (bot.entity.onGround && dist < 3.2) {
        bot.setControlState('jump', true)
        setTimeout(() => bot.setControlState('jump', false), 50)
    }

    if (bot.entity.velocity.y < -0.1 && dist < 3.2 && now - lastAttack >= 600) {
        lastAttack = now
        bot.attack(target)
    }
})


