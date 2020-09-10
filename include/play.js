const ytdlDiscord = require("ytdl-core-discord");
const scdl = require("soundcloud-downloader");
const { canModifyQueue } = require("../util/CubesUtil");
const { Client, Collection, MessageEmbed } = require("discord.js");
module.exports = {
  async play(song, message) {
    const { PRUNING, SOUNDCLOUD_CLIENT_ID } = require("../config.json");
    const queue = message.client.queue.get(message.guild.id);

    if (!song) {
      queue.channel.leave();
      message.client.queue.delete(message.guild.id);
        const endembed = new MessageEmbed().setColor("#ff0000").setAuthor(`🚫 Music queue ended.`, "https://cdn.discordapp.com/attachments/748633941912584333/753201788060172408/1f6ab.png")
      return queue.textChannel.send(endembed).catch(console.error);
    }

    let stream = null;
    let streamType = song.url.includes("youtube.com") ? "opus" : "ogg/opus";

    try {
      if (song.url.includes("youtube.com")) {
        stream = await ytdlDiscord(song.url, { highWaterMark: 1 << 25 });
      } else if (song.url.includes("streams.ilovemusic.de")) {
        stream = song.url;
      }else if (song.url.includes("soundcloud.com")) {
        try {
          stream = await scdl.downloadFormat(song.url, scdl.FORMATS.OPUS, SOUNDCLOUD_CLIENT_ID ? SOUNDCLOUD_CLIENT_ID : undefined);
        } catch (error) {
          stream = await scdl.downloadFormat(song.url, scdl.FORMATS.MP3, SOUNDCLOUD_CLIENT_ID ? SOUNDCLOUD_CLIENT_ID : undefined);
          streamType = "unknown";
        }
      }
    } catch (error) {
      if (queue) {
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      }

      console.error(error);
      return message.channel.send(`Error: ${error.message ? error.message : error}`);
    }

    queue.connection.on("disconnect", () => message.client.queue.delete(message.guild.id));

    const dispatcher = queue.connection
      .play(stream, { type: streamType })
      .on("finish", () => {
        if (collector && !collector.ended) collector.stop();

        if (queue.loop) {
          let lastSong = queue.songs.shift();
          queue.songs.push(lastSong);
          module.exports.play(queue.songs[0], message);
        } else {
          queue.songs.shift();
          module.exports.play(queue.songs[0], message);
        }
      })
      .on("error", (err) => {
        console.error(err);
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      });
    dispatcher.setVolumeLogarithmic(queue.volume / 100);
    let thumb ="https://www.messagetech.com/wp-content/themes/ml_mti/images/no-image.jpg"
    if(song.thumbnail===undefined) thumb= "https://www.messagetech.com/wp-content/themes/ml_mti/images/no-image.jpg";
    else thumb = song.thumbnail.url;
    try {
        console.log(song.url);
     const newsong = new MessageEmbed()
      .setTitle(`**${song.title}**`)
      .setAuthor("Cubes Music", "https://cdn.discordapp.com/avatars/719070176716259349/08dd246df93c6c59934416d0d658873a.png?size=256")
      .setColor("#7FFF00")
      .setThumbnail(thumb)
      .setTimestamp()
      .setImage(thumb)
      .setFooter("Cubes Music", "https://cdn.discordapp.com/avatars/719070176716259349/08dd246df93c6c59934416d0d658873a.png?size=256")
      .setDescription(`\nRequested by **\`${message.author.username}\`**(${message.author})! 😃`)
      .addField("Duration:",`\`${song.duration} Seconds\``,true)
      .addField("\u200b",`\u200b`,true)
      .addField("Author:",` [\`${song.author} (${song.subs} Subs)\`](${song.authorurl})`,true)
      .addField("\u200b",`*⏭ | Skip*\n*⏯ | Pause/Resume*\n*🔁 | Loop on/off*\n*⏹ | Stop*`);
      var playingMessage = await queue.textChannel.send(newsong);
      await playingMessage.react("⏭");
      await playingMessage.react("⏯");
      await playingMessage.react("🔁");
      await playingMessage.react("⏹");
    } catch (error) {
      console.error(error);
    }

    const filter = (reaction, user) => user.id !== message.client.user.id;
    var collector = playingMessage.createReactionCollector(filter, {
      time: song.duration > 0 ? song.duration * 1000 : 600000
    });

    collector.on("collect", (reaction, user) => {
      if (!queue) return;
      const member = message.guild.member(user);

       switch (reaction.emoji.name) {
        case "⏭":
          queue.playing = true;
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.connection.dispatcher.end();
          const skipembed = new MessageEmbed().setColor("#ff0000").setAuthor(`${user.username} ⏩ skipped the song.`, "https://cdn.discordapp.com/attachments/748633941912584333/753201474691137647/next.png")
          queue.textChannel.send(skipembed).catch(console.error);
       
          collector.stop();
          break;

        case "⏯":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          if (queue.playing) {
            queue.playing = !queue.playing;
            queue.connection.dispatcher.pause(true);
            const pausemebed = new MessageEmbed().setColor("#ff0000").setAuthor(`${user.username} ⏸ paused the music.`, "https://cdn.discordapp.com/attachments/738022833728389160/753207811311272047/pause-button-png-29672.png")
            queue.textChannel.send(pausemebed).catch(console.error);
          } else {
            queue.playing = !queue.playing;
            queue.connection.dispatcher.resume();
            const playembed = new MessageEmbed().setColor("#ff0000").setAuthor(`${user.username} ▶ resumed the music!`, "https://cdn.discordapp.com/attachments/748633941912584333/753200968182792242/video-play-icon-6.png")
            queue.textChannel.send(playembed).catch(console.error);
          }
          break;

        case "🔁":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.loop = !queue.loop;
          const loopembed = new MessageEmbed().setColor("#ff0000").setAuthor(`Loop is now ${queue.loop ? " on" : " off"}`, "https://cdn.discordapp.com/attachments/738022833728389160/753209000392261702/giphy.gif")
          queue.textChannel.send(loopembed).catch(console.error);
          break;

        case "⏹":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.songs = [];
          const stopembed = new MessageEmbed().setColor("#ff0000").setAuthor(`${user.username} ⏹ stopped the music!`, "https://cdn.discordapp.com/attachments/748633941912584333/753200132362731600/1200px-STOP_F.png")
          queue.textChannel.send(stopembed).catch(console.error);
          try {
            queue.connection.dispatcher.end();
          } catch (error) {
            console.error(error);
            queue.connection.disconnect();
          }
          collector.stop();
          break;

        default:
          reaction.users.remove(user).catch(console.error);
          break;
      }
    });

    collector.on("end", () => {
      playingMessage.reactions.removeAll().catch(console.error);
      if (PRUNING && playingMessage && !playingMessage.deleted) {
        playingMessage.delete({ timeout: 3000 }).catch(console.error);
      }
    });
  }
};