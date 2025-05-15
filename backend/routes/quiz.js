const express = require("express");
const router = express.Router();
const { startQuiz, answerQuestion, getLeaderboard } = require("../controllers/quizController");
const auth = require("../middleware/authMiddleware");

router.get("/start", auth, startQuiz);
router.post("/answer", auth, answerQuestion);
router.get("/leaderboard", getLeaderboard);

module.exports = router;
