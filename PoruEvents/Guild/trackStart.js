const Canvas = require("@napi-rs/canvas");
const { request } = require("undici");
const { Buttons } = require("../../Buttons");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  AttachmentBuilder,
  SelectMenuBuilder,
} = require("discord.js");
const { CanvaAlbum, ConvertToMs } = require("../../functions/CanvaAlbum");
module.exports = {
  name: "trackStart",
  async execute(client, player, track, payload) {
    const bar = {
      x: 275.5,
      y: 183.75,
      height: 37.5,
      width: 596.5,
      track: {
        color: "#24a4ff",
      },
    };
    const duration = ConvertToMs(track.info.length);
    //--state--
    let state = true;
    if (player.previousTrack) state = false;
    let skipState = true;
    if (player.queue.size > 0) skipState = false;
    const channel = client.channels.cache.get(player.textChannel);
    const user = track.info.requester;
    const trackname = track.info.name;
    //canva:

    const file = new AttachmentBuilder(await CanvaAlbum(track, player, bar), {
      name: "album.png",
    });
    const Embed = new EmbedBuilder();
    Embed.setTitle(
      `<a:arctricity_playing:1012749878016884837> Now Playing - ${track.info.title}`
    );
    Embed.setColor(0x24a4ff);
    Embed.setDescription(
      `[${track.info.title}](${track.info.uri}) 
      ${duration}\n`
    ).setImage("attachment://album.png");
    Embed.setThumbnail(track.info.image);
    Embed.setFooter({
      text: track.info.requester ? `${track.info.requester.tag} ` : track.info.title,
      iconURL: track.info.requester ? track.info.requester.avatarURL() : client.user.avatarURL() ,
    });
    let btn = client.music.get(`${track.info.requester.id}_buttons`) || [null, null];
    const Menu = (name) => {
      const Row = new ActionRowBuilder().addComponents(
        new SelectMenuBuilder()
          .setCustomId(`Player_${track.info.requester.id}`)
          .setPlaceholder("Select an option")

          .addOptions(
            {
              label: "Add song to favorite List",
              description: "Add this song in your favorite music list",
              value: `add_${name}`,
              emoji: "1014408781351882833",
            },
            {
              label: "Remove song from favorite List",
              description: "Remove this song from your favorite music list",
              value: `remove_${track.info.title}`,
              emoji: "1014408781351882833",
            }
          )
      );
      return Row;
    }
    channel
      .send({
        embeds: [Embed],
        components: [
          Buttons(state, skipState, user, btn[0], btn[1]),
          Menu(track.info.title),
        ],
        files: [file],
      })

      .then(async (msg) => {
        let previous = await client.music.get(track.info.requester.id);
        if (player.previousTrack) {
          const channel = client.channels.cache.get(player.textChannel);
          const Pmsg = await channel.messages.fetch(previous[0]);
          await Pmsg.delete();
          client.music.delete(track.info.requester.id);
          console.log(`<<< Last Message of ${track.info.requester.tag} deleted >>>`, track.info.title);
        }

        await client.music.set(track.info.requester.id, [
          msg.id,
          state,
          skipState,
        ]);
        setInterval(async () => {
          if (!player.isPlaying || player.isPaued) return;
          if (player.currentTrack) {
            let userID = await client.music.get(track.info.requester.id);

            if (userID && userID[0]) {
              const file = new AttachmentBuilder(
                await CanvaAlbum(track, player, bar),
                {
                  name: "album.png",
                }
              );
              const channel = client.channels.cache.get(player.textChannel);
              let message = await channel.messages.fetch(userID[0]);
              message.edit({
                files: [file],
              });
            }
          }
        }, 30000);
      });
  },
};
