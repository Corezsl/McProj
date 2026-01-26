import time
import logging

import gym
import minerl
import matplotlib.pyplot as plt
import coloredlogs

coloredlogs.install(logging.DEBUG)

NUM_EPISODES = 6
MAX_STEPS = 100


def main():
    env = gym.make("MineRLTreechop-v0")

    # ---- Matplotlib setup ----
    plt.ion()
    fig, ax = plt.subplots()
    img = ax.imshow(env.reset()["pov"])
    ax.axis("off")
    # --------------------------

    for episode in range(NUM_EPISODES):
        obs = env.reset()
        done = False
        total_reward = 0

        for step in range(MAX_STEPS):
            action = env.action_space.noop()
            obs, reward, done, info = env.step(action)
            total_reward += reward

            # ---- LIVE POV RENDERING ----
            img.set_data(obs["pov"])
            fig.canvas.draw_idle()
            plt.pause(0.01)
            # ----------------------------

            print(f"Ep {episode} | Step {step} | Reward {reward:.2f}")

            if done:
                break

        print(f"Episode {episode} total reward: {total_reward:.2f}")

    env.close()
    plt.ioff()
    plt.show()
    print("Demo complete.")


if __name__ == "__main__":
    main()
