const express = require("express");
const cors = require("cors");
const database = require("./database/mongoDB");
const dotenv = require("dotenv").config();
const router = require("./routes/userRoute");
const cookieParser = require("cookie-parser");
const resourceRouter = require("./routes/resourceRoute");
const ngorouter = require("./routes/ngoHospitalRoutes");
const disasterRouter = require("./routes/disasterRoute");
const campaignRouter = require("./routes/campaignRoutes");
const crisisRouter = require("./routes/crisisroutes");
const app = new express();

database();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], // List of allowed origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow these methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
    credentials: true, // If using cookies/auth
  })
);

// Handle preflight requests explicitly (Optional but recommended for clarity)
app.options('*', cors());
app.use("/uploads", express.static("uploads"));

app.use("/", router);
app.use("/", resourceRouter);
app.use("/", ngorouter);
app.use("/", disasterRouter);
app.use("/", campaignRouter);
app.use("/", crisisRouter);

app.get("/test", (req, res) => {
  res.json("test ok");
});
// hello

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`Listening on port ${process.env.PORT}...`);
});
