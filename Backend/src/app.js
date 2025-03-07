// Import necessary modules for the Express.js application
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import corn from "node-cron";

// Create an instance of the Express.js application
const app = express();

// Configure middleware for Cross-Origin Resource Sharing (CORS)
app.use(cors({
    origin: process.env.CORS_ORIGIN, // Specify the allowed origin(s)
    credentials: true // Allow credentials to be sent along with the request
}));

// Configure middleware for parsing incoming JSON payloads with a limit of 16 KB
// app.use(express.json());
app.use(express.json({ limit: "16mb" }));

// Configure middleware for parsing incoming URL-encoded payloads with a limit of 16 KB
app.use(express.urlencoded({ extended: true, limit: "16mb" }));

// Configure middleware for serving static files from the "public" directory
app.use(express.static("public"));

// Configure middleware for parsing incoming request cookies
app.use(cookieParser());

// Import and use the user routes defined in the "user.routs.js" file
import userrouter from "./routs/user.routs.js";
import categoryrouter from "./routs/CoursesRoutes/category.routs.js"
import coursesrouter from "./routs/CoursesRoutes/courses.routs.js"
import paymentrouter from "./routs/payment.routs.js"
import profilerouter from "./routs/profile.routs.js"
import ratingandreviewrouter from "./routs/ratingAndReview.routs.js"
import sectionrouter from "./routs/CoursesRoutes/section.routs.js"
import subsectionrouter from "./routs/CoursesRoutes/subSection.routs.js"

app.use("/api/v1/users", userrouter); // Mount the user routes at the "/api/v1/users" endpoint
app.use("/api/v1/category", categoryrouter);
app.use("/api/v1/course", coursesrouter);
app.use("/api/v1/payment", paymentrouter);
app.use("/api/v1/profile", profilerouter);
app.use("/api/v1/ratingandreview", ratingandreviewrouter);
app.use("/api/v1/section", sectionrouter);
app.use("/api/v1/subsection", subsectionrouter);

app.get("/home", (req, res) => {
    res.send("Welcome to home page backend is running");
})

// *    *    *    *    *    * 
// |    |    |    |    |    | 
// |    |    |    |    |    +---- Day of the Week (0 - 7) (Sunday = 0 or 7)
// |    |    |    |    +--------- Month (1 - 12)
// |    |    |    +-------------- Day of the Month (1 - 31)
// |    |    +------------------- Hour (0 - 23)
// |    +------------------------ Minute (0 - 59)
// +----------------------------- Second (0 - 59)

// corn.schedule("*/10 * * * * *", () => {
//     console.log("Running a task every day at 5pm");
// })


export { app };