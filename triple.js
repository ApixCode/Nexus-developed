const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Collection } = require('discord.js');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

// --- Kupal! ---
const API_URL = "http://fi4.bot-hosting.net:22259/bypass";
const API_KEY = "kevinehub";
const BLACKLIST_DURATION_MINUTES = 15;
const BANNED_DOMAINS = ["discord.gg", "discord.com"];
const INVITE_LINK = "https://discord.gg/ZCajeqGbmD";


const AUTO_BYPASS_FILE = './autoBypassChannels.json';
const BLACKLIST_FILE = './blacklist.json';


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});


const autoBypassChannels = new Set(loadData(AUTO_BYPASS_FILE, []));
const blacklist = new Collection(Object.entries(loadData(BLACKLIST_FILE, {})));

function loadData(filePath, defaultValue) {
    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error(`Error loading data from ${filePath}:`, error);
    }
    return defaultValue;
}

function saveData(filePath, data) {
    try {
        
        if (data instanceof Set) {
            data = Array.from(data);
        }
    
        if (data instanceof Collection) {
            data = Object.fromEntries(data);
        }
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(`Error saving data to ${filePath}:`, error);
    }
}


function isUserBlacklisted(userId) {
    const expiryTime = blacklist.get(userId);
    if (expiryTime) {
        if (Date.now() < expiryTime) {
            return true;
        } else {
            
            blacklist.delete(userId);
            saveData(BLACKLIST_FILE, blacklist);
            return false;
        }
    }
    return false;
}

function blacklistUser(userId) {
    const expiryTime = Date.now() + (BLACKLIST_DURATION_MINUTES * 60 * 1000);
    blacklist.set(userId, expiryTime);
    saveData(BLACKLIST_FILE, blacklist);
    console.log(`User ${userId} has been blacklisted for ${BLACKLIST_DURATION_MINUTES} minutes.`);
}


function createBaseEmbed(user, botUser) {
    return new EmbedBuilder()
        .setColor('#004cff')
        .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
        .setFooter({ text: 'Kevine Project #1', iconURL: botUser.displayAvatarURL() });
}

async function processBypass(source, urlToBypass) {
    const user = source.author || source.user;

    
    if (isUserBlacklisted(user.id)) {
        if (source.isCommand?.()) {
            await source.reply({ content: `${user} You are currently on a cooldown for posting a Discord link.`, ephemeral: true });
        }
        return;
    }

    
    if (BANNED_DOMAINS.some(domain => urlToBypass.includes(domain))) {
        blacklistUser(user.id);
        const errorEmbed = createBaseEmbed(user, client.user)
            .setTitle('**Processed and returned an error**')
            .setDescription(`You are not allowed to bypass Discord links. You have been blacklisted for **${BLACKLIST_DURATION_MINUTES} minutes**.`);
        
        if (source.isCommand?.()) {
             await source.reply({ content: `${user} ${INVITE_LINK}`, embeds: [errorEmbed], ephemeral: true });
        } else {
             await source.channel.send({ content: `${user} ${INVITE_LINK}`, embeds: [errorEmbed] });
        }
        return;
    }

    const messageContent = `${user} ${INVITE_LINK}`;
    let messageToEdit;
    const startTime = Date.now();

    
    const loadingEmbed = createBaseEmbed(user, client.user)
        .setTitle('**Link in que for bypass**')
        .setDescription('Please wait until your link is up to bypass, if done you will receive a result')
        .addFields({ name: 'API By:', value: INVITE_LINK });

    if (source.isCommand?.()) {
        await source.reply({ content: messageContent, embeds: [loadingEmbed] });
        messageToEdit = await source.fetchReply();
    } else {
        messageToEdit = await source.channel.send({ content: messageContent, embeds: [loadingEmbed] });
    }

    
    try {
        const response = await axios.get(API_URL, {
            params: { apikey: API_KEY, url: urlToBypass }
        });
        const endTime = Date.now();

        if (response.data && response.data.result) {
            const resultEmbed = createBaseEmbed(user, client.user)
                .setTitle('**Bypass successful**')
                .setDescription(response.data.result)
                .addFields({ name: 'Response Due:', value: `${((endTime - startTime) / 1000).toFixed(1)}s` });
            await messageToEdit.edit({ embeds: [resultEmbed] });
        } else {
            throw new Error('API did not return a valid result.');
        }
    } catch (error) {
        console.error('API Error:', error.message);
        const errorEmbed = createBaseEmbed(user, client.user)
            .setTitle('**Processed and returned an error**')
            .setDescription('API did not return a result. The link may be invalid or not supported.');
        await messageToEdit.edit({ embeds: [errorEmbed] });
    }
}


client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'bypass') {
        const url = interaction.options.getString('url');
        await processBypass(interaction, url);
    } 
    else if (commandName === 'set-auto-bypass') {
        const channelId = interaction.channelId;

        // Permission check (redundant due to command permissions, but good practice)
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You must be an administrator to use this command.', ephemeral: true });
        }

        if (autoBypassChannels.has(channelId)) {
            autoBypassChannels.delete(channelId);
            saveData(AUTO_BYPASS_FILE, autoBypassChannels);
            await interaction.reply({ content: '✅ This channel will **no longer** auto-bypass links.', ephemeral: true });
        } else {
            autoBypassChannels.add(channelId);
            saveData(AUTO_BYPASS_FILE, autoBypassChannels);
            await interaction.reply({ content: '✅ This channel has been **set** for auto-bypassing.', ephemeral: true });
        }
    }
});

client.on('messageCreate', async message => {
    if (message.author.bot || !message.guild) return;
    if (!autoBypassChannels.has(message.channelId)) return;

    // Simple regex to find the first URL in a message diba kupal?
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const found = message.content.match(urlRegex);

    if (found && found.length > 0) {
        const url = found[0]; 
        await processBypass(message, url);
    }
});


client.login(process.env.DISCORD_TOKEN);
