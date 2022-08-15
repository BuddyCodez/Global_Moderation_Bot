const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("gb-report")
    .setDescription("Reports a user for a global ban")
    .addStringOption((option) =>
      option
        .setName("user_id")
        .setDescription("provide a user id for global ban report")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("provide a reason for global ban report")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("proof").setDescription("link of Proof").setRequired(true)
    ),

  async execute(interaction, client) {
    if (!client.cooldowns.has(interaction.user.id)) {
      // cooldown not ended
      const string = (option) => interaction.options.getString(option);
      if (interaction.user.id === string("user_id")) return interaction.reply({ content: "You cant report your self for global ban!" });
      const conformationEmbed = new EmbedBuilder()
        .setTitle("__Confirmation__")
        .setDescription("Are you sure you want to report this user?")
        .addFields(
          { name: "__Offenders User ID__", value: string("user_id") },
          { name: "__Reason for report__", value: string("reason") },
          { name: "__Proof__", value: string("proof") }
        )
        .setColor(0xffff00)
        .setFooter({
          text: "Pending Confirmation",
        });
      let user = await client.users.fetch(string("user_id"));
      if (!user)
        return interaction.reply({ content: "Provided User id is not found" });
      if (user.bot)
        return interaction.reply({ content: "Provided User id is bot" });
 
  

      // button options
      const row = (state) =>
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`Accept_${interaction.user.id}`)
            .setLabel("Confirm")
            .setStyle(ButtonStyle.Success)
            .setDisabled(state),
          new ButtonBuilder()
            .setCustomId(`Deny_${interaction.user.id}`)
            .setLabel("Deny")
            .setStyle(ButtonStyle.Danger)
            .setDisabled(state)
        );
      interaction.reply({
        content: `**${interaction.user}**`,
        embeds: [conformationEmbed],
        components: [row(false)],
      }).then(async (msg) => {
        let id = msg.id
        console.log(id)
        await client.db.set(
          `reports_${interaction.user.id}_user`,
          string("user_id")
        );
        await client.db.set(
          `reports_${interaction.user.id}_reason`,
          string("reason")
        );
        await client.db.set(
          `reports_${interaction.user.id}_proof`,
          string("proof")
        );
        await client.db.set(`reports_${interaction.user.id}_msg`, id);
      }).catch((err) => {
        console.error(err);
      });
      const filter = (i) =>
       ( i.customId === `Accept_${interaction.user.id}`) ||
        (i.customId === `Deny_${interaction.user.id}`);

      const collector = interaction.channel.createMessageComponentCollector({
        componentType: ComponentType.Button,
        filter,
        time: 120000,
      });

      collector.on("collect", async (i) => {
        if (i.user.id !== interaction.user.id) return i.reply({
          content: `These buttons aren't for you!`,
          ephemeral: true,
        });
          if (i.customId === `Accept_${i.user.id}`) {
            let ActionEmbed = new EmbedBuilder()
              .setTitle("__Action Confirmed__")
              .setDescription("i have successfully sent the report!")
              .addFields(
                { name: "__Offenders User ID__", value: string("user_id") },
                { name: "__Reason for report__", value: string("reason") },
                { name: "__Proof__", value: string("proof") }
              )
              .setColor(0x00ff00)
              .setFooter({
                text: "Your report has successfully been sent!",
              });
            i
              .reply({
                content: `<@${interaction.user.id}>`,
                embeds: [ActionEmbed],
              })
              .then(async () => {
                let Logch = await client.db.get("global_ReportChannel");
                let channel = client.channels.cache.get(Logch);
                if (!channel)
                  return i.reply({
                    content:
                      "Global Log Channel is not found\n Ask Owner to setup the Bot!",
                  });
                const AdminEmbed = new EmbedBuilder()
                  .setTitle("__Confirmation__")
                  .setDescription(
                    "Hello bot admins, a new Report has been Submitted. Please review and either approve or deny it."
                  )
                  .addFields(
                    { name: "__Offenders User ID__", value: string("user_id") },
                    { name: "__Reason for report__", value: string("reason") },
                    { name: "__Proof__", value: string("proof") }
                  )
                  .setColor(0xffff00)
                  .setFooter({
                    text: "Pending Confirmation",
                  });
                const AdminBtnRow = (state) =>
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId(
                        `_Accept.${string("user_id")}.${string(
                          "reason"
                        )}.${interaction.user.id}`
                      )
                      .setLabel("Accept")
                      .setStyle(ButtonStyle.Success)
                      .setDisabled(state),
                    new ButtonBuilder()
                      .setCustomId(
                        `_Deny.${string("user_id")}.${string(
                          "reason"
                        )}.${interaction.user.id}`
                      )
                      .setLabel("Deny")
                      .setStyle(ButtonStyle.Danger)
                      .setDisabled(state)
                  );

                channel.send({
                  embeds: [AdminEmbed],
                  components: [AdminBtnRow(false)],
                }).then(async (msg) => {
                   await client.db.set(
                     `ban_${string("user_id")}`,
                     string("proof")
                   );
                   await client.db.set(
                     `ban_${string("user_id")}_reason`,
                     string("reason")
                   );
                   await client.db.set(
                     `ban_${string("user_id")}_USER`,
                     interaction.user.id
                   );
                  let messageID = msg.id;
                  await client.db.set(`msgid.${string("user_id")}`,messageID);
                })
              });
          } else {
            let ActionEmbed = new EmbedBuilder()
              .setTitle("__Action Cancelled__")
              .setDescription("ok, i have not sent the report.")
              .addFields(
                { name: "__Offenders User ID__", value: string("user_id") },
                { name: "__Reason for report__", value: string("reason") },
                { name: "__Proof__", value: string("proof") }
              )
              .setColor(0xff0000)
              .setFooter({
                text: "Your report was not sent!",
              });
            i.followUp({
              content: `<@${interaction.user.id}>`,
              embeds: [ActionEmbed],
            }).then(async (msg) => {
                 await client.db.set(
                   `ban_${string("user_id")}`,
                   string("proof")
                 );
                 await client.db.set(
                   `ban_${string("user_id")}_reason`,
                   string("reason")
                 );
                 await client.db.set(
                   `ban_${string("user_id")}_USER`,
                   interaction.user.id
                 );
            });
          }
        await interaction.editReply({ components: [row(true)] });

      });
      collector.on("end", async (i) =>
        await interaction.editReply({ components: [row(true)] })
      );
       client.cooldowns.set(interaction.user.id, true);

       // After the time you specified, remove the cooldown
       setTimeout(() => {
         client.cooldowns.delete(interaction.user.id);
       }, client.COOLDOWN_SECONDS * 1000);
    } else {
       interaction.reply({
         content: "Please wait for cooldown to end",
         ephemeral: true,
       });
       
    }
  },
};
