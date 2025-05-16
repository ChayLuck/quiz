import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import cors from 'cors';
import questionRoute from './routes/QuestionsRoute.js';
import usersRoute from "./routes/UsersRoute.js";
import quizRoute from "./routes/QuizRoute.js";
import session from "express-session";
import passport from "passport";
import authRoute from "./routes/AuthRoute.js";
import "./passport.js"

dotenv.config();

const PORT = process.env.PORT || 5001;

const app = express()

app.use(
    cors({
        origin: "http://localhost:3000",
        methods: "GET,POST,PUT,DELETE",
        credentials: true,
    })
);

app.use(express.json())

app.use(
    session({
        secret: "quiss",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // change with (HTTPS)
            maxAge: 24 * 60 * 60 * 1000 // 1 gün
        }
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/Auth", authRoute);

app.use("/api/Questions", questionRoute)
app.use("/api/Users", usersRoute)
app.use("/api/Quiz", quizRoute)

app.listen(PORT, ()=> {
    connectDB()
    console.log("Server started at http://localhost:"+PORT);
});