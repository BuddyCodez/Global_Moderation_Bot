const { Client, Collection } = require("discord.js");
const { GatewayIntentBits, IntentsBitField, Partials } = require("discord.js");
const { User, Message, GuildMember, ThreadManager } = Partials;
const { Poru } = require("poru");
const dotenv = require("dotenv");
dotenv.config();

const client = new Client({
  intents: new IntentsBitField(32767),
  partials: [User, Message, GuildMember, ThreadManager],
});

client.commands = new Collection();
client.config = require("./config.json");

const PoruOptions = {
  spotify: {
    clientID: "cb41529dc3bd4d8f8a240dbee0fff4e8",
    clientSecret: "bcca82f42930498aa385a8289fdf276b",
    playlistLimit: 5,
  },
  apple: {
    playlistLimit: 5,
  },
};
client.poru = new Poru(client, client.config.nodes, PoruOptions);
client.music = new Collection();

const { SlashCommands } = require("./handlers/slashcommands.js");
const { LoadEvents } = require("./handlers/events.js");
const { PoruEvents } = require("./handlers/PoruEvents");

LoadEvents(client);
SlashCommands(client);
PoruEvents(client);

//mongo client
client.mongoose = require("./mongoClient");
client.mongoose.init();
client.schema = (file) => require(`./Schema/${file}`);
client.login(process.env.token);
