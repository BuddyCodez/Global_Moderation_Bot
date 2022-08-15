const ascii = require("ascii-table");
const fs = require("fs");
const table = new ascii().setHeading("Events", "Load Status");
function LoadEvents(client) {
  const EventFolders = fs.readdirSync("./events");
  for (const Folder of EventFolders) {
    const files = fs
      .readdirSync(`./events/${Folder}`)
      .filter((files) => files.endsWith(".js"));
    for (const file of files) {
      const event = require(`../events/${Folder}/${file}`);
      if (event.rest) {
        if (event.once) {
          client.rest.once(event.name, (...args) =>
            event.execute(client, ...args)
          );
        } else {
          client.rest.on(event.name, (...args) =>
            event.execute(client, ...args)
          );
        }
      } else {
        if (event.once)
          client.once(event.name, (...args) => event.execute(client, ...args));
        else client.on(event.name, (...args) => event.execute(client, ...args));
        } 
        table.addRow(file, "✅");
        continue;
    }
    }
    return console.log(table.toString(), "\n Events Loaded");
}
module.exports = { LoadEvents };