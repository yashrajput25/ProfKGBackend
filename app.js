const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const studentRoutes = require("./routes/studentRoutes");


const app = express();
app.use(cors({
    origin: ["https://profkgfrontend.onrender.com","https://profcognitrixkg.netlify.app" ,"http://localhost:3000"], // allow your frontend
    methods: ["GET", "POST", "PUT", "DELETE"],      // allowed methods
    credentials: true                               // if using cookies/auth
  }));
app.use(express.json());
console.log("Mongo URI:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("✅ MongoDB connected");
    }).catch(err => {
        console.error("❌ MongoDB connection error:", err);
    });

const knowledgeGraphRoutes = require('./routes/knowledgeGraph');
app.use('/api/knowledgeGraph', knowledgeGraphRoutes);
app.use('/api/students', studentRoutes );
app.get("/", (req, res) => {
    res.send("🚀 Knowledge Graph Backend is running and connected!");
  });
const PORT = process.env.PORT || 5001;
app.listen(PORT, ()=> console.log(`🚀 Knowledge Graph Service running on port ${PORT}`));
