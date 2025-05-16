import express from 'express';
import {deleteQuestion, getAllQuestions, postQuestion, getQuiz,startQuiz} from "../controllers/QuestionsController.js";

const router = express.Router();

router.get("/Quiz", getQuiz);
router.get("/StartQuiz", startQuiz)
router.get('/', getAllQuestions)
router.post('/', postQuestion)
router.delete('/:id', deleteQuestion)

export default router;