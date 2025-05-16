import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    }},
    {
    timestamps: true,
    }
)

const QuizResults = mongoose.model("QuizResults", QuizSchema);

export default QuizResults;