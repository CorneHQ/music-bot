/**
   * Module Imports
   */
  const { Client, Collection } = require("discord.js");
  const { readdirSync } = require("fs");
  const { join } = require("path");
  const { TOKEN, PREFIX } = require("./config.json");
  const discord = require("discord.js");
  const Discord = require("discord.js");
  const { MessageEmbed } = require("discord.js");
  const client = new Client({ disableMentions: "everyone" });
  let a = client.guilds.cache.size;
  let c = client.guilds.cache.reduce((c, g) => c + g.memberCount, 0);
  let b = c;
  client.login(TOKEN);
  client.commands = new Collection();
  client.prefix = PREFIX;
  client.queue = new Map();
  const cooldowns = new Collection();
  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const talkedRecently = new Set();
  /**
   * Client Events
   */
  client.on("ready", () => {
  let i = 0;
    console.log("Client successfully started the engine");

    setInterval(() => {
      const activities_list = [
        "Cubes.host Music",
        `cm!help`,
        "Order your service @ cubes.host"
      ];
      const index = Math.floor(i);
      client.user.setActivity(activities_list[index], {
        type: "PLAYING",
      });

      i = i + 1;
      if (i == activities_list.length) {
        i = i - activities_list.length;
      }
    }, 15000);
    console.log(`${client.user.username} ready!`);
  });
  client.on("warn", (info) => console.log(info));
  client.on("error", console.error);

  /**
   * Import all commands
   */
  const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(join(__dirname, "commands", `${file}`));
    client.commands.set(command.name, command);
  }
  const queue = new Map();
  client.on("message", async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;
    if(message.channel.type === "dm") return;
    const serverQueue = queue.get(message.guild.id);

    if (message.content.startsWith(`cm!radio`)) {
      const args = message.content.split(" ");
        let Radio1 = "Standard-Radio https://streams.ilovemusic.de/iloveradio14.mp3";
        let Radio2 = "Chart-Radio https://streams.ilovemusic.de/iloveradio9.mp3";
        let Radio3 = "Chill-Radio https://streams.ilovemusic.de/iloveradio17.mp3";
        let Radio4 = "Dance-Radio https://streams.ilovemusic.de/iloveradio2.mp3";
        let Radio5 = "Deutsch-Rap-Radio https://streams.ilovemusic.de/iloveradio6.mp3";
        let Radio6 = "Greatest-hits-Radio https://streams.ilovemusic.de/iloveradio16.mp3";
        let Radio7 = "Hip-hop-Radio https://streams.ilovemusic.de/iloveradio3.mp3";
        let Radio8 = "Party-Radio https://streams.ilovemusic.de/iloveradio14.mp3";
        let Radio9 = "Us-Rap-Radio https://streams.ilovemusic.de/iloveradio13.mp3";
        let Radio10 = "X-Mas-Radio https://streams.ilovemusic.de/iloveradio8.mp3";
        let Radio11 = "Top-Radio http://loadbalancing.topradio.be/topradio.mp3"; //australia
        let Radio12 = "88.6-Radio http://radio886.at/streams/radio_88.6/mp3"; //austria
        let Radio13 = "Kronehit-Radio http://onair.krone.at/kronehit.mp3"; //austria
        let Radio14 = "Greatest-hits-Radio https://stream-mz.planetradio.co.uk/net2national.mp3"; //britten
        let Radio15 = "Absolut-Radio http://icy-e-bab-02-gos.sharp-stream.com/absoluteradio.mp3";//britten
        let Radio16 = "Absolut-70s-Radio http://ais.absoluteradio.co.uk/absolute70s.mp3";//britten
        let Radio17 = "Absolut-80s-Radio http://ais.absoluteradio.co.uk/absolute80s.mp3";//britten
        let Radio18 = "Absolut-90s-Radio http://ais.absoluteradio.co.uk/absolute90s.mp3";//britten
        let Radio19 = "Absolut-2000s-Radio http://ais.absoluteradio.co.uk/absolute00s.mp3";//britten
        let Radio20 = "Absolut-Classic-Rock-Radio http://icy-e-bab-04-cr.sharp-stream.com/absoluteclassicrock.mp3";//britten
        let Radio21 = "NRJ-Radio http://cdn.nrjaudio.fm/audio1/fr/30001/mp3_128.mp3";//france
        let Radio22 = "Radio-France-Radio http://direct.fipradio.fr/live/fip-midfi.mp3";//france
        let Radio23 = "Rai-Radio http://icestreaming.rai.it:80/1.mp3";//italy
        let Radio24 = "Veronica-Radio http://icestreaming.rai.it:80/2.mp3";//italy
        let Radio25 = "ERR-Radio http://icecast.err.ee:80/vikerraadio.mp3";//Estonia
        let Radio26 = "Tallin-Radio http://icecast.err.ee:80/raadiotallinn.mp3";//Estonia
        let Radio27 = "Color-Music-Radio http://icecast8.play.cz/color128.mp3";//Spain
        let Radio28 = "Helax-93.7-Radio http://ice.abradio.cz:8000/helax128.mp3";//Spain
        let Radio29 = "Český-rozhlas-Radio http://icecast6.play.cz/cro2-128.mp3";//Czech
        let Radio30 = "Spin-Radio http://icecast4.play.cz/spin128.mp3";//Czech
        let Radio31= "BB-Radio http://icecast.omroep.nl/radio1-bb-mp3";//netherlands
        let Radio32 = "538-Radio http://21223.live.streamtheworld.com/RADIO538.mp3";//netherlands
        let resultsEmbed = new MessageEmbed()
        .setTitle(`**Available Radio Stations**`)//
        .setDescription(`Radio Stations: \n**1:  ** \`Radio\`\n**2:  ** \`Charts\`\n**3:  ** \`Chill\`\n**4:  ** \`Dance\`\n**5:  ** \`Deutsch-Rap\`\n**6:  ** \`Greatest hits\`\n**7:  ** \`Hip hop\`\n**8:  ** \`Party\`\n**9:  ** \`US-Rap\`\n**10: ** \`X-Mas\`\n\n ***AUSTRALIA RADIO:***\n**11: ** \`Top-Radio\`\n\n ***AUSTRIA RADIO:***\n**12: ** \`88.6\`\n**13: ** \`Kronehit\`\n\n***British RADIO:***\n**14: ** \`Greatest Hits\`\n**15: ** \`Absolut Radio\`\n**16: ** \`Absolut 70s\`\n**17: ** \`Absolut 80s\`\n**18: ** \`Absolut-90s\`\n**19: ** \`Absolut-2000s\`\n**20: ** \`Absolut Classic Rock\`\n\n***France RADIO:***\n**21: ** \`NRJ\`\n**22: ** \`Radio-France\`\n\n***Italy RADIO:***\n**23: ** \`Rai Radio\`\n**24: ** \`Veronica-Radio\`\n\n***Estonia RADIO:***\n**25: ** \`ERR Radio\`\n**26: ** \`Tallin  \`\n\n***Spain RADIO:***\n**27: ** \`Color-Music\`\n**28: ** \`Helax-93.7\`\n\n***Czech RADIO:***\n**29: ** \`Český-rozhlas\`\n**30: ** \`Spin-Radio\`\n\n***Netherlands RADIO:***\n**31: ** \`BB-Radio\`\n**32: ** \`538-Radio\`\n\n\n**Type:** \`cm!radio <1-32>\`\n`)
        .setColor("#7FFF00");
        resultsEmbed.setFooter("Cubes Music", "https://cdn.discordapp.com/avatars/719070176716259349/08dd246df93c6c59934416d0d658873a.png?size=256")
          resultsEmbed.setTimestamp();
        resultsEmbed.setAuthor("Cubes Music", "https://cdn.discordapp.com/avatars/719070176716259349/08dd246df93c6c59934416d0d658873a.png?size=256")
        if(args[1] == null) return message.channel.send(resultsEmbed);
         if(args[1] == "1" || args[1] == "Standard" || args[1] == "standard")
        return radioexecute(message, serverQueue, Radio1);		
        if(args[1] == "2"|| args[1] == "Chart"|| args[1] == "chart"|| args[1] == "Charts"|| args[1] == "charts")	
        return radioexecute(message, serverQueue, Radio2);
        if(args[1] == "3"|| args[1] == "Chill" || args[1] == "chill")	
        return radioexecute(message, serverQueue, Radio3);
        if(args[1] == "4"|| args[1] == "Dance"|| args[1] == "dance")	
        return radioexecute(message, serverQueue, Radio4);
        if(args[1] == "5"|| args[1] == "Deutsch-Rap"|| args[1] == "deutsch-rap"|| args[1] == "deutsch-Rap"|| args[1] == "Deutsch-rap")	
        return radioexecute(message, serverQueue, Radio5);
        if(args[1] == "6" || args[1] == "Greatest-Hits" || args[1] == "greatest-hits"|| args[1] == "Greatest-hits"|| args[1] == "greatest-Hits")	
        return radioexecute(message, serverQueue, Radio6);
        if(args[1] == "7"|| args[1] == "Hip-Hop"|| args[1] == "hip-hop"|| args[1] == "Hip-hop"|| args[1] == "hip-Hop")	
        return radioexecute(message, serverQueue, Radio7);
        if(args[1] == "8"|| args[1] == "Party"|| args[1] == "party")	
        return radioexecute(message, serverQueue, Radio8);
        if(args[1] == "9"|| args[1] == "Us-Rap"|| args[1] == "us-rap"|| args[1] == "us-Rap"|| args[1] == "Us-rap")	
        return radioexecute(message, serverQueue, Radio9);
        if(args[1] == "10"|| args[1] == "X-Mas"|| args[1] == "x-Mas"|| args[1] == "X-mas"|| args[1] == "x-mas")	
        return radioexecute(message, serverQueue, Radio10);
        if(args[1] == "11")	
        return radioexecute(message, serverQueue, Radio11);
        if(args[1] == "12"||args[1] == "88.6")	
        return radioexecute(message, serverQueue, Radio12);
        if(args[1] == "13"||args[1] == "kronehit")	
        return radioexecute(message, serverQueue, Radio13);
        if(args[1] == "14")	
        return radioexecute(message, serverQueue, Radio14);
        if(args[1] == "15")	
        return radioexecute(message, serverQueue, Radio15);
        if(args[1] == "16")	
        return radioexecute(message, serverQueue, Radio16);
        if(args[1] == "17")	
        return radioexecute(message, serverQueue, Radio17);
        if(args[1] == "18")	
        return radioexecute(message, serverQueue, Radio18);
        if(args[1] == "19")	
        return radioexecute(message, serverQueue, Radio19);
        if(args[1] == "20")	
        return radioexecute(message, serverQueue, Radio20);
        if(args[1] == "21")	
        return radioexecute(message, serverQueue, Radio21);
        if(args[1] == "22")	
        return radioexecute(message, serverQueue, Radio22);
        if(args[1] == "23")	
        return radioexecute(message, serverQueue, Radio23);
        if(args[1] == "24")	
        return radioexecute(message, serverQueue, Radio24);
        if(args[1] == "25")	
        return radioexecute(message, serverQueue, Radio25);
        if(args[1] == "26")	
        return radioexecute(message, serverQueue, Radio26);
        if(args[1] == "27")	
        return radioexecute(message, serverQueue, Radio27);
        if(args[1] == "28")	
        return radioexecute(message, serverQueue, Radio28);
        if(args[1] == "29")	
        return radioexecute(message, serverQueue, Radio29);
        if(args[1] == "30")	
        return radioexecute(message, serverQueue, Radio30);
        if(args[1] == "31")	
        return radioexecute(message, serverQueue, Radio31);
        if(args[1] == "32")	
        return radioexecute(message, serverQueue, Radio32);
        else {message.reply(`***Not a valid Radio Station***`);}
        return;
      }
      if (message.content === "cm!stop") {
     message.member.voice.channel.leave();
      }
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`);
    if (!prefixRegex.test(message.content)) return;
    const [, matchedPrefix] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command =
      client.commands.get(commandName) ||
      client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;
    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Collection());
    }
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 1) * 1000;
    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return message.reply(
          `please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`
        );
      }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
      command.execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply("There was an error executing that command.").catch(console.error);
    }
  });
  function delay(delayInms) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(2);
      }, delayInms);
    });
  }
  async function radioexecute(message, serverQueue, radio) {
    const args = radio.split(" ");
    
    const voiceChannel = message.member.voice.channel;
   
    if (!voiceChannel)
      return message.reply(
      "You need to be in a voice channel to play music!"
      );
     
     const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.reply(
      "I need the permissions to join and speak in your voice channel!"
      );
    }
    const song = {
      title: args[0],
      url: args[1]
    };
    
  
      const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
      };
      queue.set(message.guild.id, queueContruct);
      const { channel2 } = message.member.voice;
     
      const serverQueue2 = message.client.queue.get(message.guild.id);
     
      
        queueContruct.songs.push(song);
        voiceChannel.leave();
        await delay(300);
        var connection = await voiceChannel.join();
        await connection.voice.setSelfDeaf(true);
        queueContruct.connection = connection;
       
        play(message.guild, queueContruct.songs[0], message);
        await delay(3000);
        for(i=1;i>0;i=i)
        {
          await delay(5000);
          if(voiceChannel.members.size === 1)
          {
            await delay(400);
            if(voiceChannel.members.size === 2)
            {
              continue;
            }
            else{
              break;
            }
           
          }
        } 
          await delay(7500);
           voiceChannel.leave();
    }
    function play(guild, song, message) {
  
    const serverQueue = queue.get(guild.id);
    const voiceChannel = message.member.voice.channel;
    
    const dispatcher = serverQueue.connection
      .play(song.url)
      .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
      })
      .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(1);
    serverQueue.textChannel.send(`Start playing: **${song.title}**`);
   
  }