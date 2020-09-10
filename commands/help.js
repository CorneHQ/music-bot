  const { MessageEmbed } = require("discord.js");

  const { TOKEN, PREFIX } = require("./../config.json");
  let prefix = PREFIX;
  module.exports = {
    name: "help",
    aliases: ["h"],
    description: "Display all commands and descriptions",
    execute(message) {
      let commands = message.client.commands.array();

      let helpEmbed = new MessageEmbed()
        .setTitle("Commands List")
        .setColor("#7FFF00")
        helpEmbed.setAuthor("Cubes Music", "https://cdn.discordapp.com/avatars/719070176716259349/08dd246df93c6c59934416d0d658873a.png?size=256")

      .setFooter("Cubes Music", "https://cdn.discordapp.com/avatars/719070176716259349/08dd246df93c6c59934416d0d658873a.png?size=256")
      commands.forEach((cmd) => {
        helpEmbed.addField(
          `**${prefix}${cmd.name} ${cmd.aliases ? `(${cmd.aliases})` : ""}**`,
          `${cmd.description}`,
          true
        );
      });
      helpEmbed.setFooter('Cubes Music', 'https://cdn.discordapp.com/avatars/719070176716259349/08dd246df93c6c59934416d0d658873a.png?size=256' )
      helpEmbed.setTimestamp();

      return message.channel.send(helpEmbed).catch(console.error);
    }
  };
