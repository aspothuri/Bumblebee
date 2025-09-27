const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: 'sk-Ky0ALnDZfDWECSS99lmRyZEjeUXBUip7e8eFaKdjGET3BlbkFJ1mXXTv3v0FJxynKO8Fu8ae3aorOGEKienfFZuZne0A',  
  organization: "org-bbvI9W23ofMqj8e5hyXQH7dK",
});

async function generateTags(description) {
  const prompt = `
You are given a user's self-description. 
Rate the user's likely interests for each tag on a scale of 1 (low) to 10 (high).
Respond ONLY in JSON with the keys exactly matching the following tags:
adventure, creativity, fitness, technology, foodCooking, reading, moviesTV, music, travel, socializing, quietNightsIn, hiking, gaming, sports, comedy, artMuseums, politics, science, spirituality, pets, fashion, diyCrafts, volunteering, boardGames, history, sustainability, liveEvents, personalGrowth, photography, gardening.

Description: "${description}"
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  let tags = {};
  try {
    // Parse JSON safely
    const raw = response.choices[0].message.content.trim();

    // Remove any extra characters like ```json ... ``` if present
    const cleaned = raw.replace(/```json|```/g, '').trim();

    const parsed = JSON.parse(cleaned);

    // Ensure all keys exist and values are numbers 1-10
    const allTags = [
      'adventure', 'creativity', 'fitness', 'technology', 'foodCooking', 'reading', 'moviesTV',
      'music', 'travel', 'socializing', 'quietNightsIn', 'hiking', 'gaming', 'sports', 'comedy',
      'artMuseums', 'politics', 'science', 'spirituality', 'pets', 'fashion', 'diyCrafts',
      'volunteering', 'boardGames', 'history', 'sustainability', 'liveEvents', 'personalGrowth',
      'photography', 'gardening'
    ];

    for (const key of allTags) {
      let val = parsed[key];
      if (val === undefined || isNaN(val)) val = 1;        // fallback
      val = Math.round(Number(val));                        // make sure it's a number
      if (val < 1) val = 1;
      if (val > 10) val = 10;
      tags[key] = val;
    }

  } catch (err) {
    console.error("Error parsing model output:", err);
    // fallback: default all tags to 1
    const allTags = [
      'adventure', 'creativity', 'fitness', 'technology', 'foodCooking', 'reading', 'moviesTV',
      'music', 'travel', 'socializing', 'quietNightsIn', 'hiking', 'gaming', 'sports', 'comedy',
      'artMuseums', 'politics', 'science', 'spirituality', 'pets', 'fashion', 'diyCrafts',
      'volunteering', 'boardGames', 'history', 'sustainability', 'liveEvents', 'personalGrowth',
      'photography', 'gardening'
    ];
    for (const key of allTags) {
      tags[key] = 1;
    }
  }

  return tags;
}


module.exports = { generateTags };
