const createBar = require("string-progressbar");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "nowplaying",
aliases: ['np'],
  description: "Show now playing song",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("There is nothing playing.").catch(console.error);
    const song = queue.songs[0];
    const seek = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000;
    const left = song.duration - seek;

    let nowPlaying = new MessageEmbed()
      .setTitle("Now playing")
      .setDescription(`${song.title}\n${song.url}`)
      .setColor("#7FFF00")
      .setAuthor("Cubes Music", "https://cdn.discordapp.com/avatars/719070176716259349/08dd246df93c6c59934416d0d658873a.png?size=256")
      .addField("\u200b", new Date(seek * 1000).toISOString().substr(11, 8) + "[" + createBar((song.duration == 0 ? seek : song.duration), seek, 20)[0] + "]" + (song.duration == 0 ? " ◉ LIVE" : new Date(song.duration * 1000).toISOString().substr(11, 8)), false);
      nowPlaying.setTimestamp()
    nowPlaying.setFooter("Cubes Music", "https://cdn.discordapp.com/avatars/719070176716259349/08dd246df93c6c59934416d0d658873a.png?size=256")
    if (song.duration > 0) nowPlaying.setFooter("Time Remaining: " + new Date(left * 1000).toISOString().substr(11, 8));

    return message.channel.send(nowPlaying);
  }
};
