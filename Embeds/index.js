const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
function getEmbed(data) {
    const conformationEmbed = new EmbedBuilder()
      .setTitle("__Confirmation__")
      .setDescription("Are you sure you want to report this user?")
      .addFields(
        { name: "__Offenders User ID__", value: data[0] },
        { name: "__Reason for report__", value: data[1] },
        { name: "__Proof__", value: data[2] }
      )
      .setColor(0xffff00)
      .setFooter({
        text: "Pending Confirmation",
      });
    return conformationEmbed;
}

  module.exports = { getEmbed };