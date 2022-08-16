const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Displays the help menu for th e bot"),
    async execute(interaction, client) {
       await interaction.deferReply();
        let HelpEmbed = new EmbedBuilder()
            .setTitle("__Bot Help__")
            .setDescription(
                `__A list of commands and what they will do (all of bots commands are **slash**)__\n\n**/help**\nDisplays the menu that you are now.\n**/information**\nGives you useful information for the bot.\n**/gb-report**\nif you wish to report a user for global ban, you may do so here. For Full guide on how to report someone, please join our [Support Server](${client.config.support_server})\n\n__**Useful links**__\n__Support Server Link:__ ${client.config.support_server}\n__Invite link:__ ${client.config.invite_link}\n__Patron Link:__ ${client.config.patron}\n__Discord TOS:__ https://discord.com/terms`
          )
            .setColor(0x00bfff);
        await interaction.editReply({embeds: [HelpEmbed]})
    }
}