const ascii = require("ascii-table");
const fs = require("fs");
function SlashCommands(client) {
  //heading of table
  const LoadTable = new ascii().setHeading("Slash Command", "Load Status", "Dev Command");
  //array for cmnds
  let SlashCmdArry = [];
  let developerArry = [];
  // looping folders for each file.
  const cmdFolders = fs.readdirSync("./commands");
  for (const folder of cmdFolders) {
    const cmdFiles = fs
      .readdirSync(`./commands/${folder}`)
      .filter((files) => files.endsWith(".js"));
    for (const file of cmdFiles) {
      const cmdFile = require(`../commands/${folder}/${file}`);
      client.commands.set(cmdFile.data.name, cmdFile);
      if (cmdFile.developer) {
        developerArry.push(cmdFile.data.toJSON());
        LoadTable.addRow(file, "✅", "✅");
      }
      else SlashCmdArry.push(cmdFile.data.toJSON());
      //adding a row on cmd found and run able
      LoadTable.addRow(file, "✅", "❎");
      continue;
    }
  }
  //pushing command to public servers.
  client.on("ready",(client) =>{
  client.application.commands.set(SlashCmdArry);
  //dev guild cmds.
  if (client.config.devserverid.length > 0) {
    client.config.devserverid.forEach((guildid) => {
      const devGuild = client.guilds.cache.get(guildid);
      devGuild.commands.set(developerArry);
    });
  }
})
  
  //showing table to console
  console.log(LoadTable.toString(), "\n SlashCommands Loaded");
}
module.exports = { SlashCommands }; 