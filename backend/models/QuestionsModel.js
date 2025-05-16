import mongoose from "mongoose";

const questionsSchema = mongoose.Schema({
    type:{
        type: String,
        required: true
    },
    difficulty:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    question:{
        type: String,
        required: true
    },
    correct_answer:{
        type: String,
        required: true
    },
    incorrect_answers: {
        type: Array,
        required: true
    }
},{
    timestamps: true
});

const Questions = mongoose.model('Questions', questionsSchema);

export default Questions;