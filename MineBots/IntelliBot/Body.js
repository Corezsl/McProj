import mineflayer from 'mineflayer';
import { pathfinder } from 'mineflayer-pathfinder'
import { actions } from './Actions.js';
import { think } from './Brain.js';
import { getPerception } from './perception.js';


const bot = mineflayer.createBot({ host: 'localhost', port: 25565, username: 'IntelliBot' });
bot.loadPlugin(pathfinder)

bot.on('chat', async (username, message) => {
  if (username === bot.username) return;

  const perception = getPerception(bot);
  const decision = await think(message, perception);

  if (decision.action === 'mine') {
    actions.mine(bot, decision.target);
  }
  if (decision.action === 'follow') {
    actions.follow(bot, decision.target)
  }
  else {
    actions.stop(bot);
  }
});