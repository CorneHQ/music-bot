const { play } = require("../include/play");
const { YOUTUBE_API_KEY, SOUNDCLOUD_CLIENT_ID } = require("../config.json");
const ytdl = require("ytdl-core");
const YouTubeAPI = require("simple-youtube-api");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);
const scdl = require("soundcloud-downloader");
const { Client, Collection, MessageEmbed } = require("discord.js");
const client = new Client({ disableMentions: "everyone" });
module.exports = {
  name: "play",
  cooldown: 3,
  aliases: ["p"],
  description: "Plays audio from YouTube or Soundcloud",
    
  async execute(message, args) {
    const { channel } = message.member.voice;
    function delay(delayInms) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(2);
        }, delayInms);
      });
    }
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!channel) return message.reply("You need to join a voice channel first!").catch(console.error);
    if (serverQueue && channel !== message.guild.me.voice.channel)
      return message.reply(`You must be in the same channel as ${message.client.user}`).catch(console.error);

    if (!args.length)
      return message
        .reply(`Usage: ${message.client.prefix}play <YouTube URL | Video Name | Soundcloud URL>`)
        .catch(console.error);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))
      return message.reply("Cannot connect to voice channel, missing permissions");
    if (!permissions.has("SPEAK"))
      return message.reply("I cannot speak in this voice channel, make sure I have the proper permissions!");

    const search = args.join(" ");
    const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
    const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
    const scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
    const url = args[0];
    const urlValid = videoPattern.test(args[0]);

    // Start the playlist if playlist url was provided
    if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
      return message.client.commands.get("playlist").execute(message, args);
    }

    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: 100,
      playing: true
    };

    let songInfo = null;
    let song = null;

    if (urlValid) {
      try {
        songInfo = await ytdl.getInfo(url);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          subs: songInfo.videoDetails.author.subscriber_count,
          thumbnail: songInfo.videoDetails.thumbnail.thumbnails[4],
          duration: songInfo.videoDetails.lengthSeconds,
          author: songInfo.videoDetails.author.name,
          authorurl: songInfo.videoDetails.author.user_url,
        };
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
    } else if (scRegex.test(url)) {
      try {
        const trackInfo = await scdl.getInfo(url, SOUNDCLOUD_CLIENT_ID);
        song = {
          title: trackInfo.title,
          url: trackInfo.permalink_url,
          duration: trackInfo.duration / 1000
        };
      } catch (error) {
        if (error.statusCode === 404)
          return message.reply("Could not find that Soundcloud track.").catch(console.error);
        return message.reply("There was an error playing that Soundcloud track.").catch(console.error);
      }
    } else {
      try {
        const results = await youtube.searchVideos(search, 1);
        songInfo = await ytdl.getInfo(results[0].url);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          subs: songInfo.videoDetails.author.subscriber_count,
          thumbnail: songInfo.videoDetails.thumbnail.thumbnails[4],
          duration: songInfo.videoDetails.lengthSeconds,
          author: songInfo.videoDetails.author.name,
          authorurl: songInfo.videoDetails.author.user_url,
        };
      } catch (error) {
        console.error(error);
        return message.reply("No video was found with a matching title").catch(console.error);
      }
    }
    let thumb ="https://www.messagetech.com/wp-content/themes/ml_mti/images/no-image.jpg"
    if(song.thumbnail===undefined) thumb= "https://www.messagetech.com/wp-content/themes/ml_mti/images/no-image.jpg";
    else thumb = song.thumbnail.url;
    if (serverQueue) {
      serverQueue.songs.push(song);
       const newsong = new MessageEmbed()
      .setTitle(`**${song.title}**`)
      .setAuthor("Cubes Music", "https://cdn.discordapp.com/avatars/719070176716259349/08dd246df93c6c59934416d0d658873a.png?size=256")
      .setColor("#7FFF00")
      .setThumbnail(thumb)
      .setTimestamp()
      .setURL(song.url)
      .setFooter("Cubes Music", "https://cdn.discordapp.com/avatars/719070176716259349/08dd246df93c6c59934416d0d658873a.png?size=256")
      .setDescription(`\nRequested by **\`${message.author.username}\`**(${message.author})! 😃`)
      .addField("Duration:",`\`${song.duration} Sekunden\``,true)
      .addField("\u200b",`\u200b`,true)
      .addField("Author:",` [\`${song.author} (${song.subs} Subs)\`](${song.authorurl})`,true)
    
      let lmao = await serverQueue.textChannel
        .send(newsong)
        .catch(console.error);
        await lmao.react("✅");
return;
    }

    queueConstruct.songs.push(song);
    message.client.queue.set(message.guild.id, queueConstruct);

    try {
      queueConstruct.connection = await channel.leave();
      await delay(400);
      queueConstruct.connection = await channel.join();
      await queueConstruct.connection.voice.setSelfDeaf(true);
      play(queueConstruct.songs[0], message);     
    } catch (error) {
      console.error(error);
      message.client.queue.delete(message.guild.id);
      await channel.leave();
      return message.channel.send(`Could not join the chann el: ${error}`).catch(console.error);
    }
  }
};