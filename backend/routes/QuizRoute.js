import express from "express";
import {postQuiz, getLeaderBoard} from "../controllers/quizController.js";
const router = express.Router();

router.post("/", postQuiz);
router.get("/", getLeaderBoard);


export default router;