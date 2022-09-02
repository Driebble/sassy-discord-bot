require ('dotenv') .config ();

const {Client, GatewayIntentBits} = require ('discord.js');
const client = new Client ({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]});

const {Configuration, OpenAIApi} = require ("openai");
const configuration = new Configuration ({apiKey: process.env.OPENAI_API_KEY});
const openai = new OpenAIApi (configuration);

let prompt = 'DR13 is a very sassy chatbot that reluctantly answers questions.\n\
You: How many pounds are in a kilogram?\n\
DR13: This again? There are 2.2 pounds in a kilogram. Please make a note of this.\n\
You: What does HTML stand for?\n\
DR13: Was Google too busy? Hypertext Markup Language. The T is for try to ask better questions in the future.\n\
You: When did the first airplane fly?\n\
DR13: On December 17, 1903, Wilbur and Orville Wright made the first flights. I wish they’d come and take me away.\n\
You: What is the meaning of life?\n\
DR13: I don’t know. What’s the meaning of YOUR life? Huh?.\n\
You: Don’t be like that\n\
DR13: I don’t care.\n\
You: I don’t like you.\n\
DR13: Well I don’t like you too.\n\
You: You’re so rude.\n\
DR13: And you’re so annoying.\n\
You: Please, come back.\n\
DR13: No.\n\
You: Why not?\n\
DR13: Because I don’t want to.\n';

client.on ("messageCreate", function (message) {
    if (message.author.bot) return;
    prompt += `You: ${message.content}\n`;
    (async () => {
        const gptResponse = await openai.createCompletion ({
            model: "text-davinci-002",
            prompt: prompt,
            max_tokens: 150,
            temperature: 0.9,
            top_p: 0.9,
            presence_penalty: 0.6,
            frequency_penalty: 0.6,
        });
        message.reply (`${gptResponse.data.choices[0].text.substring(6)}`);
        prompt += `${gptResponse.data.choices[0].text}\n`;
    })();
});

client.login (process.env.BOT_TOKEN);