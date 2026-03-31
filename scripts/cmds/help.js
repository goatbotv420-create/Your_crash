const fs = require("fs-extra");
const path = require("path");

module.exports = {
	config: {
		name: "help",
		aliases: ["menu", "commands"],
		version: "4.8",
		author: "NeoKEX",
		shortDescription: "Show all available commands",
		longDescription: "Displays a clean and premium-styled categorized list of commands.",
		category: "system",
		guide: "{pn}help [command name]"
	},

	onStart: async function ({ message, args, prefix }) {
		const allCommands = global.GoatBot.commands;
		const categories = {};

		const emojiMap = {
			ai: "❯", "ai-image": "❯", group: "❯", system: "❯",
			fun: "❯", owner: "❯", config: "❯", economy: "❯",
			media: "❯", "18+": "❯", tools: "'", utility: "❯",
			info: "❯", image: "❯", game: "❯", admin: "❯",
			rank: "❯", boxchat: "❯", others: "❯"
		};

		const cleanCategoryName = (text) => {
			if (!text) return "others";
			return text
				.normalize("NFKD")
				.replace(/[^\w\s-]/g, "")
				.replace(/\s+/g, " ")
				.trim()
				.toLowerCase();
		};

		for (const [name, cmd] of allCommands) {
			const cat = cleanCategoryName(cmd.config.category);
			if (!categories[cat]) categories[cat] = [];
			categories[cat].push(cmd.config.name);
		}


		if (args[0]) {
			const query = args[0].toLowerCase();
			const cmd =
				allCommands.get(query) ||
				[...allCommands.values()].find((c) => (c.config.aliases || []).includes(query));
			if (!cmd) return message.reply(`❌ Command "${query}" not found.`);

			const {
				name,
				version,
				author,
				guide,
				category,
				shortDescription,
				longDescription,
				aliases,
				role 
			} = cmd.config;

			const desc =
				typeof longDescription === "string"
					? longDescription
					: longDescription?.en || shortDescription?.en || shortDescription || "No description";

			const usage =
				typeof guide === "string"
					? guide.replace(/{pn}/g, prefix)
					: guide?.en?.replace(/{pn}/g, prefix) || `${prefix}${name}`;

						const requiredRole = cmd.config.role !== undefined ? cmd.config.role : 0; 

			return message.reply(
				`☠️ 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗜𝗡𝗙𝗢 ☠️\n\n` +
				`❯ Name: ${name}\n` +
				`❯ Category: ${category || "Uncategorized"}\n` +
				`❯ Description: ${desc}\n` +
				`❯ Aliases: ${aliases?.length ? aliases.join(", ") : "None"}\n` +
				`❯ Usage: ${usage}\n` +
				`❯ Permission: ${requiredRole}\n` + 
				`❯ Author: ${author}\n` +
				`❯ Version: ${version}`
			);
		}

		const formatCommands = (cmds) =>
			cmds.sort().map((cmd) => `× ${cmd}`);

		let msg = `━━━☠️ 🆈🅾🆄🆁︎ 🅲🆁🅰🆂🅷 ☠️━━━\n`;
		const sortedCategories = Object.keys(categories).sort();
		for (const cat of sortedCategories) {
			const emoji = emojiMap[cat] || "❯";
			msg += `\n╭━━━⁌ ${cat.toUpperCase()} ⁍\n`; 
			msg += `${formatCommands(categories[cat]).join(' ')}\n`; 
			msg += `┗━━━━━━━━━━━━✦\n`;
		}
		msg += `\n❯ Use: ${prefix}help [command name] for details\n❯Use: ${prefix}callad to talk with bot admins'`;

		return message.reply(msg);
	}
};
