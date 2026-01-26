import gym
import minerl
import numpy as np
# Create a MineRL environment
env = gym.make("MineRLBasaltFindCave-v0")

# Reset the environment to get the initial observation
obs = env.reset()

pov = np.ndarray(shape=(360, 640, 3))

env = gym.make("MineRLBasaltFindCave-v0")
obs = env.reset()

done = False
while not done:
    # Sample a random action from the action space
    action = env.action_space.sample()
    
    # Make sure we don't end the episode by pressing ESC
    action["ESC"] = 0
    
    # Take the action
    obs, reward, done, info = env.step(action)
    env.render()

env.close()