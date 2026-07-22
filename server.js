const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// 1. Connect to MongoDB using your Atlas connection string
const myMongoURI = "mongodb+srv://dineshyandrapu_db_user:Redfort6201@allowedusers.qxzxbgj.mongodb.net/valentine_db?appName=allowedusers";

mongoose.connect(myMongoURI)
    .then(() => console.log("✅ Successfully connected to YOUR MongoDB!"))
    .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// 2. The User Blueprint (Points to your 'allowed_users' collection)
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema, 'allowed_users');

// 3. The Login Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const foundUser = await User.findOne({ 
            email: username.trim().toLowerCase(), 
            password: password.trim() 
        });

        if (foundUser) {
            console.log(`💖 Welcome to Dinesh's world, ${foundUser.email}!`);
            res.json({ success: true, loggedInUser: foundUser.email });
        } else {
            console.log(`🚨 Intruder alert! Someone tried: ${username}`);
            res.json({ success: false });
        }
    } catch (error) {
        console.log("Server error during login:", error);
        res.json({ success: false });
    }
});

// 4. Start the server
app.listen(5000, () => {
    console.log("🚀 Server is running on http://localhost:5000");
});







const mongoose = require('mongoose');

// 1. Create a Schema for her secret messages & photos
const surpriseMessageSchema = new mongoose.Schema({
    surpriseNumber: String, // e.g., 'gift1', 'gift2', etc.
    comment: String,
    imageUrl: String,
    createdAt: { type: Date, default: Date.now }
});

const SurpriseMessage = mongoose.model('SurpriseMessage', surpriseMessageSchema);

// 2. Create the API endpoint to save them to MongoDB
app.post('/save-surprise-note', async (req, res) => {
    try {
        const { surpriseNumber, comment, imageUrl } = req.body;
        
        const newMessage = new SurpriseMessage({
            surpriseNumber,
            comment,
            imageUrl
        });

        await newMessage.save();
        res.json({ success: true, message: "Saved to database successfully! ❤️" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error saving note." });
    }
});