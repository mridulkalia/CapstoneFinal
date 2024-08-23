const express = require("express");
const cors = require("cors");
const database = require("./database/mongoDB");
const dotenv = require("dotenv").config();
const router = require("./routes/userRoute");
const cookieParser = require("cookie-parser");
const resourceRouter = require("./routes/resourceRoute"); 
const ngorouter=require("./routes/ngoHospitalRoutes") 
const app = new express();

database();

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

app.use("/", router);
app.use("/", resourceRouter); 
app.use("/",ngorouter);  // Add the resource route

app.get("/test", (req, res) => {
  res.json("test ok");
});

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`Listening on port ${process.env.PORT}...`);
});
