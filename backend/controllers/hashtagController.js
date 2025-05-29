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
function generateCacheKey({
  platform,
  postType,
  location,
  topic,
  vibe,
  description,
}) {
  const basePrompt = JSON.stringify({
    platform,
    postType,
    location,
    topic,
    vibe,
    description,
  });
  const hash = crypto.createHash("md5").update(basePrompt).digest("hex");
  return `hashtags:${hash}`;
}

exports.generateHashtags = async (req, res) => {
  const { platform, postType, location, topic, vibe, description, count } =
    req.body;

  if (!platform || !postType || !topic || !vibe || !count) {
    return res.status(400).json({ error: "Please fill all required fields." });
  }

  const MAX_COUNT = 30;

  try {
    const baseInput = {
      platform: platform?.trim(),
      postType: postType?.trim(),
      location: location?.trim() || "",
      topic: topic?.trim(),
      vibe: vibe?.trim(),
      description: description?.trim() || "",
    };

    const cacheKey = generateCacheKey(baseInput);

    // 1️⃣ Check cache for MAX_COUNT results
    const cachedData = await redisClient.get(cacheKey);

    let finalHashtags = [];

    if (cachedData) {
      console.log("✅ Served from Redis Cache");
      const allHashtags = JSON.parse(cachedData);
      finalHashtags = allHashtags.slice(0, count);
    } else {
      // 2️⃣ Generate MAX_COUNT hashtags from AI
      const aiInput = { ...baseInput, count: MAX_COUNT };
      const generatedHashtags = await generateHashtags(aiInput);

      if (!generatedHashtags.length) {
        return res.status(500).json({ error: "No hashtags were generated." });
      }

      // 3️⃣ Cache the MAX_COUNT result for 36 hours (129600 seconds)
      await redisClient.setEx(
        cacheKey,
        129600,
        JSON.stringify(generatedHashtags)
      );

      finalHashtags = generatedHashtags.slice(0, count);
    }

    // 4️⃣ Save to DB
    const newHashtag = new Hashtag({
      owner: req.user._id,
      ...baseInput,
      count,
      hashtags: finalHashtags,
    });
    await newHashtag.save();

    // 5️⃣ Update user history
    await User.findByIdAndUpdate(req.user._id, {
      $push: { history: newHashtag._id },
    });

    // 6️⃣ Return response
    res.status(201).json({
      message: cachedData
        ? "Hashtags served from cache"
        : "Hashtags generated and saved!",
      data: finalHashtags,
      cached: !!cachedData,
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
      history: user.history, // this includes all hashtags generated
    };

    console.log("Account info", accountInfo);
    res.status(200).json(accountInfo);
  } catch (error) {
    console.error("Error in getAccountInformation:", error);
    res.status(500).json({ error: error.message });
  }
};
