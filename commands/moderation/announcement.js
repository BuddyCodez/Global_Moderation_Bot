const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  SelectMenuBuilder,
} = require("discord.js");
const { mkdirSync } = require("fs");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("announcement")
    .setDescription("setup announcements for your server.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Select a channel")
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("embed")
        .setDescription("Select a wether message is sent thorugh embed or not.")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const Welcome = client.schema("Welcome");
    const { user, guild } = interaction;
    const channel = interaction.options.getChannel("channel");
    const IsEmbed = interaction.options.getBoolean("embed");
    if (IsEmbed) {
      const BuildEmbed = new EmbedBuilder()
        .setTitle("Announcement Command")
        .setDescription(
          "Lets setup announcement embed follow below menu to setup embed message."
        )
        .setFooter({ text: user.tag, iconURL: user.displayAvatarURL() })
        .setColor(0x24a4ff);
      const row = new ActionRowBuilder().addComponents(
        new SelectMenuBuilder()
          .setCustomId("embedBuilder")
          .setPlaceholder("Setup Embed for Announcement")
          .addOptions(
            {
              label: "Basic Details",
              description:
                "Set a basic details like title, description, color and footer",
              value: "Basic",
            },
            {
              label: "Add Fields",
              description: "Add fields to embed",
              value: "AddF",
            },
            {
              label: "Remover Fields",
              description: "Remove fields to embed",
              value: "RemoveF",
            }
          )
      );
      const msg = await interaction
        .reply({ embeds: [BuildEmbed], components: [row] });
      const message = await interaction.fetchReply()
        const data =
          await Welcome.findOne({ Guild: guild.id }) ||
          new Welcome({ Guild: guild.id });
        data.msg = message.id;
      await data.save();
     
    }
  },
};
