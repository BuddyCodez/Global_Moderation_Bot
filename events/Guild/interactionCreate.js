const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField,
  InteractionType,
} = require("discord.js");
const { Modal, TextInputComponent, showModal } = require("discord-modals");
const { getEmbed } = require("../../Embeds/index");
module.exports = {
  name: "interactionCreate",
  async execute(client, interaction) {
    const command = client.commands.get(interaction.commandName);
    if (command) {
      command.execute(interaction, client);
    }
    if (interaction.isButton()) {
      if (interaction.customId.startsWith("_Accept.")) {
        await interaction.deferReply();
        let AdminRole = await client.db.get(`GlobalBan_role`);
        if (!interaction.member.roles.cache.has(AdminRole))
          return interaction.editReply({
            content:
              "You are not an admin, you are not allowed to perform this!",
            ephemeral: true,
          });
        const userarry = interaction.customId.split(".");
        const target = userarry[1];
        console.log(userarry);
        let NotBannable = [];
        let proof = await client.db.get(`ban_${target}`);
        let REASON = await client.db.get(`ban_${target}_reason`);
        let Guilds = client.guilds.cache;
        let BanSize = 0;
        console.log(`total guilds = ${Guilds.size}`);
        let UserBanEmbed = new EmbedBuilder()
          .setTitle("__Global Banned__")
          .setDescription(
            `Hello. Unfortunately you have been reported for a global ban and it has been approved by the a global moderator. This means you will be banned from every server the bot is in. Please see the details (including the reason and proof of your global ban).\nif you wish to appeal your global ban, please join this server: ${client.config.AppealServer}`
          )
          .addFields(
            {
              name: "**Reason for your global ban**",
              value: userarry[2],
            },
            {
              name: "**Proof:**",
              value: proof,
            }
          )
          .setColor(0x263857)
          .setFooter({ text: "your report has successfully sent!" });

        client.users.cache
          .get(target)
          .send({ embeds: [UserBanEmbed] })
          .then(() => console.log("sent message to user"))
          .catch((e) => console.error(e));

        for (let [id, Guild] of Guilds.entries()) {
          let username = await client.users.fetch(target);
          if (
            Guild.members.me.permissions.has(
              PermissionsBitField.Flags.BanMembers
            ) &&
            Guild.id !== client.config.AppealServerid
          ) {
            await Guild.bans
              .create(target, { reason: REASON })
              .then(() => {
                BanSize = BanSize + 1;

                console.log(
                  "<<<",
                  username.tag,
                  "is banned from",
                  Guild.name,
                  "By Admin:",
                  interaction.user.tag,
                  ">>"
                );
              })
              .catch((err) => {
                console.log(err);
                NotBannable.push(`${Guild.name} - Error Banning`);
              });
          } else {
            NotBannable.push(`${Guild.name} - No Permissions`);
          }
        }
        const BanEmbed = new EmbedBuilder()
          .setTitle("__Confirmed__")
          .setDescription("The user will be global banned")
          .addFields(
            { name: "__Offenders User ID__", value: target },
            { name: "__Reason for report__", value: userarry[2] },
            { name: "__Proof__", value: proof }
          )
          .setColor(0x00ff00)
          .setFooter({ text: "User Globalban Confirmed" });
        const LogEmbed = {
          title: "Global Ban - " + target,
          description: `Total Guilds: ${Guilds.size}\nBanned from Total Guilds: ${BanSize}`,
          color: 0x00ff00,
          footer: {
            text: `${
              client.users.cache.get(target).tag
            } is banned from ${BanSize} guilds`,
          },
        };
        if (NotBannable.length > 0) {
          LogEmbed.description = `Total Guilds: ${
            Guilds.size
          }\nBanned from Total Guilds: ${BanSize}\nNot Bannable from Total Guilds: ${NotBannable.join(
            ", "
          )}`;
        }

        await client.db.get("global_LogChannel").then(async (ch) => {
          const channel = client.channels.cache.get(ch);
          let msgID = await client.db.get(`msgid.${target}`);
          let msg = await interaction.channel.messages.fetch(msgID);
          const AdminBtnRow = (state) =>
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId(`disabled`)
                .setLabel("Accept")
                .setStyle(ButtonStyle.Success)
                .setDisabled(state),
              new ButtonBuilder()
                .setCustomId(`disabled"`)
                .setLabel("Deny")
                .setStyle(ButtonStyle.Danger)
                .setDisabled(state)
            );
          const ReporterEmbed = new EmbedBuilder()
            .setTitle("__Report Update__")
            .setDescription(
              "Your report was accepted by a global moderator, thanks for making discord a better place."
            )
            .setColor(0x00ff00);
          await msg.edit({ components: [AdminBtnRow(true)] }).then(async () => {
            let ReporterUser = userarry[userarry.length - 1];

            client.users.cache
              .get(ReporterUser)
              .send({ embeds: [ReporterEmbed] })
              .then(() => console.log("<<<<< sent message to Reporter >>>>"))
              .catch((e) => console.error(e));
            channel.send({ embeds: [LogEmbed] });
            await interaction.editReply({ embeds: [BanEmbed] });
          });
        });
      } else if (interaction.customId.startsWith("_Deny.")) {
        const data = interaction.customId.split(".");
        const target = data[1];
        let AdminRole = await client.db.get(`GlobalBan_role`);
        if (!interaction.member.roles.cache.has(AdminRole))
          return interaction.reply({
            content:
              "You are not an admin, you are not allowed to perform this!",
            ephemeral: true,
          });

        const modal = new Modal() // We create a Modal
          .setCustomId(`_Modal.${target}`)
          .setTitle("Global Ban")
          .addComponents(
            new TextInputComponent() // We create a Text Input Component
              .setCustomId("reason")
              .setLabel("Reason")
              .setStyle("LONG") //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
              .setPlaceholder("Write a reason to reject the global ban")
              .setRequired(true)
              .setMinLength(5)
          );
        showModal(modal, {
          client: client, // Client to show the Modal through the Discord API.
          interaction: interaction, // Show the modal with interaction data.
        });
        let msgID = await client.db.get(`msgid.${target}`);
        let msg = await interaction.channel.messages.fetch(msgID);
        const AdminBtnRow = (state) =>
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId(`disabled`)
              .setLabel("Accept")
              .setStyle(ButtonStyle.Success)
              .setDisabled(state),
            new ButtonBuilder()
              .setCustomId(`disabled"`)
              .setLabel("Deny")
              .setStyle(ButtonStyle.Danger)
              .setDisabled(state)
          );
        await msg.edit({ components: [AdminBtnRow(true)] });
      } else {
        return;
      }
    }
    if (interaction.type === InteractionType.ModalSubmit) {
      if (!interaction.customId.startsWith("_Modal.")) return;
      let reason = interaction.fields.getTextInputValue("reason");
      let data = interaction.customId.split(".");
      const target = data[1];
      let proof = await client.db.get(`ban_${target}`);
      let REASON = await client.db.get(`ban_${target}_reason`);
      console.log(target, proof, REASON);
      const BanEmbed = new EmbedBuilder()
        .setTitle("__Denied__")
        .setDescription(
          `The user will not be global banned. for the reason of ${reason}`
        )
        .addFields(
          { name: "__Offenders User ID__", value: target },
          { name: "__Reason for report__", value: REASON },
          { name: "__Proof__", value: proof }
        )
        .setColor(0xff0000);
      await interaction.reply({ embeds: [BanEmbed] });
      const UserEmbed = new EmbedBuilder()
        .setTitle("__Report Update__")
        .setColor(0xff0000)
        .setDescription(
          `Your report was rejected by a global moderator for the reason: ${reason}\nplease make sure to read [global ban guide](${client.config.guide}), when you are ready you may submit another report.`
        );
      let user = await client.db.get(`ban_${target}_USER`);
      client.users.cache.get(user).send({ embeds: [UserEmbed] });
    }
  },
};
