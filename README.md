<div align="center">
  <img src="https://user-images.githubusercontent.com/11510099/129452842-b81e718b-0250-4d3d-a8ed-f42e154692e6.png">
  <h1>SataniaBotNext</h1>
</div>

Port of [SataniaBot](https://github.com/Pizzacus/SataniaBot) to the latest (v13) Discord.js library. A lot of code will be based of the original code, I don't have time to fully rewrite it. Porting will be mostly on demand so don't expect anything. Additionally, I have barely experience in making bots so feel free to make pulls if I did something wrong.

Credit goes to @Pizzacus for most of the original code.

## Why ES6 Imports instead of require?
I've been doing some web development recently and the absence of import/export drove me nuts, I don't like JS pre-ES6 simple as that.

## Setup
SataniaBot uses discord.js v13, you can simply clone the repository and run `npm i` (or `yarn add`) to install the dependencies she needs. **Make sure you have at minimum Node version 16.6.0**.

After that, create a .env file in the root directory and put there just 2 values: 
```
APP_ID=NUMBERS
BOT_TOKEN=TOKEN
```
* `APP_ID` is simply the Application ID found in the application's general information.
* `BOT_TOKEN` is the public key found in the same location.

After that simply run `node .` and you're done!
