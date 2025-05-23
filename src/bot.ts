import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js';
import dotenv from 'dotenv';
import { loadDB, saveDB } from './db.js';
import { verifyA } from './utils.js';

dotenv.config();
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = [
    new SlashCommandBuilder().setName('domain').setDescription('Manage your domains')
        .addSubcommand(cmd => cmd.setName('add').setDescription('Add a domain').addStringOption(opt => opt.setName('domain').setDescription('Domain to add').setRequired(true)))
        .addSubcommand(cmd => cmd.setName('remove').setDescription('Remove a domain').addStringOption(opt => opt.setName('domain').setDescription('Domain to remove').setRequired(true)))
        .addSubcommand(cmd => cmd.setName('list').setDescription('List your domains'))
].map(cmd => cmd.toJSON());

client.once('ready', async () => {
    console.log(`Logged in as ${client.user?.tag}`);

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN!);
    const GUILD_ID = process.env.GUILD_ID!;

    try {
        await rest.put(
            Routes.applicationGuildCommands(client.application!.id, GUILD_ID),
            { body: commands }
        );

        console.log('Slash commands registered');
    } catch (err) {
        console.error('Command registration failed:', err);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const db = loadDB();
    const uid = interaction.user.id;
    const sub = interaction.options.getSubcommand();

    if (sub === 'add') {
        const domain = interaction.options.getString('domain', true).toLowerCase();

        if (!await verifyA(domain)) {
            return interaction.reply({ content: `A record for ${domain} is not set to 152.53.90.161`, ephemeral: true });
        }

        if (!db.users[uid]) db.users[uid] = [];
        if (!db.users[uid].includes(domain)) db.users[uid].push(domain);
        if (!db.domains.includes(domain)) db.domains.push(domain);

        saveDB(db);
        return interaction.reply({ content: `Domain ${domain} added`, ephemeral: true });
    }

    if (sub === 'remove') {
        const domain = interaction.options.getString('domain', true).toLowerCase();

        if (!db.users[uid]?.includes(domain)) {
            return interaction.reply({ content: `You do not own ${domain}`, ephemeral: true });
        }

        db.users[uid] = db.users[uid].filter(d => d !== domain);

        if (!Object.values(db.users).some(list => list.includes(domain))) {
            db.domains = db.domains.filter(d => d !== domain);
        }

        saveDB(db);
        return interaction.reply({ content: `Domain ${domain} removed`, ephemeral: true });
    }

    if (sub === 'list') {
        const domains = db.users[uid] || [];
        return interaction.reply({ content: `Your domains:\n${domains.join('\n') || 'None'}`, ephemeral: true });
    }
});

client.login(process.env.TOKEN);
