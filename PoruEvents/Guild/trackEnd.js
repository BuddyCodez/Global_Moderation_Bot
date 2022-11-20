module.exports = {
  name: "trackEnd",
  async execute(client, player, track, payload) {
    const messageId = client.music.get(player.currentTrack.info.requester.id);
    let channel = client.channels.cache.get(player.textChannel);
    let message = await channel.messages.fetch(messageId);
    if (message) await message.delete();
  },
};
