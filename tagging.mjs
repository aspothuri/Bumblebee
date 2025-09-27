
import express from 'express';
import OpenAI from 'openai';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3002;
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: 'sk-Ky0ALnDZfDWECSS99lmRyZEjeUXBUip7e8eFaKdjGET3BlbkFJ1mXXTv3v0FJxynKO8Fu8ae3aorOGEKienfFZuZne0A',  
    organization: "org-bbvI9W23ofMqj8e5hyXQH7dK",  
});


app.post('/api/word-generator', async (req, res) => {
    const {letters} = req.body; 

    const prompt = `You are given a list of letters. You can form valid English words by using each letter at most as many times as it appears in the list. Provide all possible valid words and their definitions directly, without any introductory phrases. Captilize the first letter of each word before defining it. Words formed should be at least three letters long. Give me a list of the words, and separate each word from its definition with a colon. Separate words with new lines, but don't prefix the words with anything. DO NOT say anything else.

    Here are the letters: ${JSON.stringify(letters)}.`;

    console.log("hmm");

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: "You are a helpful assistant." },
                { role: 'user', content: prompt },
            ],
        });

        const wordsWithDefinitionsRaw = response.choices[0].message.content;
        
        const wordsWithDefinitionsArray = wordsWithDefinitionsRaw.split('\n').filter(line => line.trim() !== '');

        const wordsWithDefinitions = {};

        wordsWithDefinitionsArray.forEach(entry => {
            const [word, definition] = entry.split(':');
            if (word && definition) {
                wordsWithDefinitions[word.trim()] = definition.trim();
            }
        });
        console.log("raw response: ", wordsWithDefinitionsRaw)

        console.log('Generated response:', wordsWithDefinitions);
        
        res.json({ wordsWithDefinitions });
    } catch (error) {
        console.error('Error from OpenAI API:', error);
        res.status(500).send('Error communicating with OpenAI API');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});