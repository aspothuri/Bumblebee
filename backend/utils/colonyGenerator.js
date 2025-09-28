const Tag = require('../models/Tag');

// Tag definitions with colors and names
const TAG_COLONY_MAP = {
  adventure: { name: "Adventure Peak", color: "#ff6b35", description: "For thrill-seekers and explorers" },
  creativity: { name: "Artisan's Haven", color: "#9b59b6", description: "Where imagination comes to life" },
  fitness: { name: "Vigor Valley", color: "#e74c3c", description: "Strength and wellness focused" },
  technology: { name: "Tech Nexus", color: "#3498db", description: "Innovation and digital mastery" },
  foodCooking: { name: "Culinary Corner", color: "#f39c12", description: "Flavors and culinary arts" },
  reading: { name: "Scholar's Sanctuary", color: "#8e44ad", description: "Knowledge and literature lovers" },
  moviesTV: { name: "Cinema Circle", color: "#e67e22", description: "Film and entertainment enthusiasts" },
  music: { name: "Harmony Heights", color: "#1abc9c", description: "Rhythm and melody makers" },
  travel: { name: "Wanderer's Way", color: "#16a085", description: "Global explorers and adventurers" },
  socializing: { name: "Social Square", color: "#f1c40f", description: "Community and connection builders" },
  quietNightsIn: { name: "Tranquil Terrace", color: "#95a5a6", description: "Peace and relaxation seekers" },
  hiking: { name: "Mountain Path", color: "#27ae60", description: "Nature trail enthusiasts" },
  gaming: { name: "Digital Domain", color: "#9013fe", description: "Gaming and virtual worlds" },
  sports: { name: "Athletic Arena", color: "#ff3838", description: "Competitive and team spirit" },
  comedy: { name: "Laughter Lodge", color: "#ffc048", description: "Humor and entertainment hub" },
  artMuseums: { name: "Cultural Commons", color: "#6c5ce7", description: "Art and cultural appreciation" },
  politics: { name: "Civic Center", color: "#2d3436", description: "Political discourse and engagement" },
  science: { name: "Discovery District", color: "#00b894", description: "Research and scientific inquiry" },
  spirituality: { name: "Sacred Space", color: "#a29bfe", description: "Inner peace and reflection" },
  pets: { name: "Companion Colony", color: "#fd79a8", description: "Animal lovers and pet enthusiasts" },
  fashion: { name: "Style Street", color: "#e84393", description: "Fashion and personal expression" },
  diyCrafts: { name: "Maker's Market", color: "#00cec9", description: "Handmade and creative projects" },
  volunteering: { name: "Service Station", color: "#55a3ff", description: "Community service and giving back" },
  boardGames: { name: "Strategy Square", color: "#fd63a4", description: "Tabletop games and strategy" },
  history: { name: "Heritage Hall", color: "#8b7355", description: "Historical knowledge and preservation" },
  sustainability: { name: "Green Grove", color: "#2ed573", description: "Environmental consciousness" },
  liveEvents: { name: "Event Plaza", color: "#ff4757", description: "Concerts, shows, and live entertainment" },
  personalGrowth: { name: "Growth Garden", color: "#5352ed", description: "Self-improvement and development" },
  photography: { name: "Lens Lane", color: "#747d8c", description: "Visual storytelling and artistry" },
  gardening: { name: "Botanical Bay", color: "#7bed9f", description: "Plant cultivation and nature care" }
};

// Generate hexagonal positions for colonies based on tag rankings
function generateColonyPositions(tagRankings) {
  const positions = {};
  const centerX = 50, centerY = 50;
  const ringRadius = [0, 12, 20, 28]; // Distance from center for each ring
  
  // Place highest tag at center
  const topTag = tagRankings[0].tag;
  positions[topTag] = { x: centerX, y: centerY };
  
  // Create rings around the center
  let tagIndex = 1;
  for (let ring = 1; ring < ringRadius.length && tagIndex < tagRankings.length; ring++) {
    const tagsInRing = ring === 1 ? 6 : (ring === 2 ? 12 : 12);
    const radius = ringRadius[ring];
    
    for (let i = 0; i < tagsInRing && tagIndex < tagRankings.length; i++) {
      const angle = (2 * Math.PI * i) / tagsInRing;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      positions[tagRankings[tagIndex].tag] = { x, y };
      tagIndex++;
    }
  }
  
  return positions;
}

// Find the three closest colonies to a given colony
function findRelatedColonies(targetTag, tagRankings, positions) {
  const targetPos = positions[targetTag];
  if (!targetPos) return [];
  
  const distances = tagRankings
    .filter(item => item.tag !== targetTag)
    .map(item => {
      const pos = positions[item.tag];
      if (!pos) return null;
      
      const dx = targetPos.x - pos.x;
      const dy = targetPos.y - pos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      return { tag: item.tag, distance };
    })
    .filter(item => item !== null)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3)
    .map(item => item.tag);
  
  return distances;
}

// Get user's tag rankings and generate their colony assignment
async function generateUserColonyData(userId) {
  const userTags = await Tag.findOne({ user: userId });
  if (!userTags) {
    // Return default data if no tags found
    return {
      currentColony: 'adventure',
      topTags: [{ tag: 'adventure', score: 5 }],
      relatedColonies: ['creativity', 'fitness', 'technology'],
      positions: { adventure: { x: 50, y: 50 } },
      colonyMap: TAG_COLONY_MAP
    };
  }
  
  // Convert tags to rankings
  const tagRankings = Object.entries(TAG_COLONY_MAP)
    .map(([tag, info]) => ({
      tag,
      score: userTags[tag] || 1,
      ...info
    }))
    .sort((a, b) => b.score - a.score);
  
  // Generate positions
  const positions = generateColonyPositions(tagRankings);
  
  // Find user's primary colony (highest scored tag)
  const primaryColony = tagRankings[0].tag;
  
  // Find related colonies
  const relatedColonies = findRelatedColonies(primaryColony, tagRankings, positions);
  
  return {
    currentColony: primaryColony,
    topTags: tagRankings.slice(0, 10), // Top 10 tags
    relatedColonies,
    positions,
    colonyMap: TAG_COLONY_MAP
  };
}

module.exports = {
  TAG_COLONY_MAP,
  generateColonyPositions,
  findRelatedColonies,
  generateUserColonyData
};
