const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { Modal, TextInputComponent, showModal } = require("discord-modals");
const { Player } = require("poru");
async function SelectMenu(interaction, client) {
  if (interaction.isSelectMenu()) {
    const { user, guild, values } = interaction;
    if (interaction.customId === "embedBuilder") {
      const [command] = interaction.values;
      const Key = ["Basic", "AddF", "RemoveF"];
      const cmd = Key.filter((x) => x == command);
      if (cmd == "Basic") {
        const modal = new Modal() // We create a Modal
          .setCustomId(`Modal.${user.id}`) // We set the customId of the Modal
          .setTitle("Set A title")
          .addComponents(
            new TextInputComponent() // We create a Text Input Component
              .setCustomId("title")
              .setLabel("Title")
              .setStyle("SHORT") //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
              .setPlaceholder("Enter a details")
              .setRequired(false),
            new TextInputComponent() // We create a Text Input Component
              .setCustomId("description")
              .setLabel("Description")
              .setStyle("LONG") //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
              .setPlaceholder("Enter a detials")
              .setRequired(true),
            new TextInputComponent() // We create a Text Input Component
              .setCustomId("Color")
              .setLabel("Color")
              .setStyle("SHORT") //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
              .setPlaceholder("Enter a Color Name or hexCode")
              .setRequired(true),
            new TextInputComponent() // We create a Text Input Component
              .setCustomId("ftxt")
              .setLabel("Footer Text")
              .setStyle("SHORT") //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
              .setPlaceholder("Enter a Footer Text")
              .setRequired(false),
            new TextInputComponent() // We create a Text Input Component
              .setCustomId("ficon")
              .setLabel("Footer Icon")
              .setStyle("SHORT") //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
              .setPlaceholder(
                "Enter a Url of icon either type my to use profile icon."
              )
              .setRequired(false)
          );
        showModal(modal, {
          client: client, // Client to show the Modal through the Discord API.
          interaction: interaction, // Show the modal with interaction data.
        });
      } else if (cmd == "AddF") {
        const modal = new Modal() // We create a Modal
          .setCustomId(`Filed.${user.id}`) // We set the customId of the Modal
          .setTitle("Set A title")
          .addComponents(
            new TextInputComponent() // We create a Text Input Component
              .setCustomId("Ftitle")
              .setLabel("Field Title")
              .setStyle("SHORT") //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
              .setPlaceholder("Enter Field Title")
              .setRequired(false),
            new TextInputComponent() // We create a Text Input Component
              .setCustomId("Fvalue")
              .setLabel("Field Value")
              .setStyle("LONG") //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
              .setPlaceholder("Enter Field Value or type none for empty field.")
              .setMaxLength(800)
              .setRequired(true)
          );
        showModal(modal, {
          client: client, // Client to show the Modal through the Discord API.
          interaction: interaction, // Show the modal with interaction data.
        });
      }
    }

    if (interaction.customId == `Player_${user.id}`) {
      const Music = client.schema("Music");
      const player = client.poru.players.get(guild.id);
      if (!player)
        return interaction.reply({
          embeds: [
            {
              description: "Nothing is Playing right now!",
              color: 0xff0019,
            },
          ],
        });
      const trackname = player.currentTrack.info.title;
      const Collection = [`add_${trackname}`, `remove_${trackname}`];
      const [cmd] = interaction.values;
      const selected = Collection.find((x) => x === cmd);
      const data = selected.split("_");
      if (data[0] == `add`) {
        const embed = new EmbedBuilder()
          .setDescription(
            `<a:tick:1012933003120476181> Added to Favourite List!`
          )
          .setColor(0xff0019)
          .setFooter({
            text: `track: ${player.currentTrack.info.title}`,
            iconURL: user.avatarURL(),
          });
        interaction.reply({ embeds: [embed] });
        const MusicData =
          (await Music.findOne({ User: user.id })) ||
          new Music({ User: user.id });
        if (MusicData.FavoriteList.includes(player.currentTrack.info.title))
          return;
        MusicData.FavoriteList.push(player.currentTrack.info.title);
        await MusicData.save();

        console.log(MusicData.FavoriteList);
      }
      if (data[0] == "remove") {
        const embed = new EmbedBuilder()
          .setDescription(
            `<a:tick:1012933003120476181> Removed From Favourite List!`
          )
          .setColor(0xff0019)
          .setFooter({
            text: `track: ${player.currentTrack.info.title}`,
            iconURL: user.avatarURL(),
          });
        interaction.reply({ embeds: [embed] });
        const MusicData =
          (await Music.findOne({ User: user.id })) ||
          new Music({ User: user.id });
        if (
          !MusicData.FavoriteList.includes(player.currentTrack.info.nametitle)
        )
          return;
        let FilteredData = MusicData.FavoriteList.filter(
          (x) => x !== player.currentTrack.info.title
        );
        FilteredData.forEach((x) => MusicData.FavoriteList.push(x));
        await MusicData.save();

        console.log(MusicData.FavoriteList);
      }
    }
  }
}
module.exports = { SelectMenu };
