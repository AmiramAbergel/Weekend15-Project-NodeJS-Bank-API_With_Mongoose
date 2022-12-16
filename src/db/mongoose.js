import dotenv from 'dotenv';
dotenv.config(); // Load ENV Variables
import mongoose from 'mongoose';
mongoose.set('strictQuery', true);
const DB = process.env.DATABASE_LOCAL;
const config = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

//async function so we can connect to the database
//throws an error if the connection fails
export const connectToDB = async () => {
    try {
        await mongoose.connect(DB, config); // Database Connection
        console.log(`connected to the database`);
    } catch (err) {
        console.log(`error connecting to the db: ${err}`);
    }
};
