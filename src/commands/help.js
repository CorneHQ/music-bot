const Discord = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Help command.',
    cooldown: 5,
    execute(message) {
        const embed = new Discord.MessageEmbed()
            .setColor("#32CD32")
            .setTitle('Cubes Music Help')
            .addField('cm!play <YouTube URL>', 'Play a song')
            .addField('cm!skip', 'Starts the next song in the queue')
            .addField('cm!queue', 'Shows the queue')
            .addField('cm!np', 'Shows the now playing song')
            .addField('cm!pause', 'Pause the current song')
            .addField('cm!resume', 'Resume the current song')
            .addField('cm!stop', 'Stops the bot')
            .addField('cm!volume <volume height>', 'Set the height of the volume (max. 20)');

        return message.channel.send(embed);
    }
};
