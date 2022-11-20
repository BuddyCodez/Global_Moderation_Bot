const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  SelectMenuBuilder,
  InteractionType,
} = require("discord.js");
const ColorParser = require("parse-color");
const { Modal, TextInputComponent, showModal } = require("discord-modals");
async function ModalSubmit(interaction, client) {
  const Welcome = client.schema("Welcome");
  if (interaction.type === InteractionType.ModalSubmit) {
    const { user, guild, channel, customId} = interaction;
    if (interaction.customId == `Modal.${user.id}`) {
      const data = await Welcome.findOne({ Guild: guild.id });
      const Title = GetInput(interaction, "title");
      const Desc = GetInput(interaction, "description");
      const getClr = GetInput(interaction, "Color");
      const Clr = ColorParser(getClr).hex;
      
      if(!Clr) return interaction.reply({
        embeds: [
          { description: "Please enter a valid color", color: 0xff0019 },
        ],
        emphemeral: true,
      });
      const Color = Clr.replace("#", "0x")
      console.log(Color);
      const Footer = GetInput(interaction, "ftxt");
      const FooterIcon = GetInput(interaction, "ficon");
      let EmbedFooter;
      data.Title = Title;
      data.Description = Desc;
      data.Color = Color;
      if(!FooterIcon) EmbedFooter = { text: Footer}; else EmbedFooter = { text: Footer, iconURL: Footer == "my" ? FooterIcon : user.displayAvatarURL() };
      data.Footer = EmbedFooter
      await data.save();
      console.log(data);
      console.log(data.title);
      const BuildEmbed = new EmbedBuilder()
        .setDescription(Desc
        )
        .setColor(Color || 0x24a4ff)
      if (Title) {
          BuildEmbed.setTitle(Title);
      }
      if (Footer || FooterIcon) {
        BuildEmbed.setFooter(EmbedFooter);
      }
        interaction.reply({
          embeds: [
            {
              description: "Change Embed with your requirements!",
              color: 0x00ff00,
            },
          ],
          emphemeral: true
        });
          
      console.log(data.msg)
      let msg = await channel.messages.fetch(data.msg)
      await msg.edit({ embeds: [BuildEmbed] });
      // if (msg.id == data.msg) {
      //  await msg.edit({embeds: [BuildEmbed]})
        
      // } else console.log(false);
    
    }
    if (customId == `Field.${user.id}`) {
      const FieldTitle = GetInput(interaction, "Ftitle");
      const FieldValue = GetInput(interaction, "Fvalue");
      
    }
  }
}
function GetInput(interaction, key) {
  return interaction.fields.getTextInputValue(key);
}
module.exports = { ModalSubmit };