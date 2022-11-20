const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Buttons = (state, skipState, user, LEmoji, LId, PEmoji,Pid) => {
      const ButtonRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`backward_${user.id}`)
          .setEmoji("1012779804820512819")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(state),
        new ButtonBuilder()
          .setCustomId(Pid || `pause_${user.id}`)
          .setEmoji(PEmoji || "1012756648433025034")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`stop_${user.id}`)
          .setEmoji("1006538576005169233")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`forward_${user.id}`)
          .setEmoji("1012765001796308992")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(skipState),
        new ButtonBuilder()
          .setCustomId(LId || `loop_${user.id}`)
          .setEmoji(LEmoji || "1008039572019626074")
          .setStyle(ButtonStyle.Secondary)
      );
    return ButtonRow;
}

module.exports = { Buttons };