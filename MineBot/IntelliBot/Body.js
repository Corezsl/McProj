import mineflayer from 'mineflayer';
import { actions } from './Actions.js';
import { think } from './Brain.js';
import { getPerception } from './perception.js';

const bot = mineflayer.createBot({ host: 'localhost', port: 60256, username: 'LogicBot' });

bot.on('chat', async (username, message) => {
  if (username === bot.username) return;

  const perception = getPerception(bot);
  const decision = await think(message, perception);

  if (decision.action === 'mine') {
    actions.mine(bot, decision.target);
  } else {
    actions.stop(bot);
  }
});