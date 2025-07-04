const Hashtag = require("../models/Hashtags");
const { redisClient } = require("../server");
const User = require("../models/User");
const crypto = require("crypto");
const generateHashtags = require("../services/genAIservice"); // Import the AI service

// @desc    Generate hashtags and save to user's history
// @route   POST /api/hashtags/generate
// @access  Private
// exports.generateHashtags = async (req, res) => {
//   const { platform, postType, location, topic, vibe, description, count } =
//     req.body;

//   if (!platform || !postType || !topic || !vibe || !count) {
//     return res.status(400).json({ error: "Please fill all required fields." });
//   }

//   try {
//     const userInput = {
//       platform,
//       postType,
//       location,
//       topic,
//       vibe,
//       description,
//       count,
//     };

//     // Call Gemini
//     const generatedHashtags = await generateHashtags(userInput);
//     console.log("The hashtags generated are : " , generatedHashtags);

//     if (generatedHashtags.length === 0) {
//       return res.status(500).json({ error: "No hashtags were generated." });
//     }

//     // Save to DB
//     const newHashtag = new Hashtag({
//       owner: req.user._id,
//       platform,
//       postType,
//       location,
//       topic,
//       vibe,
//       description,
//       count,
//       hashtags: generatedHashtags,
//     });

//     await newHashtag.save();

//     // Push to user history
//     const user = await User.findById(req.user._id);
//     user.history.push(newHashtag._id);
//     await user.save();

//     // ✅ Send only one response
//     res
//       .status(201)
//       .json({ message: "Hashtags generated and saved!", data: generatedHashtags });
//   } catch (error) {
//     console.error("Error in generateHashtags:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

//with redis -
// 🔑 Generate a hashed Redis cache key
function generateCacheKey({ topic, location, vibe, platform, postType }) {
  const cacheInput = JSON.stringify({
    topic: topic?.toLowerCase().trim(),
    location: location?.toLowerCase().trim(),
    vibe: vibe?.toLowerCase().trim(),
    platform: platform?.toLowerCase().trim(),
    postType: postType?.toLowerCase().trim(),
  });

  const hash = crypto.createHash("md5").update(cacheInput).digest("hex");
  return `hashtags:${hash}`;
}

exports.generateHashtags = async (req, res) => {
  const { platform, postType, location, topic, vibe, description, count } =
    req.body;

  if (!platform || !postType || !topic || !vibe || !count) {
    return res.status(400).json({ error: "Please fill all required fields." });
  }

  const MAX_CACHE_COUNT = 30;
  try {
    // Step 1: Trim base inputs
    const baseInput = {
      topic: topic?.trim(),
      location: location?.trim(),
      vibe: vibe?.trim(),
      platform: platform?.trim(),
      postType: postType?.trim(),
    };

    // Step 2: Generate cache key (no description or count involved)
    const cacheKey = generateCacheKey(baseInput);

    let allHashtags = [];
    let servedFromCache = false;

    // Step 3: Check cache
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      allHashtags = JSON.parse(cached);
      servedFromCache = true;
      console.log("✅ Served from Redis Cache");
    } else {
      // Step 4: Get from AI with full input (include description here only for AI)
      const aiInput = {
        ...baseInput,
        description: description?.trim(),
        count: MAX_CACHE_COUNT,
      };

      allHashtags = await generateHashtags(aiInput);

      if (!allHashtags || !allHashtags.length) {
        return res.status(500).json({ error: "No hashtags were generated." });
      }

      // Step 5: Cache the result
      await redisClient.setEx(cacheKey, 129600, JSON.stringify(allHashtags)); // 1.5 days
    }

    const finalHashtags = allHashtags.slice(0, count);

    // Step 6: Save to MongoDB
    const newHashtag = new Hashtag({
      owner: req.user._id,
      ...baseInput,
      description,
      count,
      hashtags: finalHashtags,
    });

    await newHashtag.save();

    // Step 7: Add to user's history
    await User.findByIdAndUpdate(req.user._id, {
      $push: { history: newHashtag._id },
    });

    res.status(201).json({
      message: servedFromCache
        ? "Hashtags served from cache"
        : "Hashtags generated and saved!",
      data: finalHashtags,
      cached: servedFromCache,
    });
  } catch (error) {
    console.error("Error in generateHashtags:", error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all hashtag generations by user
// @route   GET /api/hashtags/history
// @access  Private
exports.getHashtagHistory = async (req, res) => {
  try {
    const hashtags = await Hashtag.find({ owner: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(hashtags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get single hashtag generation
// @route   GET /api/hashtags/:id
// @access  Private
exports.getSingleHashtag = async (req, res) => {
  try {
    const hashtag = await Hashtag.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!hashtag) {
      return res.status(404).json({ error: "Hashtag history not found." });
    }

    res.status(200).json(hashtag);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete hashtag history item
// @route   DELETE /api/hashtags/:id
// @access  Private
exports.deleteHashtag = async (req, res) => {
  try {
    const hashtag = await Hashtag.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!hashtag) {
      return res.status(404).json({ error: "Hashtag not found." });
    }

    // Remove from user's history
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { history: req.params.id },
    });

    res.status(200).json({ message: "Hashtag deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get account information and hashtag history
// @route   GET /api/user/account
// @access  Private
exports.getAccountInformation = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password") // remove password from the result
      .populate({
        path: "history",
        options: { sort: { createdAt: -1 } }, // sort latest first
      });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const accountInfo = {
      username: user.username || "",
      name: user.firstname || "",
      email: user.email,
      createdAt: user.createdAt,
      history: user.history, 
    };

    console.log("Account info", accountInfo);
    res.status(200).json(accountInfo);
  } catch (error) {
    console.error("Error in getAccountInformation:", error);
    res.status(500).json({ error: error.message });
  }
};
