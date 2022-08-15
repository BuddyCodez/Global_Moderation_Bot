const { Client, IntentsBitField, Partials, Collection } = require("discord.js");
const { User, Message, GuildMember, ThreadManager } = Partials;
const { Database } = require("quickmongo");
const client = new Client({
  intents: new IntentsBitField(32767),
  partials: [User, Message, GuildMember, ThreadManager],
});
client.commands = new Collection();
client.config = require("./config.json");
client.cooldowns = new Collection();
client.COOLDOWN_SECONDS = 60000;
const db = new Database(client.config.mongo_uri);
db.connect();

db.on("ready", () => {
  console.log("Connected to the database");
});

client.db = db;
const { SlashCommands } = require("./handlers/slashcommands.js");
const { LoadEvents } = require("./handlers/events.js");

client
  .login(client.config.token)
  .then(() => {
    LoadEvents(client);
    SlashCommands(client);
  })
  .catch((err) => console.error(err));