const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { PermissionsBitField } = require("discord.js");
const { Buttons } = require("./Buttons");
async function ButtonHandler(interaction, client) {
  if (interaction.isButton()) {
    const { user, guild, member} = interaction;
    if (interaction.customId.startsWith(`loop`)) {
      const User = interaction.customId.split("_")[1];
      if (
        !member.permissions.has(PermissionsBitField.Flags.ManageGuild) &&
        user.id !== User
      )
        return interaction.reply({
          content: "You cant do that!",
          ephemeral: true,
        });

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
      const embed = new EmbedBuilder()
        .setDescription(`<a:tick:1012933003120476181> Looping the Queue Now!`)
        .setColor(0xff0019)
        .setFooter({
          text: `Requested by ${user.tag}`,
          iconURL: user.avatarURL(),
        });
      interaction.reply({ embeds: [embed] });
      player.QueueRepeat();
      let data = await client.music.get(User);
      console.log(data);
      let channel = client.channels.cache.get(player.textChannel);
      let message = await channel.messages.fetch(data[0]);
      message.edit({
        components: [
          Buttons(
            data[1],
            data[2],
            user,
            "1008039569725345833",
            `newLoop_${user.id}`
          ),
        ],
      });
    }
    if (interaction.customId.startsWith(`newLoop`)) {
        const User = interaction.customId.split("_")[1];
        console.log(
          !member.permissions.has(PermissionsBitField.Flags.ManageGuild) &&
            user.id !== User
        );
        if (
          !member.permissions.has(PermissionsBitField.Flags.ManageGuild) &&
          user.id !== User
        )
          return interaction.reply({
            content: "You cant do that!",
            ephemeral: true,
          });
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
         const embed = new EmbedBuilder()
           .setDescription(
             `<a:tick:1012933003120476181> Loop is Disabled!`
           )
           .setColor(0xff0019)
           .setFooter({
             text: `Requested by ${user.tag}`,
             iconURL: user.avatarURL(),
           });
         interaction.reply({ embeds: [embed] });
         player.DisableRepeat();
      let data = await client.music.get(User);
         let channel = client.channels.cache.get(player.textChannel);
      let message = await channel.messages.fetch(data[0]);
       await client.music.set(`${user.id}_buttons`, [
         "1008039572019626074",
         `loop_${user.id}`,
       ]);
         message.edit({
           components: [
             Buttons(
               data[1],
               data[2],
               user,
               "1008039572019626074",
               `loop_${user.id}`
             ),
           ],
         });
    }
    if (interaction.customId.startsWith(`pause`)) {
         const User = interaction.customId.split("_")[1];
         if (
           !member.permissions.has(PermissionsBitField.Flags.ManageGuild) &&
           user.id !== User
         )
           return interaction.reply({
             content: "You cant do that!",
             ephemeral: true,
           });
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
      const embed = new EmbedBuilder()
        .setDescription(`<a:tick:1012933003120476181> Pausing Player!`)
        .setColor(0xff0019)
        .setFooter({
          text: `Requested by ${user.tag}`,
          iconURL: user.avatarURL(),
        });
      interaction.reply({ embeds: [embed] });
      player.pause();
     let data = await client.music.get(User);
     console.log(data);
     let channel = client.channels.cache.get(player.textChannel);
     let message = await channel.messages.fetch(data[0]);
     message.edit({
       components: [
         Buttons(
           data[1],
           data[2],
           user,
           null,
           null,
           "1006535959585767495",
           `playSong_${user.id}`
         ),
       ],
     });
    }
    if (interaction.customId.startsWith(`playSong`)) {
       const User = interaction.customId.split("_")[1];
       if (
         !member.permissions.has(PermissionsBitField.Flags.ManageGuild) &&
         user.id !== User
       )
         return interaction.reply({
           content: "You cant do that!",
           ephemeral: true,
         });
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
      const embed = new EmbedBuilder()
        .setDescription(`<a:tick:1012933003120476181> Resuming Player!`)
        .setColor(0xff0019)
        .setFooter({
          text: `Requested by ${user.tag}`,
          iconURL: user.avatarURL(),
        });
      interaction.reply({ embeds: [embed] });
      player.pause(false);
      let data = await client.music.get(User);
      console.log(data);
      let channel = client.channels.cache.get(player.textChannel);
      let message = await channel.messages.fetch(data[0]);
      message.edit({
        components: [
          Buttons(
            data[1],
            data[2],
            user,
            null,
            null,
            "1012756648433025034",
            null
          ),
        ],
      });
    }
    if (interaction.customId.startsWith("stop")) {
       const User = interaction.customId.split("_")[1];
       if (
         !member.permissions.has(PermissionsBitField.Flags.ManageGuild) &&
         user.id !== User
       )
         return interaction.reply({
           content: "You cant do that!",
           ephemeral: true,
         });
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
         const embed = new EmbedBuilder()
           .setDescription(`<a:tick:1012933003120476181> Stopping Player!`)
           .setColor(0xff0019)
           .setFooter({
             text: `Requested by ${user.tag}`,
             iconURL: user.avatarURL(),
           });
      interaction.reply({ embeds: [embed] });
      player.destroy();
      let data = await client.music.get(User);
      console.log(data);
      let channel = client.channels.cache.get(player.textChannel);
      let message = await channel.messages.fetch(data[0]);
      await message.delete().catch(e => console.error)
    }
    if (interaction.customId.startsWith("forward")) {
       const User = interaction.customId.split("_")[1];
       if (
         !member.permissions.has(PermissionsBitField.Flags.ManageGuild) &&
         user.id !== User
       )
         return interaction.reply({
           content: "You cant do that!",
           ephemeral: true,
         });
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
               const embed = new EmbedBuilder()
                 .setDescription(
                   `<a:tick:1012933003120476181> Skipping Song`
                 )
                 .setColor(0xff0019)
                 .setFooter({
                   text: `Requested by ${user.tag}`,
                   iconURL: user.avatarURL(),
                 });
      interaction.reply({ embeds: [embed] });
      player.stop();
    }
    if (interaction.customId.startsWith("backward")) {
       const User = interaction.customId.split("_")[1];
       if (
         !member.permissions.has(PermissionsBitField.Flags.ManageGuild) &&
         user.id !== User
       )
         return interaction.reply({
           content: "You cant do that!",
           ephemeral: true,
         });
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
      const embed = new EmbedBuilder()
        .setDescription(`<a:tick:1012933003120476181> Playing Previous Song`)
        .setColor(0xff0019)
        .setFooter({
          text: `Requested by ${user.tag}`,
          iconURL: user.avatarURL(),
        });
      interaction.reply({ embeds: [embed] });
      const track = player.previousTrack;
      player.queue.add(track);
      player.stop();
    }
  }
}
module.exports = { ButtonHandler };
