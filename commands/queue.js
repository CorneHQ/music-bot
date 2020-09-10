const { MessageEmbed, splitMessage, escapeMarkdown } = require("discord.js");

module.exports = {
  name: "queue",
  aliases: ["qu"],
  description: "Show the music queue and now playing.",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("There is nothing playing.").catch(console.error);

    const description = queue.songs.map((song, index) => `${index + 1}. ${escapeMarkdown(song.title)}`);

    let queueEmbed = new MessageEmbed()
      .setTitle("Music Queue")
      .setDescription(description)
      .setColor("#7FFF00")
      queueEmbed.setFooter("Cubes Music", "https://cdn.discordapp.com/avatars/719070176716259349/08dd246df93c6c59934416d0d658873a.png?size=256")
      queueEmbed.setTimestamp();
      queueEmbed.setAuthor("Cubes Music", "https://cdn.discordapp.com/avatars/719070176716259349/08dd246df93c6c59934416d0d658873a.png?size=256")
    const splitDescription = splitMessage(description, {
      maxLength: 2048,
      char: "\n",
      prepend: "",
      append: ""
    });

    splitDescription.forEach(async (m) => {
      queueEmbed.setDescription(m);
      message.channel.send(queueEmbed);
    });
  }
};