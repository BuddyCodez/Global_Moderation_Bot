const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("reports-channel")
    .setDescription("Setup a Log Channel for Global Ban reports ")
    .addChannelOption((option) =>
      option
        .setName("log-channel")
        .setDescription("provide a admin log channel")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    //get mentioned channel
    const channel = interaction.options.getChannel("log-channel");
    const devs = client.config.devs;
    let checkdev = false;
    devs.forEach((dev) => {
      if (interaction.user.id === dev) return (checkdev = true);
    });
    if (!checkdev)
      return interaction.reply({
        content: "This command can only be run by owners of the bot.",
        ephemeral: true,
      });

    //if not found
    if (!channel)
      return interaction.reply({ content: "Provided Channel is not found" });
    // embed after success full channel set
    let Embed = new EmbedBuilder()
      .setTitle("ReportChannel - Global Ban")
      .setDescription(
        `Report Channel is now ${channel}\nthis channel is where all the user report sent to.`
      )
      .setTimestamp()
      .setFooter({ text: "ReportChannel set successfully" })
      .setColor(0x00ff00);
    // storing channel in database
    await client.db.set("global_ReportChannel", channel.id).then(() => {
      interaction.reply({ embeds: [Embed] });
    });
  },
};
