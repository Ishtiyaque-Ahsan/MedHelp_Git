import validator from "validator"
import bcrypt from "bcrypt"
import {v2 as cloudinary} from "cloudinary"
import doctorModel from "../models/doctorModel.js"
import jwt from "jsonwebtoken" 

//api for adding doctor
const addDoctor = async (req, res) => {
    console.log("adddoctor route hit");
    
    try {
        const {name, email, password, speciality, degree, experience, about, fees, address} = req.body
        const imageFile = req.file
        console.log({name, email, password, speciality, degree, experience, about, fees, address ,imageFile});

        //checking for all data to add doctor
        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address){
            return res.json({success:false, message:"Missing Details"})
        }

        //validating email format
        if(!validator.isEmail(email)){
            return res.json({success:false, message:"Please enter a valid Email"})
        }
        //validating strong password
        if(password.length < 8){
            return res.json({success:false, message:"Please enter a strong password"})
        }

        //hashing doctor password
        const salt = await bcrypt.genSalt(10)
        const hashedpassword = await bcrypt.hash(password, salt)

        //upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type:"image"})
        const imageUrl = imageUpload.secure_url
        console.log(imageUrl);

        //save all thses data in db
        const doctorData = {
            name,
            email,
            image:imageUrl,
            password:hashedpassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address), //to convert obj to string
            date:Date.now()
        }
        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()
        console.log("hereeee");
        
        res.json({success:true, message:"Doctor Added"})
        
        
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
        
    }
}

//Api for admin login
const loginAdmin = async (req, res) => {
    try{
        const {email, password} = req.body
        if(email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password, process.env.JWT_SECRET)
            res.json({success:true, token})
        } else {
            res.json({success:false, message:"Invalid Credentials"})
        }
    } catch(error){
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

//API controller function to get all doctors list for admin panel
const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password')
        res.json({success:true, doctors})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}


export {addDoctor, loginAdmin, allDoctors}