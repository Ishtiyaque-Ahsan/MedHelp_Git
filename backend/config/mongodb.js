import mongoose from "mongoose"
const connectDB = async () => {
    mongoose.connection.on('connected', ()=> console.log("Database Connected"))
    
    await mongoose.connect(`${process.env.MONGODB_URI}`)
    
   // console.log("Connected DB name:", mongoose.connection.name)

}
export default connectDB

/*
Connection String:-
Nodejs - mongodb+srv://iahsanamu:<db_password>@cluster0.mqssetw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

Compass - mongodb+srv://ahsan:Ehtesham@cluster0.mqssetw.mongodb.net/




Shell - mongosh "mongodb+srv://cluster0.mqssetw.mongodb.net/" --apiVersion 1 --username iahsanamu

VS-Code : mongodb+srv://ahsan:<db_password>@cluster0.mqssetw.mongodb.net/
*/