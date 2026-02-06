export const actions = {
  stop: (bot) => {
    bot.pathfinder.setGoal(null);
  },
  mine: async (bot, blockName) => {
    const block = bot.findBlock({ matching: b => b.name.includes(blockName), maxDistance: 32 });
    if (block) {
      bot.chat(`Moving to mine ${block.name}`);
      await bot.dig(block);
    } else {
      bot.chat("I can't find that block.");
    }
  }
};