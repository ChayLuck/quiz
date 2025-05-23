import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    questions: [{
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Questions',
            required: true
        },
        questionText: {
            type: String,
            required: true
        },
        correctAnswer: {
            type: String,
            required: true
        },
        selectedAnswer: {
            type: String,
            required: true
        },
        isCorrect: {
            type: Boolean,
            required: true
        },
        timeTaken: {
            type: Number,
            required: true
        },
        allOptions: {
            type: [String],
            required: true
        }
    }]
}, {
    timestamps: true,
});

const QuizResults = mongoose.model("QuizResults", QuizSchema);

export default QuizResults;