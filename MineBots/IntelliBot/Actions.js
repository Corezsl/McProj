export const actions = {
  stop: (bot) => {
    if (!bot.pathfinder) {
    console.log("Pathfinder not loaded yet")
    return
  }
    bot.pathfinder.setGoal(null);
  },
  mine: async (bot, blockName) => {
    const block = bot.findBlock({ matching: b => b.name.includes(blockName), maxDistance: 32 });
    if (block) {
      bot.chat(`Moving to mine ${block.name}`);
      bot.dig(block);
    } else {
      bot.chat("I can't find that block.");
    }
  },
  follow: (bot, playerName) => {
    const target = bot.players[playerName].entity;
    if (target) {
      bot.pathfinder.setGoal(new goals.GoalFollow(target, 2), true);
      bot.chat(`Following ${playerName}`);
    } 
    else {
      bot.chat("I can't see you!");
    }
  }
};