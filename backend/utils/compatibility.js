const Tag = require('../models/Tag'); // adjust path

// List of all tag keys (same order as in DB)
const TAG_KEYS = [
  'adventure','creativity','fitness','technology','foodCooking','reading','moviesTV','music',
  'travel','socializing','quietNightsIn','hiking','gaming','sports','comedy','artMuseums',
  'politics','science','spirituality','pets','fashion','diyCrafts','volunteering','boardGames',
  'history','sustainability','liveEvents','personalGrowth','photography','gardening'
];

// Convert tag doc to vector
function tagDocToVector(tagDoc) {
  return TAG_KEYS.map(key => tagDoc[key] || 1); // fallback to 1
}

// Cosine similarity between two vectors
function simscore(currentVec, otherVec) {
  let total = 0;
  for (let i = 0; i < currentVec.length; i++) {
    const diffSquared = (currentVec[i] - otherVec[i]) ** 2;
    const score = (100 - diffSquared) * Math.sqrt(currentVec[i]);
    total += score;
  }
  return total;
}

// Main function: get compatible users
async function getCompatibleUsers(userId) {
  try {
    console.log('Compatibility: Finding compatible users for:', userId);
    
    // 1️⃣ Get current user tags
    const currentUserTags = await Tag.findOne({ user: userId });
    if (!currentUserTags) {
      console.log('Compatibility: No tags found for user:', userId);
      throw new Error("User tags not found");
    }

    const currentVector = tagDocToVector(currentUserTags);
    console.log('Compatibility: Current user vector generated');

    // 2️⃣ Get all other users
    const allTags = await Tag.find({ user: { $ne: userId } });
    console.log('Compatibility: Found', allTags.length, 'other users with tags');

    if (allTags.length === 0) {
      console.log('Compatibility: No other users found with tags');
      return [];
    }

    // 3️⃣ Compute similarity for each
    const scoredUsers = allTags.map(tagDoc => {
      const vector = tagDocToVector(tagDoc);
      const compatibility = simscore(currentVector, vector);
      return {
        userId: tagDoc.user.toString(),
        compatibility: Math.max(0, Math.min(100, compatibility)) // Ensure 0-100 range
      };
    });

    // 4️⃣ Sort descending
    scoredUsers.sort((a, b) => b.compatibility - a.compatibility);
    
    console.log('Compatibility: Returning', scoredUsers.length, 'compatible users');
    return scoredUsers; // array of {userId, compatibility}
  } catch (error) {
    console.error('Error in getCompatibleUsers:', error);
    throw error;
  }
}

module.exports = { getCompatibleUsers };
