import mongoose from 'mongoose';

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);

        console.log(`mongo connected: ${conn.connection.host}`);
    } catch (err) {
        console.log(err.message);
        process.exit();
    }
}

export default connectDb;