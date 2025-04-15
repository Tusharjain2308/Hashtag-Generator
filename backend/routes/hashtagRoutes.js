const express = require("express");
const router = express.Router();
const {
  generateHashtags,
  getHashtagHistory,
  getSingleHashtag,
  deleteHashtag,
} = require("../controllers/hashtagController");
const { protect } = require("../middlewares/authMiddleware");

// @route   POST /api/hashtags/generate
// @desc    Generate hashtags and save to user's history
// @access  Private
router.post("/generate", protect, generateHashtags);

// @route   GET /api/hashtags/history
// @desc    Get all hashtag generations by user
// @access  Private
router.get("/history", protect, getHashtagHistory);

// @route   GET /api/hashtags/:id
// @desc    Get single hashtag generation
// @access  Private
router.get("/:id", protect, getSingleHashtag);

// @route   DELETE /api/hashtags/:id
// @desc    Delete hashtag history item
// @access  Private
router.delete("/:id", protect, deleteHashtag);

module.exports = router;
