import axios from 'axios';

// Tag-based colonies mapping
export const tagColonies = {
  adventure: { name: "Adventure Peak", color: "#ff6b35", icon: "🏔️" },
  creativity: { name: "Creative Commons", color: "#9b59b6", icon: "🎨" },
  fitness: { name: "Fitness Fields", color: "#e74c3c", icon: "💪" },
  technology: { name: "Tech Hub", color: "#3498db", icon: "💻" },
  foodCooking: { name: "Culinary Corner", color: "#f39c12", icon: "🍳" },
  reading: { name: "Literature Library", color: "#8b4513", icon: "📚" },
  moviesTV: { name: "Cinema City", color: "#2c3e50", icon: "🎬" },
  music: { name: "Harmony Heights", color: "#e67e22", icon: "🎵" },
  travel: { name: "Wanderer's Way", color: "#16a085", icon: "✈️" },
  socializing: { name: "Social Square", color: "#f1c40f", icon: "🎉" },
  quietNightsIn: { name: "Cozy Cottage", color: "#95a5a6", icon: "🏠" },
  hiking: { name: "Trail Town", color: "#27ae60", icon: "🥾" },
  gaming: { name: "Gamer's Grove", color: "#9013fe", icon: "🎮" },
  sports: { name: "Athletic Arena", color: "#ff4757", icon: "⚽" },
  comedy: { name: "Laughter Lane", color: "#ffa502", icon: "😂" },
  artMuseums: { name: "Gallery Gardens", color: "#6c5ce7", icon: "🖼️" },
  politics: { name: "Debate District", color: "#636e72", icon: "🏛️" },
  science: { name: "Research Ridge", color: "#00b894", icon: "🔬" },
  spirituality: { name: "Zen Zone", color: "#fd79a8", icon: "🧘" },
  pets: { name: "Pet Paradise", color: "#fdcb6e", icon: "🐕" },
  fashion: { name: "Style Street", color: "#e84393", icon: "👗" },
  diyCrafts: { name: "Maker's Mill", color: "#a29bfe", icon: "🔨" },
  volunteering: { name: "Helper's Haven", color: "#81ecec", icon: "🤝" },
  boardGames: { name: "Game Guild", color: "#fab1a0", icon: "🎲" },
  history: { name: "Heritage Hill", color: "#6c5ce7", icon: "🏺" },
  sustainability: { name: "Green Grove", color: "#00b894", icon: "♻️" },
  liveEvents: { name: "Event Plaza", color: "#ff7675", icon: "🎪" },
  personalGrowth: { name: "Growth Garden", color: "#74b9ff", icon: "🌱" },
  photography: { name: "Shutter Studios", color: "#fd79a8", icon: "📸" },
  gardening: { name: "Bloom Borough", color: "#55a3ff", icon: "🌻" }
};

// Get colony assignment for a user based on their database tags
export const getUserColonyFromTags = async (userId) => {
  try {
    console.log('API: Getting user colony from database tags for:', userId);
    const response = await axios.get('http://localhost:3000/tags');
    
    const userTagData = response.data.find(tagArray => tagArray[0] === userId);
    if (!userTagData) {
      console.log('API: No tags found for user, returning default colony');
      return 'politics'; // Default to Debate District
    }
    
    // Convert array to object with tag names
    const tagKeys = [
      'adventure', 'creativity', 'fitness', 'technology', 'foodCooking', 'reading', 'moviesTV',
      'music', 'travel', 'socializing', 'quietNightsIn', 'hiking', 'gaming', 'sports', 'comedy',
      'artMuseums', 'politics', 'science', 'spirituality', 'pets', 'fashion', 'diyCrafts',
      'volunteering', 'boardGames', 'history', 'sustainability', 'liveEvents', 'personalGrowth',
      'photography', 'gardening'
    ];
    
    const userTags = {};
    tagKeys.forEach((key, index) => {
      userTags[key] = userTagData[index + 1] || 1;
    });
    
    // Find highest scoring tag as primary colony
    let highestTag = 'politics'; // Default to Debate District
    let highestScore = 0;
    
    for (const [tag, score] of Object.entries(userTags)) {
      if (score > highestScore && tagColonies[tag]) { // Ensure tag exists in colonies
        highestScore = score;
        highestTag = tag;
      }
    }
    
    console.log('API: User primary colony based on tags:', highestTag, 'with score:', highestScore);
    return highestTag;
    
  } catch (error) {
    console.error('API: Error fetching user tags for colony assignment:', error);
    return 'politics'; // Default fallback to Debate District
  }
};

// Generate map layout based on user's tag rankings
export const generateMapLayout = (userTags, userTagRankings) => {
  const layout = {};
  const positions = generatePositions(userTagRankings);
  
  userTagRankings.forEach((tag, index) => {
    layout[tag] = {
      x: positions[index].x,
      y: positions[index].y,
      connections: getConnections(tag, userTagRankings, index)
    };
  });
  
  return layout;
};

// Generate positions in a circular/spiral pattern based on rankings
const generatePositions = (rankings) => {
  const positions = [];
  const centerX = 50, centerY = 50;
  
  // Put highest ranked tag at center
  positions.push({ x: centerX, y: centerY });
  
  // Arrange others in concentric circles
  let radius = 15;
  let angle = 0;
  const angleStep = (2 * Math.PI) / Math.min(6, rankings.length - 1);
  
  for (let i = 1; i < rankings.length; i++) {
    if (i === 7) { // Start new ring
      radius = 30;
      angle = 0;
    } else if (i === 13) {
      radius = 45;
      angle = 0;
    }
    
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    
    positions.push({ x, y });
    angle += angleStep;
  }
  
  return positions;
};

// Get connections for a colony (only to nearby colonies in ranking)
const getConnections = (tag, rankings, index) => {
  const connections = [];
  const maxConnections = 3;
  
  // Connect to nearby ranked colonies
  for (let i = Math.max(0, index - 2); i <= Math.min(rankings.length - 1, index + 2); i++) {
    if (i !== index && connections.length < maxConnections) {
      connections.push(rankings[i]);
    }
  }
  
  return connections;
};

// Fetch user's personalized colonies
export const getUserColonies = async (userId) => {
  try {
    console.log('API: Fetching user tags for:', userId);
    const response = await axios.get('http://localhost:3000/tags');
    
    const userTagData = response.data.find(tagArray => tagArray[0] === userId);
    if (!userTagData) {
      throw new Error('User tags not found');
    }
    
    // Convert array to object with tag names
    const tagKeys = [
      'adventure', 'creativity', 'fitness', 'technology', 'foodCooking', 'reading', 'moviesTV',
      'music', 'travel', 'socializing', 'quietNightsIn', 'hiking', 'gaming', 'sports', 'comedy',
      'artMuseums', 'politics', 'science', 'spirituality', 'pets', 'fashion', 'diyCrafts',
      'volunteering', 'boardGames', 'history', 'sustainability', 'liveEvents', 'personalGrowth',
      'photography', 'gardening'
    ];
    
    const userTags = {};
    tagKeys.forEach((key, index) => {
      userTags[key] = userTagData[index + 1] || 1;
    });
    
    // Rank tags by score (highest first)
    const rankedTags = tagKeys
      .map(tag => ({ tag, score: userTags[tag] }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 20) // Take top 20 tags
      .map(item => item.tag);
    
    console.log('API: User tag rankings:', rankedTags);
    
    // Generate colonies object
    const colonies = {};
    rankedTags.forEach(tag => {
      colonies[tag] = {
        ...tagColonies[tag],
        cost: Math.max(0, 10 + (rankedTags.indexOf(tag) * 5)) // Closer colonies cost less
      };
    });
    
    // Generate map layout
    const mapLayout = generateMapLayout(userTags, rankedTags);
    
    return {
      colonies,
      mapLayout,
      startingColony: rankedTags[0] || 'politics', // Fallback to Debate District
      userTags,
      rankedTags
    };
    
  } catch (error) {
    console.error('Error fetching user colonies:', error);
    // Fallback to default system
    return null;
  }
};

// Legacy exports for compatibility
export const colonies = tagColonies;
export const mapLayout = {};
export const colonyAPI = {
  getUserColonies,
  getUserColonyFromTags
};
