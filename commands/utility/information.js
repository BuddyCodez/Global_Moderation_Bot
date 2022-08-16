const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("information")
    .setDescription("Displays bot ifnormation"),
  async execute(interaction, client) {
    await interaction.deferReply();
    let InfoEmbed = new EmbedBuilder()
      .setTitle("__How this bot works__")
      .setDescription(
        `This bot is focused on keeping **your** server the safest it can be. We achieve this by **global banning**(banning the user in every server the bot is in) known user who brake [Discord TOS](https://discord.com/terms).\n\nFurther more, we also have a reporting system (/gb-report) where you can report a user for a global ban if they have broke [Discord TOS](https://discord.com/terms).\n\nWe hope you enjoy using our bot, and enjoy a **safer** discord community!\n\n__**Useful links**__\n__Support Server Link:__ ${client.config.support_server}\n__Invite link:__ ${client.config.invite_link}\n__Patron Link:__ ${client.config.patron}\n__Discord TOS:__ https://discord.com/terms`
      )
      .setColor(0x00bfff);
    await interaction.editReply({ embeds: [InfoEmbed] });
  },
};
