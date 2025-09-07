import express from 'express'
import cors from 'cors'
import oauthRouter from "./routes/oauth.routes.js"
import passport from "passport";
import session from 'express-session'
import './controllers/oauth.controller.js'

const app = express()

app.use(cors({
    origin: process.env.ORIGIN_CORS,
    credentials: true 
}))

app.use(
  session({
    secret: process.env.SESSION_SECRET || "replace-with-secure-secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

app.use("/oauth", oauthRouter);

export { app }