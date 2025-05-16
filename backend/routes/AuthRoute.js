import express from "express";
import passport from "passport";
const router = express.Router();
import dotenv from "dotenv";

dotenv.config();

router.get("/login/success", (req, res) => {
    if (req.user) {
        res.status(200).json({
            success: true,
            message: "successfull",
            user: req.user,
        });
    }
});

router.get("/login/failed", (req, res) => {
    res.status(401).json({
        success: false,
        message: "failure",
    });
});

router.get("/logout", (req, res) => {
    req.logout(function (err) {
        if (err) {
            return res.status(500).send("Logout error");
        }

        req.session.destroy(() => {
            res.clearCookie("connect.sid"); // Express-session cookie’sini temizle
            res.redirect(process.env.CLIENT_LOGOUT_URL); // Örn: http://localhost:3000/
        });
    });
});


router.get("/github", passport.authenticate("github", { scope: ["profile"] }));

router.get(
    "/github/callback",
    passport.authenticate("github", {
        successRedirect: process.env.CLIENT_LOGIN_URL,
        failureRedirect: "/login/failed",
    })
);

export default router;