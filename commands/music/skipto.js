const {SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { ApplicationCommandOptionType } = require("discord-api-types/v9");
const { execute } = require("../../PoruEvents/Guild/trackStart");

module.exports = {
data: new SlashCommandBuilder()
    .setName("skipto")
    .setDescription("skip to a sepcific song of queue.")
    .addNumberOption((option) =>
      option
        .setName("number")
        .setDescription("Enter number skip to(number is queue size).")
            .setRequired(true)
    ),

async execute(interaction, client) {
    function moveArrayElement(arr, fromIndex, toIndex) {
      arr.splice(toIndex, 0, arr.splice(fromIndex, 1)[0]);
      return arr;
    }

    let player = client.poru.players.get(interaction.guild.id);

    const position = Number(interaction.options.getNumber("number"));

    const from = position ? parseInt(position, 10) : null;
    const to = position  ? parseInt(position , 10) : null;

    if (from === null || to === null)
      return interaction.reply(`invaild usage \n jump 10 1`);

    if (
      from === to ||
      isNaN(from) ||
      from < 1 ||
      from > player.queue.length ||
      isNaN(to) ||
      to < 1 ||
      to > player.queue.length
    )
      return interaction.reply("that number is out of queue length");

    const moved = player.queue[from - 1];
    moveArrayElement(player.queue, from - 1, to - 1);

    return interaction.reply({
      embeds: [
        {
          color: "WHITE",
          description: `${moved.info.title} moved to \`${to}\``,
        },
      ],
    });
  },
};
