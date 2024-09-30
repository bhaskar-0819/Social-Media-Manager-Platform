const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const multer = require("multer");
const puppeteer = require('puppeteer'); // Import Puppeteer
const path = require('path'); // Import path module
const fs = require('fs'); // Import fs module

const UserModel = require("./model/User");
const Post = require("./model/Post"); 

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
    origin: '*', // Allow all origins
    credentials: true
}));


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

// Setup multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define the createPost function
async function createPost() {
    const post = await Post.findOne().sort({ createdAt: -1 }); // Fetch the latest post
    if (!post) {
        console.log('No posts found');
        return;
    }

    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 100,
        devtools: true // Open DevTools
      });
      
    const page = await browser.newPage();

    try {
        await page.goto('http://localhost:3000/login'); // Adjust the URL to match your app

        await page.type('#login-username', post.instagramUsername);
        await page.type('#login-password', post.instagramPassword);
        await page.click('#login-button');

        await page.waitForNavigation();

        await page.click('#create-post-buttonn'); 

        await page.waitForSelector('#post-title'); 

        await page.type('#post-title', post.quote);

        if (await page.$('#post-file') !== null) {
            const imagePath = path.join(__dirname, 'post-image.jpg');
            fs.writeFileSync(imagePath, post.image);
            try {
                const [fileChooser] = await Promise.all([
                    page.waitForFileChooser(),
                    page.click('#post-file'),
                ]);
                await fileChooser.accept([imagePath]);
                console.log('File uploaded successfully');
            } catch (error) {
                console.error('Error uploading file:', error);
            }
            
        }

        if (await page.$('#post-time') !== null) {
            await page.evaluate((postTime) => {
                document.querySelector('#post-time').value = new Date(postTime).toISOString().slice(0, 16);
            }, post.postTime);
        }

        await page.click('#create-post-buttonnn');

        console.log('Post created successfully');
    } catch (error) {
        console.error('Error creating post:', error);
    } finally {
        await browser.close();
        mongoose.connection.close();
    }
}

// Define the schedulePost function
async function schedulePost() {
    const post = await Post.findOne().sort({ createdAt: -1 });
    if (!post) return;

    const delay = post.postTime - new Date();
    if (delay > 0) {
        setTimeout(createPost, delay);
    } else {
        createPost();
    }
}

// Route to trigger the schedulePost function
app.post("/schedulepost", async (req, res) => {
    try {
        await schedulePost();
        res.status(200).json({ message: "Post scheduling initiated." });
    } catch (error) {
        console.error("Error in /schedulepost route:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post("/Signup", async (req, res) => {
    try {
        const { email, password, instaId, instaPassword } = req.body;
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ email, password: hashedPassword, instaId, instaPassword });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/Login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const User = await UserModel.findOne({ email });
        if (User) {
            const passwordMatch = await bcrypt.compare(password, User.password);
            if (passwordMatch) {
                res.json({ message: 1 });
            } else {
                res.status(401).json({ error: "Password doesn't match" });
            }
        } else {
            res.status(404).json({ error: "No Records found" });
        }
    } catch (error) {
        console.error("Error in /Login route:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post("/logout", (req, res) => {
    res.json({ message: "Logout successful" });
});

app.post("/createPost", upload.single('image'), async (req, res) => {
    try {
        const { quote, postTime, instagramUsername, instagramPassword } = req.body;
        const user = await UserModel.findOne(); // Modify this to fetch the actual logged-in user
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newPost = new Post({
            quote,
            image: req.file.buffer,
            postTime: new Date(postTime),
            instagramUsername,
            instagramPassword,
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        console.error("Error in /createPost route:", error);
        res.status(500).json({ error: error.message });
    }
});