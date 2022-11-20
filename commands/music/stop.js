const {
  SlashCommandBuilder,
 
} = require("@discordjs/builders");
const { PermissionsBitField } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop the music and clear the queue"),
  async execute(interaction, client) {
    const player = client.poru.players.get(interaction.guild.id);
    if (!player) {
      return interaction.reply({
        embeds: [
          { description: "Nothing is Playing right now!", color: 0xff0019 },
        ],
      });
    }
      let channel = await client.channels.fetch(player.voiceChannel);

    if (channel.members.size > 2) {
      if (
        player.currentTrack.info.requester.id !== interaction.user.id &&
        !interaction.member.permissions.has(
          PermissionsBitField.Flags.ManageGuild
        )
      ) {
        return interaction.reply({
          embeds: [
            {
              description: "You cant perform this! make sure you have permissions or you are the requester of this song.",
              color: 0xff0019,
            },
          ],
        });
      }
      interaction.reply({
        embeds: [{ description: "Stopped Playing Song!", color: 0xff0019 }],
      });
      player.destroy();
    } else {
      interaction.reply({
        embeds: [{ description: "Stopped Playing Song!", color: 0xff0019 }],
      });
      player.destroy();
    }
  },
};
