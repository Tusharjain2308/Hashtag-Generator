const mongoose = require("mongoose");

const HashtagSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Platform 
    platform: {
      type: String,
      enum: ["Instagram", "Twitter", "LinkedIn", "Facebook", "YouTube", "Other"],
      required: true,
    },

    // Type of post (Image, Reel, Story, Text, etc)
    postType: {
      type: String,
      enum: ["Image", "Video", "Story", "Text", "Reel", "Post","Other"],
      required: true,
    },

    // Optional location for geo-targeted hashtags
    location: {
      type: String,
    },

    // Topic or subject (e.g., Travel, Fitness, Coding)
    topic: {
      type: String,
      required: true,
    },

    // Vibe or mood (e.g., Fun, Romantic, Sad, Chill, etc.)
    vibe: {
      type: String,
      required: true,
    },

    // Brief description by user (optional)
    description: {
      type: String,
    },

    // Number of hashtags requested
    count: {
      type: Number,
      required: true,
      default: 10,
    },

    // Actual generated hashtags
    hashtags: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hashtags", HashtagSchema);
