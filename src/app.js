import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file's path
const __filename = fileURLToPath(import.meta.url);

// Get the directory name of the current file
const __dirname = path.dirname(__filename);

const app = express()
app.use(cors())
// app.use(cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true
// }))


// app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use('/images', express.static(path.join(__dirname, '../public/generatedCards')));

app.use(cookieParser())



// import routes 
// import userRouter from './routes/user.routes.js'

import greetingRouter from './routes/greetings.route.js'
import memberRouter from './routes/membership.route.js'


//routes declaration
console.log("greetingRouter")
app.use("/api/v1", greetingRouter) 
app.use("/api/v1", memberRouter) 
console.log("memberRouter")
// console.log(process.env.PORT)
// http://localhost:8000/api/v1/users/register

export { app }