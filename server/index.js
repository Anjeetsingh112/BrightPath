const dotenv=require("dotenv");
const express=require("express");
const cookieParser=require("cookie-parser");
const cors=require("cors");
const connectDB = require("./database/db");
const userRoute = require("./routes/user.route");
const courseRoute = require("./routes/course.route");
const mediaRoute = require("./routes/media.route");
const coursePurchaseRoute = require("./routes/coursePurchase.route");
const courseProgrssRoute = require("./routes/courseProgress.route");
const path = requrie("path");
 dotenv.config({});
// call data base here
connectDB();
const app=express();

const _dirname=path.resolve();
//default middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT","PATCH", "DELETE"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// apis
app.use("/api/v1/media",mediaRoute)
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/course-purchase",coursePurchaseRoute);
app.use("/api/v1/progress",courseProgrssRoute);
// Home route
app.get("/home", (req, res) => {
   res.send("hello i am home");
  });

app.use(express.static(path.join(_dirname,"/client/dist")));
app.get('*',(req,res)=>{
  res.sendFile(path.resolve(_dirname,"client","dist","index.html"));
})

const port=process.env.PORT||3000;
app.listen((port),()=>{
    console.log(`server is running on port ${port}`);
})