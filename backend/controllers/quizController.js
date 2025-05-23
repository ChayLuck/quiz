import QuizModel from "../models/QuizModel.js";
import QuestionsModel from "../models/QuestionsModel.js";
import mongoose from "mongoose";
import UsersModel from "../models/UsersModel.js";

const ScoreCalculator = (grade, time) => {
    if (grade === 0) {
        return 0;
    } else {
        const n = 100 * grade;
        const base = Math.abs(n * Math.exp(1));
        const expo = -0.2 * time;
        return Math.pow(base, expo);
    }
}

export const postQuiz = async (req, res) => {
    try {
        const data = req.body;
        const questions = data.data;
        let score = 0;
        const questionDetails = [];

        // Process each question and collect details
        for (const item of questions) {
            if (!mongoose.Types.ObjectId.isValid(item.questionId)) {
                return res.status(400).json({
                    success: false,
                    message: "One or more question id is invalid"
                });
            }

            // Fetch the full question details from database
            const questionData = await QuestionsModel.findById(item.questionId);
            if (!questionData) {
                return res.status(400).json({
                    success: false,
                    message: "Question not found in database"
                });
            }

            const isCorrect = item.selectedAnswer === item.correctAnswer;
            const questionScore = isCorrect ? 
                ScoreCalculator(1, item.timeTaken) : 
                ScoreCalculator(0, item.timeTaken);
            
            score += questionScore;

            // Create all options array (correct + incorrect answers)
            const allOptions = [questionData.correct_answer, ...questionData.incorrect_answers]
                .sort(() => Math.random() - 0.5); // Shuffle options

            questionDetails.push({
                questionId: item.questionId,
                questionText: questionData.question,
                correctAnswer: item.correctAnswer,
                selectedAnswer: item.selectedAnswer,
                isCorrect: isCorrect,
                timeTaken: item.timeTaken,
                allOptions: allOptions
            });
        }

        const username = data.username;

        const newQuiz = new QuizModel({
            username: username,
            score: score,
            questions: questionDetails
        });

        try {
            await newQuiz.save();
            res.status(200).json({
                success: true,
                score: score,
                quizId: newQuiz._id // Return quiz ID for retrieval
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const getLeaderBoard = async (req, res) => {
    try {
        const leaderBoard = await QuizModel.find().sort({ score: -1 });
        if (!leaderBoard) {
            res.status(404).json({
                success: false,
                error: "Leaderboard not found"
            });
        } else {
            res.status(200).json({
                success: true,
                data: leaderBoard
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

export const getQuizDetails = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            success: false,
            message: "Invalid quiz ID"
        });
    }

    try {
        const quiz = await QuizModel.findById(id);
        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found"
            });
        }

        res.status(200).json({
            success: true,
            data: quiz
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}