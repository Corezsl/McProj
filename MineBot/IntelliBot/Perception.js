export function getPerception(bot) {
  return {
    location: bot.entity.position,
    inventory: bot.inventory.items().map(i => `${i.count} ${i.name}`),
    surroundings: bot.findBlocks({ matching: b => b.name !== 'air', maxDistance: 5, count: 3 })
      .map(p => bot.blockAt(p).name)
  };
}