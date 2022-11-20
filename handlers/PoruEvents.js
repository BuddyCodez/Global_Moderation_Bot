const ascii = require("ascii-table");
const fs = require("fs");
const table = new ascii().setHeading("PoruEvents", "Load Status");
function PoruEvents(client) {
  const EventFolders = fs.readdirSync("./PoruEvents");
  for (const Folder of EventFolders) {
    const files = fs
      .readdirSync(`./PoruEvents/${Folder}`)
      .filter((files) => files.endsWith(".js"));
    for (const file of files) {
      const event = require(`../PoruEvents/${Folder}/${file}`);

      client.poru.on(event.name, (...args) => event.execute(client, ...args));
            table.addRow(file, "✅");
      }

      continue;
  }
    return console.log(table.toString(), "\n Events Loaded");

  }

module.exports = { PoruEvents };
