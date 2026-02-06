import ollama from 'ollama';

export async function think(userRequest, perception) {
  const prompt = `You are an aggressive Minecraft bot. 
  Perception: ${JSON.stringify(perception)}
  User wants: "${userRequest}"
  Respond ONLY with JSON: {"action": "mine", "target": "stone"} or {"action": "stop"}`;

  const response = await ollama.chat({
    model: 'llama3.1:8b',
    messages: [{ role: 'user', content: prompt }],
    format: 'json',
    stream: false
  });

  return JSON.parse(response.message.content);
}