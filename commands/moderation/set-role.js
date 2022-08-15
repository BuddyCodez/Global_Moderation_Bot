const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("set-role")
        .setDescription("Set the role for admins")
        .addRoleOption(option => option.setName("role").setDescription("Mention a role for admins.").setRequired(true)),
    async execute(interaction, client) {
       const role = interaction.options.getRole("role");
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
          let Embed = new EmbedBuilder()
            .setTitle("AdminRole - Global Ban")
            .setDescription(
              `Admin Role is Now - ${role}\n this role is for admin to accept or deny bans of user report.`
            )
            .setTimestamp()
            .setFooter({ text: "AdminRole set successfully" })
            .setColor(0x00ff00);
          // storing channel in database
          await client.db.set("GlobalBan_role", role.id).then(() => {
            interaction.reply({ embeds: [Embed] });
          });
     }
}