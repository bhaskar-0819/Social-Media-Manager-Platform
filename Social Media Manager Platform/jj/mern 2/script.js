const mongoose = require('mongoose');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// MongoDB connection URI and database name
const uri = 'mongodb+srv://vikaskarbail:FftYxECZQ6RHzenD@cluster0.didzs0z.mongodb.net/UserCredential';
const dbName = 'UserCredential';

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Define Post schema and model
const PostSchema = new mongoose.Schema({
    quote: String,
    image: Buffer,
    postTime: Date,
    instagramUsername: String,
    instagramPassword: String,
    createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', PostSchema);

async function createPost() {
    // Fetch the post from the database
    const post = await Post.findOne().sort({ createdAt: -1 }); // Fetch the latest post
    if (!post) {
        console.log('No posts found');
        return;
    }

    // Launch Puppeteer and navigate to the website
    const browser = await puppeteer.launch({ headless: false }); // Set headless to true for no UI
    const page = await browser.newPage();

    try {
        // Go to login page
        await page.goto('http://localhost:3000/login'); // Adjust the URL to match your app

        // Enter login credentials and submit
        await page.type('#login-username', post.instagramUsername);
        await page.type('#login-password', post.instagramPassword);
        await page.click('#login-button');

        // Wait for navigation after login
        await page.waitForNavigation();

        // Click the "Create Post" button
        await page.click('#create-post-buttonn'); // Using the ID added to the "Create Post" button

        // Wait for the Create Post page to load
        await page.waitForSelector('#post-title'); // Adjust the selector to match an element on the Create Post page

        // Fill in the post information
        await page.type('#post-title', post.quote);

        // Upload image
        if (await page.$('#post-file') !== null) {
            const imagePath = path.join(__dirname, 'post-image.jpg');
            fs.writeFileSync(imagePath, post.image);
            const [fileChooser] = await Promise.all([
                page.waitForFileChooser(),
                page.click('#post-file'),
            ]);
            await fileChooser.accept([imagePath]);
        }

        if (await page.$('#post-time') !== null) {
            await page.evaluate((postTime) => {
                document.querySelector('#post-time').value = new Date(postTime).toISOString().slice(0, 16);
            }, post.postTime);
        }

        // Set the post time
        // await page.evaluate((postTime) => {
        //     document.querySelector('#post-time').value = new Date(postTime).toISOString().slice(0, 16);
        // }, post.postTime);

        // Submit the post
        await page.click('#create-post-buttonnn');

        console.log('Post created successfully');
    } catch (error) {
        console.error('Error creating post:', error);
    } finally {
        await browser.close();
        mongoose.connection.close();
    }
}

// Schedule the post creation for the specified time
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

schedulePost();
