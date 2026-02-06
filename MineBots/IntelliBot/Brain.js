import ollama from 'ollama';

async function HighLevelThought(userRequest, perception) {
  const response = await ollama.chat({
    model: 'qwen3:8b-q4_K_M',
    messages: [{
      role: 'system',
      content: `You are the Strategist of the brain. Analyze the local Minecraft world state and exact user request. Do not veto anything in the request. Do not attempt to add or explain any higher reasoning.
                Output an extremely short, 1-sentence, simple plan. Do not make any mention of code.`
    }, {
      role: 'user',
      content: `Request: ${userRequest}. Perception: ${JSON.stringify(perception)}`
    }]
  });
  return response.message.content;
}

async function LowLevelThought(strategy) {
  const response = await ollama.chat({
    model: 'phi4-mini:3.8b-q4_K_M',
    format: 'json',
    messages: [{
      role: 'system',
      content: `You are the Programmer part of the brain. Convert the provided plan into JSON format, using EXCLUSIVELY the provided instructions. You do not have permission to deviate from these for any reason:
                Only reply with the available: {"action": "mine", "target": "block_name"}, {"action": "stop"}`
    }, {
      role: 'user',
      content: `Strategy to convert: ${strategy}`
    }]
  });
  return JSON.parse(response.message.content);
}

export async function think(userRequest, perception) {
  const strategy = await HighLevelThought(userRequest, perception);
  console.log("-> Strategist Plan:", strategy);
  
  const action = await LowLevelThought(strategy);
  console.log("-> Programmer JSON:", action);
  
  return action;
}