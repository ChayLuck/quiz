import QuestionsModel from "../models/QuestionsModel.js";
import mongoose from "mongoose";

export const getQuiz = async (req, res) => {
    try{
        const questions = await QuestionsModel.aggregate([{ $sample: { size: 1 } }]);
        res.status(200).json({success:true, questions:questions});
    }catch(error){
        res.status(500).json({success:false , error:error});
    }
}

export const startQuiz = async (req, res) => {
    try{
        const questions = await QuestionsModel.aggregate([{ $sample: { size: 10 } }]);
        res.status(200).json({success:true, questions:questions});
    }catch(error){
        res.status(500).json({success:false , error:error});
    }
}

export const getAllQuestions = async (req, res) => {
    try{
        const questions = await QuestionsModel.find();
        res.status(200).json({success: true, questions: questions});
    }catch(error){
        console.error("Error getting questions from server");
        res.status(500).json({success:false ,error: error.message});
    }
}

export const postQuestion = async (req, res) => {
    const question = req.body;

    if(!question.type || !question.difficulty || !question.category || !question.question || !question.correct_answer || !question.incorrect_answers){
        return res.status(400).json({success: false, message: 'Please provide all fields'});
    }

    const newQuestion = new QuestionsModel(question);

    try{
        await newQuestion.save();
        res.status(200).json({success: true, question: newQuestion});
    }catch(error){
        console.error("Error creating Question", error.message);
        res.status(500).json({success: false, message: "Server Error"});
    }
}

export const deleteQuestion = async (req, res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success: false, message: 'Please provide an correct id'});
    }

    try{
        await QuestionsModel.findByIdAndDelete({_id: id});
        res.status(200).json({success: true, message:  "Question deleted successfully" });
    }catch(error){
        console.error("Error deleting Question", error.message);
        res.status(500).json({success: false, message: "Server Error"});
    }
}