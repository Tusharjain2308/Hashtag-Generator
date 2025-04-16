const Hashtag = require("../models/Hashtags");
const User = require("../models/User");
const generateHashtags = require("../services/genAIservice"); // Import the AI service

// @desc    Generate hashtags and save to user's history
// @route   POST /api/hashtags/generate
// @access  Private
exports.generateHashtags = async (req, res) => {
  const { platform, postType, location, topic, vibe, description, count } =
    req.body;

  if (!platform || !postType || !topic || !vibe || !count) {
    return res.status(400).json({ error: "Please fill all required fields." });
  }

  try {
    const userInput = {
      platform,
      postType,
      location,
      topic,
      vibe,
      description,
      count,
    };

    // Call Gemini
    const generatedHashtags = await generateHashtags(userInput);
    console.log("The hashtags generated are : " , generatedHashtags);
    
    if (generatedHashtags.length === 0) {
      return res.status(500).json({ error: "No hashtags were generated." });
    }

    // Save to DB
    const newHashtag = new Hashtag({
      owner: req.user._id,
      platform,
      postType,
      location,
      topic,
      vibe,
      description,
      count,
      hashtags: generatedHashtags,
    });

    await newHashtag.save();

    // Push to user history
    const user = await User.findById(req.user._id);
    user.history.push(newHashtag._id);
    await user.save();

    // ✅ Send only one response
    res
      .status(201)
      .json({ message: "Hashtags generated and saved!", data: generatedHashtags });
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

    console.log("Account info",accountInfo);
    res.status(200).json(accountInfo);
  } catch (error) {
    console.error("Error in getAccountInformation:", error);
    res.status(500).json({ error: error.message });
  }
};
