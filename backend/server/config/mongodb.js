import mongoose from "mongoose";
const connectDB = async () => {
    try{
       const conn = await mongoose.connect(`${process.env.MONGODB_URI}/creditMangament`);
         console.log("MongoDB Connected:", conn.connection.host);
    }
        catch(error){
            console.log("Erron in MongoDB connection")
            console.log(error);
        }
}
export default connectDB;