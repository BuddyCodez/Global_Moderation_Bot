const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField,
  InteractionType,
} = require("discord.js");
const { ButtonHandler } = require("../../ButtonHandler");
const { SelectMenu } = require("../../SelectMenu");
const { ModalSubmit } = require("../../ModalSubmit");
const { Modal, TextInputComponent, showModal } = require("discord-modals");
module.exports = {
    name: "interactionCreate",
    async execute(client, interaction) {
        const command = client.commands.get(interaction.commandName);
        if (command) {
            try {
              
                command.execute(interaction, client)
            } catch (error) { 
                
                console.error(error)
            }
        }
        ButtonHandler(interaction, client);
        SelectMenu(interaction, client);
        ModalSubmit(interaction, client);
        // interactions like button click and everything else will be gone here.
    }
}