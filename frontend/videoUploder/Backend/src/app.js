import express from "express";
import router from "./routes/media.route.js";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
dotenv.config({
    path: ".env"
})
const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use("/api/media", router);
app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true, limit: "16mb" }));

export { app };
