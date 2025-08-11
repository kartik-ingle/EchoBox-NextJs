import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if(connection.isConnected) {
        console.log("Already connected to the database");
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {})

        connection.isConnected = db.connections[0].readyState

        console.log("DB Connected successfully");
    } catch (error) {
        console.log("database connection failed", error)
        process.exit()
    }
}

export default dbConnect