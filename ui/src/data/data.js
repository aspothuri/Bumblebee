// Colony definitions
export const colonies = {
  honeycomb: { name: "Honeycomb Heights", color: "#ffc107", unlocked: true, cost: 0 },
  meadow: { name: "Meadow Fields", color: "#4caf50", unlocked: false, cost: 15 },
  sunset: { name: "Sunset Valley", color: "#ff9800", unlocked: false, cost: 20 },
  crystal: { name: "Crystal Gardens", color: "#2196f3", unlocked: false, cost: 25 },
  forest: { name: "Whispering Woods", color: "#795548", unlocked: false, cost: 30 },
  ocean: { name: "Ocean Breeze", color: "#00bcd4", unlocked: false, cost: 35 }
};

export const dummyUsers = [
  // Honeycomb Heights Colony
  {
    id: 1,
    name: "Alex Johnson",
    age: 28,
    bio: "Love hiking, coffee, and good conversations. Looking for someone to explore the city with!",
    location: "New York, NY",
    colony: "honeycomb",
    photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&crop=face"
    ],
    occupation: "Software Engineer",
    education: "Computer Science, MIT",
    height: "5'10\"",
    interests: ["Technology", "Nature", "Cooking", "Music"]
  },
  {
    id: 2,
    name: "Sarah Chen",
    age: 25,
    bio: "Art lover, yoga enthusiast, and coffee addict. Let's grab a cup and talk about life!",
    location: "San Francisco, CA",
    colony: "honeycomb",
    photos: [
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face"
    ],
    occupation: "Graphic Designer",
    education: "Fine Arts, UC Berkeley",
    height: "5'6\"",
    interests: ["Art", "Wellness", "Sustainability", "Books"]
  },
  {
    id: 9,
    name: "Maya Patel",
    age: 24,
    bio: "Yoga instructor, meditation teacher, and wellness advocate. Seeking a mindful connection!",
    location: "Portland, OR",
    colony: "honeycomb",
    photos: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop&crop=face"
    ],
    occupation: "Yoga Instructor",
    education: "Wellness Studies, Portland State",
    height: "5'4\"",
    interests: ["Wellness", "Meditation", "Sustainability", "Health"]
  },
  {
    id: 10,
    name: "Ryan Cooper",
    age: 31,
    bio: "Tech entrepreneur and rock climbing enthusiast. Always up for an adventure and good laughs!",
    location: "Austin, TX",
    colony: "honeycomb",
    photos: [
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face"
    ],
    occupation: "Tech Entrepreneur",
    education: "MBA, Stanford",
    height: "6'1\"",
    interests: ["Technology", "Adventure Sports", "Comedy", "Business"]
  },
  {
    id: 11,
    name: "Jessica Martinez",
    age: 26,
    bio: "Professional dancer and choreographer. Love creating art through movement and connecting with creative souls.",
    location: "Miami, FL",
    colony: "honeycomb",
    photos: [
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop&crop=face"
    ],
    occupation: "Professional Dancer",
    education: "Dance, Juilliard",
    height: "5'7\"",
    interests: ["Dance", "Art", "Music", "Performance"]
  },

  // Meadow Fields Colony
  {
    id: 3,
    name: "Marcus Rodriguez",
    age: 30,
    bio: "Fitness trainer by day, chef by night. Looking for someone who shares my passion for healthy living!",
    location: "Austin, TX",
    colony: "meadow",
    photos: [
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face"
    ],
    occupation: "Personal Trainer",
    education: "Kinesiology, UT Austin",
    height: "6'2\"",
    interests: ["Fitness", "Cooking", "Sports", "Health"]
  },
  {
    id: 12,
    name: "Oliver Green",
    age: 33,
    bio: "Environmental scientist and nature photographer. Passionate about conservation and outdoor adventures.",
    location: "Boulder, CO",
    colony: "meadow",
    photos: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face"
    ],
    occupation: "Environmental Scientist",
    education: "Environmental Science, UC Davis",
    height: "5'11\"",
    interests: ["Environment", "Photography", "Hiking", "Conservation"]
  },
  {
    id: 13,
    name: "Sophia Williams",
    age: 27,
    bio: "Organic farmer and sustainable living advocate. Looking for someone who cares about our planet!",
    location: "Asheville, NC",
    colony: "meadow",
    photos: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face"
    ],
    occupation: "Organic Farmer",
    education: "Agriculture, NC State",
    height: "5'5\"",
    interests: ["Farming", "Sustainability", "Nature", "Cooking"]
  },

  // Sunset Valley Colony
  {
    id: 4,
    name: "Emma Thompson",
    age: 27,
    bio: "Bookworm, wine lover, and adventure seeker. Ready to explore the world with the right person!",
    location: "Seattle, WA",
    colony: "sunset",
    photos: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop&crop=face"
    ],
    occupation: "Marketing Manager",
    education: "Business, University of Washington",
    height: "5'7\"",
    interests: ["Literature", "Travel", "Wine", "Culture"]
  },
  {
    id: 14,
    name: "Lucas Anderson",
    age: 29,
    bio: "Travel blogger and adventure photographer. Always planning the next great expedition!",
    location: "San Diego, CA",
    colony: "sunset",
    photos: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&crop=face"
    ],
    occupation: "Travel Blogger",
    education: "Communications, UC San Diego",
    height: "6'0\"",
    interests: ["Travel", "Photography", "Writing", "Adventure"]
  },
  {
    id: 15,
    name: "Isabella Garcia",
    age: 25,
    bio: "Sunset chaser and beach volleyball player. Love golden hour photography and ocean vibes!",
    location: "Santa Barbara, CA",
    colony: "sunset",
    photos: [
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop&crop=face"
    ],
    occupation: "Beach Volleyball Coach",
    education: "Sports Science, UCSB",
    height: "5'8\"",
    interests: ["Sports", "Photography", "Beach", "Fitness"]
  },

  // Crystal Gardens Colony
  {
    id: 5,
    name: "David Kim",
    age: 29,
    bio: "Musician, dog lover, and tech enthusiast. Let's make beautiful music together!",
    location: "Los Angeles, CA",
    colony: "crystal",
    photos: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face"
    ],
    occupation: "Music Producer",
    education: "Music Production, UCLA",
    height: "5'9\"",
    interests: ["Music", "Technology", "Animals", "Gaming"]
  },
  {
    id: 16,
    name: "Ava Johnson",
    age: 26,
    bio: "Crystal healer and meditation guide. Seeking harmony and spiritual connection in relationships.",
    location: "Sedona, AZ",
    colony: "crystal",
    photos: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&crop=face"
    ],
    occupation: "Crystal Healer",
    education: "Alternative Healing, Institute of Integrative Nutrition",
    height: "5'6\"",
    interests: ["Spirituality", "Healing", "Meditation", "Crystals"]
  },
  {
    id: 17,
    name: "Ethan Davis",
    age: 32,
    bio: "Jewelry designer specializing in crystal and gemstone pieces. Creating beauty from earth's treasures.",
    location: "Santa Fe, NM",
    colony: "crystal",
    photos: [
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop&crop=face"
    ],
    occupation: "Jewelry Designer",
    education: "Fine Arts, RISD",
    height: "5'10\"",
    interests: ["Art", "Design", "Crystals", "Craftsmanship"]
  },

  // Whispering Woods Colony
  {
    id: 6,
    name: "Lisa Park",
    age: 26,
    bio: "Dancer, fitness enthusiast, and foodie. Looking for someone to dance through life with!",
    location: "Chicago, IL",
    colony: "forest",
    photos: [
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop&crop=face"
    ],
    occupation: "Dance Instructor",
    education: "Dance, Northwestern University",
    height: "5'5\"",
    interests: ["Dance", "Fitness", "Fashion", "Food"]
  },
  {
    id: 18,
    name: "Noah Miller",
    age: 34,
    bio: "Forest ranger and wildlife conservationist. Passionate about protecting our natural heritage.",
    location: "Missoula, MT",
    colony: "forest",
    photos: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face"
    ],
    occupation: "Forest Ranger",
    education: "Forestry, University of Montana",
    height: "6'3\"",
    interests: ["Nature", "Conservation", "Hiking", "Wildlife"]
  },
  {
    id: 19,
    name: "Chloe Brown",
    age: 28,
    bio: "Herbalist and natural remedy specialist. Finding healing in nature's pharmacy.",
    location: "Eugene, OR",
    colony: "forest",
    photos: [
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop&crop=face"
    ],
    occupation: "Herbalist",
    education: "Herbal Medicine, Bastyr University",
    height: "5'4\"",
    interests: ["Herbal Medicine", "Nature", "Wellness", "Plants"]
  },

  // Ocean Breeze Colony
  {
    id: 7,
    name: "James Wilson",
    age: 32,
    bio: "Outdoor enthusiast, photographer, and coffee connoisseur. Let's capture beautiful moments together!",
    location: "Denver, CO",
    colony: "ocean",
    photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face"
    ],
    occupation: "Photographer",
    education: "Visual Arts, CU Boulder",
    height: "6'0\"",
    interests: ["Photography", "Outdoors", "Coffee", "Adventure"]
  },
  {
    id: 20,
    name: "Zoe Taylor",
    age: 27,
    bio: "Marine biologist and scuba diving instructor. Exploring the mysteries of the deep blue sea!",
    location: "Key West, FL",
    colony: "ocean",
    photos: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=600&fit=crop&crop=face"
    ],
    occupation: "Marine Biologist",
    education: "Marine Biology, University of Miami",
    height: "5'6\"",
    interests: ["Marine Life", "Diving", "Research", "Ocean"]
  },
  {
    id: 21,
    name: "Caleb Wright",
    age: 30,
    bio: "Professional surfer and ocean photographer. Chasing waves and perfect lighting around the globe.",
    location: "Malibu, CA",
    colony: "ocean",
    photos: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face"
    ],
    occupation: "Professional Surfer",
    education: "Sports Management, UCSD",
    height: "6'1\"",
    interests: ["Surfing", "Photography", "Travel", "Ocean"]
  }
];

export const currentUser = {
  id: 0,
  name: "You",
  age: 28,
  bio: "Looking for meaningful connections!",
  location: "Your City",
  colony: "honeycomb",
  honey: 10,
  photos: [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face"
  ],
  occupation: "Your Job",
  education: "Your Education",
  height: "Your Height",
  interests: ["Your Interests"]
};

export const savedProfiles = [
  dummyUsers[1], // Sarah Chen
  dummyUsers[3], // Emma Thompson
  dummyUsers[5]  // David Kim
];

// Map layout - colony positions and connections
export const mapLayout = {
  honeycomb: { x: 50, y: 50, connections: ['meadow', 'sunset'] },
  meadow: { x: 20, y: 30, connections: ['honeycomb', 'forest'] },
  sunset: { x: 80, y: 30, connections: ['honeycomb', 'crystal'] },
  crystal: { x: 80, y: 70, connections: ['sunset', 'ocean'] },
  forest: { x: 20, y: 70, connections: ['meadow', 'ocean'] },
  ocean: { x: 50, y: 90, connections: ['forest', 'crystal'] }
};

