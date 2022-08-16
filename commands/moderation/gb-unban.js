const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("gb-unban")
    .setDescription("for admins only. Globally unbans a user.")
    .addStringOption((option) =>
      option
        .setName("user_id")
        .setDescription("provide a user id to un ban it from every guild.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("provide a reason to un-ban.")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    await interaction.deferReply();
     let AdminRole = await client.db.get(`GlobalBan_role`);
     if (!interaction.member.roles.cache.has(AdminRole))
       return interaction.editReply({
         content: "You are not an admin, you are not allowed to perform this!",
         ephemeral: true,
       });
    
      // check if it is a valid user id
    const userid = interaction.options.getString("user_id");
      const reason = interaction.options.getString("reason");
      let user = await client.users.fetch(userid);
      if (!user) return interaction.editReply({
        content: "Provided User id is not found",
      });

      let Embed = new EmbedBuilder()
          .setTitle("__User Unbanned__")
          .setDescription(
              `${interaction.user.id}, **${user.tag}** has been successfully global unbanned for the reason of:\n **${reason}**`
          )
          .setTimestamp()
          .setFooter({ text: "Global Unbanned" })
      .setColor(0x00ff00);
      let NotunBannable = [];
         let Guilds = client.guilds.cache;
         let BanSize = 0;
         console.log(`total guilds = ${Guilds.size}`);
    for (let [id, Guild] of Guilds.entries()) {
      if (Guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        let GuildBans = await Guild.bans.fetch();
        let FilterBans = GuildBans.filter(x => x.user.id === userid);
        if (FilterBans.size > 0) {
          await Guild.bans
            .remove(userid, reason)
            .then(() => {
              BanSize = BanSize + 1;
              console.log(
                "<<<",
                user.tag,
                "is unbanned from",
                Guild.name,
                "By Admin:",
                interaction.user.tag,
                ">>"
              );
            })
            .catch((err) => {
              NotunBannable.push(`${Guild.name} - Error while trying to ban.`);
              console.log(err);
            });
        } else {
           NotunBannable.push(`${Guild.name} - Not Banned in this guild`);
        }
      } else {
           NotunBannable.push(`${Guild.name} - Permissions Missing.`);
          }
      }
      if (NotunBannable.length > 0) {
          Embed.setDescription(
              `${interaction.user.id}, **${user.tag}** has been successfully global unbanned for the reason of:\n ${reason}\nI cant unban **${user.tag}** in these servers: ${NotunBannable.join(", ")}\n total Server = **${Guilds.size}** `
          );
      } 
      return interaction.editReply({ embeds: [Embed] });
  },
};
