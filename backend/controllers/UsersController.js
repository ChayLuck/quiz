import UsersModel from "../models/UsersModel.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // Changed from bcrypt to bcryptjs

export const getAllUsers = async (req, res) => {
    try{
        const users = await UsersModel.find();
        res.status(200).json({success: true, data: users});
    }catch(error){
        res.status(500).json({success: false, message: error.message});
    }
}

export const getUser = async (req, res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success: false, message: "User id not found"});
    }

    try {
        const user = await UsersModel.findById(id);
        res.status(200).json({success: true, data: user});
    }catch(error){
        res.status(500).json({success: false, message: error.message});
    }
}

export const postUser = async (req, res) => {
    const {username, password, email} = req.body;
    console.log(req.body);

    if(!username || !password || !email){
        return res.status(400).json({success: false, message:"Please enter all fields"});
    }

    const user = await UsersModel.findOne({ username });

    if (user) {
        return res.status(401).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UsersModel({username, password:hashedPassword, email});

    try{
        await newUser.save()
        res.status(200).json({success: true, message: "User successfully created"});
    }catch(error){
        console.log("Error creating user." + error.message);
        res.status(500).json({success: false, message: error.message});
    }
}

export const deleteUser = async (req, res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success: false, message: "User id not found"});
    }

    try{
        await UsersModel.findByIdAndDelete({_id : id});
        res.status(200).json({success: true, message: "User deleted successfully"});
    }catch(error){
        res.status(500).json({success: false, message: error.message});
    }
}

export const updateUser = async (req, res) => {
    const {id} = req.params;

    const user = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success: false, message: "User id not found"});
    }

    try{
        const updatedUser = await UsersModel.findByIdAndUpdate(id,user,{new: true})
        res.status(200).json({success: true, data: updatedUser});
    }catch(error){
        res.status(500).json({success: false, message: error.message});
    }
}

export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await UsersModel.findOne({ username:{ $eq: username }});

        if (!user) {
            return res.status(500).json({ success: false, message: "Invalid username or password" });
        }

        const isPasswordMatch = await bcrypt.compare(password,user.password);

        if(!isPasswordMatch){
            return res.status(401).json({ success: false, message: "Invalid username or password" });
        }

        res.status(200).json({ success: true, message: "Login successful", username: username });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};