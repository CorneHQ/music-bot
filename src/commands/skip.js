module.exports = {
	name: 'skip',
	description: 'Skip command.',
	cooldown: 5,
	execute(message) {
		const { channel } = message.member.voice;
		if (!channel) return message.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
		// if (!message.member.roles.cache.has('601505636496310273')) return message.channel.send('You need to be staff to skip songs!');
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) return message.channel.send('There is nothing playing that I could skip for you.');
		serverQueue.connection.dispatcher.end('Skip command has been used!');
	}
};
