const Discord = require('discord.js');
const Client = require('./client/Client');
const { token, botInviteLink } = require('./config.json');

const client = new Client();

var timeout_cd = 10000;

//Server Status
client.once('ready', () => {
	console.log('Server Ready!');
});

client.once('reconnecting', () => {
	console.log('Reconnecting!');
});

client.once('disconnect', () => {
	console.log('Disconnect!');
});


client.on('message', async message => {
	try {
		// var prefix = "<@!" + client.user.id + ">";
		var prefix = "!";
	
		if (message.content.startsWith(prefix)) {
			let embed = new Discord.MessageEmbed(message).setTimestamp();

			const command = message.content.slice(1);
			// console.log(command);

			if(command.toLowerCase() === "ping") {
				console.log("Valid Command: " + command);
				
				message.channel.send("Pong");
			} else if(new RegExp("^winners [0-9]+ from <@&.+>$").test(command)) {
				console.log("Valid Command: " + command);

				var splitter = command.split(' ');
				
				var numberOfWinners = splitter[1];
				
				var role = splitter[3];
				var roleId = role.substring(3, role.length - 1);

				message.guild.members.fetch()
					.then(members => {
						var targets = members
							// Filter Members Only Having this Role
							.filter(member => {
								return member._roles.includes(roleId);
							})
							// Filter Members Only Non-Bots
							.filter(member => {
								return member.user.bot == false;
							})
							// Map Members as their mentions
							.map(member => {
								return "<@!" + member.user.id + ">";
							})

						var winners = [];

						for(var i=0;i<numberOfWinners;i++) {
							var min = 1;
							var max = targets.length;
							var randomIndex = Math.floor((Math.random() * max) + min) - 1;

							// Add Winner
							winners.push(targets[randomIndex]);

							// Remove from target so we don't pick it more than once
							targets.splice(randomIndex, 1);
						}
						
						console.log("winners", winners);

						// message.channel.send("Winner(s):\n" + winners.join("\n"));

						embed
							.setColor("#00ff00")
							.setDescription("**Winner(s):\n\n" + winners.join("\n") + "**");
						
						message.channel.send(embed)
					})
			} else if(command.toLowerCase() === "formation"){
				console.log("Valid Command: " + command);
				
				message.channel.send("Formation Submitted");

			} else {
				// Invalid Command
				embed
					.setColor("#ff0000")
					.setDescription("**Invalid Command**")
					.setFooter(`🚫`);
				
				message.channel.send(embed).then(msg => { msg.delete({ timeout: timeout_cd }) });
			}
		}
	} catch (error) {
		console.error("message", error);
		return;
	}
});

client.login(token);