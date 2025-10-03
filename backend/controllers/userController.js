import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import appointmentModel from "../models/appointmentModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

//API to register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !password || !email) {
      return res.json({ success: false, message: "Missing details" });
    }
    //validating email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid Email" });
    }
    //validating strong password
    if (password.length < 8) {
      return res.json({ success: false, message: "Enter a strong Password" });
    }
    //hash the user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save(); //will save data in db
    // in this user obj, we will get a property _id which I will use to create token so that user can login

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token }); //send to user
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to User Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not Exist" });
      // wrote return to terminate here
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      //send token to user so that it can login
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Credentials(password)" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api to get user profile data
const getProfile = async (req, res) => {
  try {
    const userId = req.body.userId;
    // const {userId} = req.body
    const user = await userModel.findById(userId).select("-password");
    if (!user) {
      return res.json({ success: false, message: "User does not Exist" });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api to update user profile data
const updateProfile = async (req, res) => {
  try {
    //From frontend we will send name, phone, address .. in body and token in headers and image in form-data
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Missing details" });
    }
    const user = await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    });
    // we are parsing address because it is an object(we are converting it to obj) and we have sent it as a string from frontend
    if (imageFile) {
      //upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageUrl = imageUpload.secure_url;
      //user.image = imageUrl
      //await user.save()
      //or
      await userModel.findByIdAndUpdate(userId, { image: imageUrl });
    }

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api for appointment booking
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;
    // userId is the id of user who is booking appointment and it is coming from authUser m/w
    // docId, slotDate, slotTime is coming from frontend
    const docData = await doctorModel.findById(docId).select("-password");

    if (!docData.available) {
      return res.json({ success: false, message: "Doctor not available" });
    }

    let slots_booked = docData.slots_booked;

    // checking for slot availablity
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot not available" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [slotTime];
      //slots_booked[slotDate] = [];
      //slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select("-password");
    delete docData.slots_booked;
    //deleting slots_booked from docData because we dont want to store it in appointment collection
    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      slotDate, 
      slotTime,
      amount: docData.fee,
      date: Date.now(),
    }
    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment booked successfully" });


  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api to list all appointments of a user in My Appointments page
const listAppointments = async (req, res) => {
  try {
    const userId = req.body.userId;
    const appointments = await appointmentModel.find({ userId });
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api to cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: "Unauthorized access" });
    } 

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
    //free the slot in doctor's slots_booked
    const {docId, slotDate, slotTime} = appointmentData;

    const docData = await doctorModel.findById(docId).select("-password");
    let slots_booked = docData.slots_booked;
    slots_booked[slotDate] = slots_booked[slotDate].filter((time) => time !== slotTime); //removing the slotTime from slots_booked array
    //filter((time) => time !== slotTime) will return all the time slots except the one which is equal to slotTime
    //if after removing the slotTime, the array becomes empty, then we will delete that date from slots_booked
    if (slots_booked[slotDate].length === 0) {
      delete slots_booked[slotDate];
    }
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment cancelled successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointments, cancelAppointment };
