import passportGithub from "passport-github2"
import passport from "passport";
const GithubStrategy = passportGithub.Strategy;
import dotenv from "dotenv";
dotenv.config();

passport.use(
    new GithubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "/api/Auth/github/callback",
        },
        function (accessToken, refreshToken, profile, done) {

            done(null, profile);
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});