const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("set-logchannel")
    .setDescription("Setup a Log Channel where all sucessfull ban reports are sent. ")
    .addChannelOption((option) =>
      option
        .setName("log-channel")
        .setDescription("provide a log channel for ban reports")
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
      .setTitle("LogChannel - Global Ban")
      .setDescription(
        `Log Channel is now ${channel}\nthis channel is where all data of ban is sent.`
      )
      .setTimestamp()
      .setFooter({ text: "LogChannel set successfully" })
      .setColor(0x00ff00);
    // storing channel in database
    await client.db.set("global_LogChannel", channel.id).then(() => {
      interaction.reply({ embeds: [Embed] });
    });
  },
};
