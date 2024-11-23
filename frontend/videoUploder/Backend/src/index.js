import { app } from "./app.js"
import connectDb from "./db/connectdb.js"
import dotenv from "dotenv"

dotenv.config({
    path: "../.env"
})
connectDb().then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    })
    app.on("Error in connecting", (err) => {
        console.error(err);
    })
}).catch((err) => {
    console.log('Error in connecting db', err);
})