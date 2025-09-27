require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Profile = require('./models/Profile');
const Tag = require('./models/Tag');
const { generateTags } = require('./utils/tagging'); // adjust path if needed

// Connect to MongoDB
mongoose.connect(process.env.STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB!"))
.catch(err => console.error(err));

async function createUserWithProfileAndTags() {
  try {
    // 1️⃣ Create a new user
    const user = new User({
      username: "testuser99999",
      email: "testuser@example.com",
      password: "hashedpassword" // hash if your backend expects it
    });
    const savedUser = await user.save();
    console.log("User created:", savedUser);

    // 2️⃣ Create a profile
    const description = "I love hiking, cooking, and going to art museums.";
    const profile = new Profile({
      user: savedUser._id,
      profileImage: "https://example.com/photo.png",
      description
    });
    const savedProfile = await profile.save();
    console.log("Profile created:", savedProfile);

    // 3️⃣ Generate tags from description
    const tagsData = await generateTags(description);

    // 4️⃣ Save tags
    const tagSet = new Tag({
      user: savedUser._id,
      ...tagsData
    });
    const savedTags = await tagSet.save();
    console.log("Tags created:", savedTags);

  } catch (err) {
    console.error("Error:", err);
  } finally {
    mongoose.connection.close();
  }
}

// Run the function
createUserWithProfileAndTags();
