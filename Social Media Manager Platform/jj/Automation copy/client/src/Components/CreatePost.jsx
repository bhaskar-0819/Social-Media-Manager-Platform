import axios from 'axios';
import React, { useEffect, useState } from 'react';

const CreatePost = () => {
    const [quote, setQuote] = useState('');
    const [image, setImage] = useState(null);
    const [postTime, setPostTime] = useState('');
    const [instagramUsername, setInstagramUsername] = useState('');
    const [instagramPassword, setInstagramPassword] = useState('');

    useEffect(() => {
        // Fetch the user's Instagram username and password if needed
        // This can be implemented based on your authentication logic

        // Injecting styles (optional, as you have done)
        const style = document.createElement('style');
        style.innerHTML = `
            body {
                margin: 0;
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: Arial, sans-serif;
            }

            .form-container {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                width: 100vw;
            }

            .create-post-form {
                background-color: #f9f9f9;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .create-post-form div {
                margin-bottom: 10px;
            }

            .create-post-form label {
                margin-bottom: 5px;
                font-weight: bold;
            }

            .create-post-form textarea,
            .create-post-form input {
                width: 100%;
                padding: 8px;
                box-sizing: border-box;
                border: 1px solid #ccc;
                border-radius: 4px;
            }

            .create-post-form button {
                padding: 10px;
                border: none;
                border-radius: 4px;
                background-color: #007bff;
                color: white;
                cursor: pointer;
                font-size: 16px;
            }

            .create-post-form button:hover {
                background-color: #0056b3;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!image) {
            alert("Please select an image.");
            return;
        }

        const formData = new FormData();
        formData.append('quote', quote);
        formData.append('image', image);
        formData.append('postTime', postTime);
        formData.append('instagramUsername', instagramUsername);
        formData.append('instagramPassword', instagramPassword);

        try {
            // Step 1: Create the post
            const createPostResponse = await axios.post("http://localhost:3001/createPost", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Post created:', createPostResponse.data);
            alert("Post created successfully!");

            // Step 2: Trigger the scheduling
            const scheduleResponse = await axios.post("http://localhost:3001/schedulepost", {}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Scheduling response:', scheduleResponse.data);
            alert("Post scheduled successfully!");

        } catch (err) {
            console.error(err);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} className="create-post-form">
                <div>
                    <label>Quote:</label>
                    <textarea
                        value={quote}
                        onChange={(e) => setQuote(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Image:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                        required
                    />
                </div>
                <div>
                    <label>Post Time:</label>
                    <input
                        type="datetime-local"
                        value={postTime}
                        onChange={(e) => setPostTime(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Instagram Username:</label>
                    <input
                        type="text"
                        value={instagramUsername}
                        onChange={(e) => setInstagramUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Instagram Password:</label>
                    <input
                        type="password"
                        value={instagramPassword}
                        onChange={(e) => setInstagramPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create and Schedule Post</button>
            </form>
        </div>
    );
};

export default CreatePost;