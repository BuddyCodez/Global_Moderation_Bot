const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");
const { Buttons } = require("../../Buttons");
module.exports = {
  auto: true,
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("play music of your own choice.")
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription("provide a song name or a url.")
        .setRequired(true)
        
    ),
  async execute(interaction, client) {
    const track = interaction.options.getString("song")
    if (!interaction.member.voice.channel)
      return interaction.reply({
        content: `Please connect with voice channel `,
        ephemeral: true,
      });

    const Embed = new EmbedBuilder()
      .setDescription(
        "<a:arctricity_loading:1012745373225336985> Loading Song.."
      )
      .setColor(0x24a4ff);
    interaction.reply({ embeds: [Embed] });

    const res = await client.poru.resolve(track);

    if (res.loadType === "LOAD_FAILED") {
      return interaction.editReply("Failed to load track.");
    } else if (res.loadType === "NO_MATCHES") {
      return interaction.editReply("No source found!");
    }

    //create connection with discord voice channnel
    const player = client.poru.createConnection({
      guildId: interaction.guild.id,
      voiceChannel: interaction.member.voice.channelId,
      textChannel: interaction.channel.id,
      selfDeaf: true,
    });

    if (res.loadType == "SEARCH_RESULT" || res.loadType == "TRACK_LOADED") {
      const track = res.tracks[0];
      player.queue.add(track);
      if (!player.isPlaying) player.play();
      Embed.setDescription(
        `**Track Queued - Position #${player.queue.size + 1}**`
      );
      Embed.setColor(0xff0019);
      track.info.requester = interaction.user;
      let previousInt = await interaction.fetchReply();
      await previousInt.edit({ embeds: [Embed] });
      // await interaction.editReply({ embeds: [Embed] });
    } else if (res.loadType == "PLAYLIST_LOADED") {
      for (const track of res.tracks) {
        track.info.requester = interaction.user;
        player.queue.add(track);
      }
      if (!player.isPlaying) player.play();
      let previousInt = await interaction.fetchReply();
      Embed.setDescription(
        `**Playlist Queued - Tracks #${res.tracks.length}**\n Name: **${res.playlistInfo.name}**`
      );
      Embed.setColor(0xff0019);
      await previousInt.edit({
        embeds: [Embed],
      });
    }

    let data = await client.music.get(interaction.user.id);
    if (data) {
      if (player.queue.size > 0 && player.previousTrack) {
        message = await interaction.channel.messages.fetch(data[0]);
        await message.edit({
          components: [Buttons(false, false, interaction.user)],
        });
      } else if (player.queue.size > 0) {
        let message = await interaction.channel.messages.fetch(data[0]);
        await message.edit({
          components: [Buttons(true, false, interaction.user)],
        });
      } else if (player.previousTrack) {
        let message = await interaction.channel.messages.fetch(data[0]);
        await message.edit({
          components: [Buttons(false, true, interaction.user)],
        });
      }
    }
  },
};
