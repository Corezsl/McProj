from javascript import require, On

mineflayer = require("mineflayer")

bot = mineflayer.createBot({"username": "HelloWorld", "host": "localhost", "port": 55152, "version": "1.21.11", "hideErrors": False})

@On(bot, "login")
def login(this):
    pass