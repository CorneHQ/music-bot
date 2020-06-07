module.exports = {
	name: 'volume',
	description: 'Volume command.',
	cooldown: 5,
	execute(message, args) {
		const { channel } = message.member.voice;
		if (!channel) return message.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) return message.channel.send('There is nothing playing.');
		if (!args[0]) return message.channel.send(`The current volume is: **${serverQueue.volume}**`);
		if (isNaN(args[0])) return message.channel.send('The given volume needs to be a number');
		if (args[0] > 20) return message.channel.send('The max volume is 20, please choose a lower number');
		if (args[0] < 1) return message.channel.send('The min volume is 1, please choose a higher number');
		serverQueue.volume = args[0]; // eslint-disable-line
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5);
		return message.channel.send(`I set the volume to: **${args[0]}**`);
	}
};
