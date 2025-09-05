import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors({
    origin: process.env.ORIGIN_CORS,
    credentials: true 
}))


export { app }