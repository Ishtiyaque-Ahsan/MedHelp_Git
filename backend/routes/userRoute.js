import express from 'express'
import { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointments, cancelAppointment } from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'

const userRouter = express.Router()
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/get-profile', authUser, getProfile)
userRouter.post('/update-profile', upload.single('image'), authUser, updateProfile)
// image is the key name which we are sending from frontend, we are sending image in 'image' field name
//keep authUser m/w after upload.single m/w because we want to first upload image and then authenticate user

userRouter.post('/book-appointment', authUser, bookAppointment)
// we are using authUser m/w because only logged in user can book appointment

userRouter.get('/appointments', authUser, listAppointments);
userRouter.post('/cancel-appointment', authUser, cancelAppointment);
export default userRouter 