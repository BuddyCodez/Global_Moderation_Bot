const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("filters")
    .setDescription("Add filters to current song.")
    .addStringOption((option) =>
      option
        .setName("filter-name")
        .setDescription("provide a filter name.")
        .setRequired(true)
        .addChoices(
          { name: "8D", value: "set8D" },
          { name: "Bassboost", value: "setBassboost" },
          { name: "Equalizer", value: "setEqualizer" },
          { name: "Karaoke", value: "setKaraoke" },
          { name: "Nightcore", value: "setNightcore" },
          { name: "Vaporwave", value: "setVaporwave" }
        )
    )
    .addBooleanOption((option) =>
      option.setName("mode").setDescription("enable or disable the filter.")
    ),

  async execute(interaction, client) {
    const { guild, user } = interaction;
    const player = client.poru.get(guild.id);
    if (!player)
      return interaction.reply({
        content: "Nothing is Playing!",
        ephemeral: true,
      });
    const filter = interaction.options.getString("filter-name");
    let mode = interaction.options.getString("mode");
    if (!mode) mode = false;
    if (filter == "set8D") {
      player.filters.set8D(mode);
      interaction.reply({ content: "8D Filter Enabled!", ephemeral: true });
    } else if (filter == "setBassboost") {
      player.filters.setBassboost(mode);
      interaction.reply({
        content: "Bassboost Filter Enabled!",
        ephemeral: true,
      });
    } else if (filter == "setEqualizer") {
      player.filters.setEqualizer(mode);
      interaction.reply({
        content: "Equalizer Filter Enabled!",
        ephemeral: true,
      });
    } else if (filter == "setKaraoke") {
      player.filters.setKaraoke(mode);
      interaction.reply({
        content: "Karaoke Filter Enabled!",
        ephemeral: true,
      });
    } else if (filter == "setNightcore") {
      player.filters.setNightcore(mode);
      interaction.reply({
        content: "Nightcore Filter Enabled!",
        ephemeral: true,
      });
    } else if (filter == "setVaporwave") {
      player.filters.setVaporwave(mode);
      interaction.reply({
        content: "Vaporwave Filter Enabled!",
        ephemeral: true,
      });
    } else {
      interaction.reply({
        content: "No Filter Found please make sure you choose from choices",
      });
    }
  },
};