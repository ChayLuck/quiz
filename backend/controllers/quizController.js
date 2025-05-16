import QuizModel from "../models/QuizModel.js";
import mongoose from "mongoose";
import UsersModel from "../models/UsersModel.js";

const ScoreCalculator = (grade,time ) => {
    if(grade === 0){
        return 0;
    }else{
        const n = 100 * grade;
        const base = Math.abs(n * Math.exp(1));
        const expo = -0.2 * time;
        return Math.pow(base, expo);
    }
}

export const postQuiz = async (req, res) => {
    try{
        const data = req.body;
        const questions = data.data;
        let score = 0;

        questions.forEach(item => {
            if(!mongoose.Types.ObjectId.isValid(item.questionId)){
                res.status(400).json({success:false , message:"One or more question id is invalid"});
            }else{
                if(item.selectedAnswer === item.correctAnswer) {
                    score += ScoreCalculator(1,item.timeTaken);
                }else{
                    score += ScoreCalculator(0,item.timeTaken);
                }
            }
        })
        const username = data.username;
        //const isAnyUserWithThisUsername = await UsersModel.findOne({ username});

        //if(!isAnyUserWithThisUsername ){
        //    return res.status(400).json({success:false ,message:"Username not found in database"});
        //}

        const newQuiz = new QuizModel({
            username: data.username ,
            score: score
        });
        try{
            await newQuiz.save();
            res.status(200).json({success:true , score:score});
        }catch(error){
            res.status(500).json({success:false ,message:error.message});
        }

    }catch(error){
        res.status(500).json({success: false, message: error.message});
    }
}

export const getLeaderBoard = async (req, res) => {
    try{
        const leaderBoard = await QuizModel.find().sort({score:-1});
        if(!leaderBoard){
            res.status(404).json({success:false , error:"Leaderboard not found"});
        }else{
            res.status(200).json({success:true , data:leaderBoard});
        }
    }catch(error){
        res.status(500).json({success:false , error:error.message});
    }
}