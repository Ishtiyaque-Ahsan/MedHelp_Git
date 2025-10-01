import express from "express"
import cors from "cors"
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import adminRouter from "./routes/adminRoute.js"
import doctorRouter from "./routes/doctorRoute.js"
import userRouter from "./routes/userRoute.js"

//app config
const app = express()
const port = process.env.PORT || 4000
connectDB()  //now connected with db
connectCloudinary()

//middlewares
app.use(express.json())
app.use(cors()) //with help frontend to connect with backend

//api endpoints
app.use('/api/admin', adminRouter)
// localhost:4000/api/admin/add-doctor -> will execute api controller func in adminController

app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)
app.get('/', (req, res)=>{
    res.send("API Working gr");
})

//start express app
app.listen(port, ()=>{
    console.log("Server started ",port);
    
})

//npm start
//npm run server
