const { canModifyQueue } = require("../util/MilratoUtil");


module.exports = {
  name: "stop",
  description: "Stops the music",
  execute(message) {

    message.member.voice.channel.leave();
    queue.songs = [];
    queue.textChannel.send(`${message.author} ⏹ stopped the music!`).catch(console.error);
  }
};