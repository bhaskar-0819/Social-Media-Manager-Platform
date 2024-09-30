import React, { useState } from 'react';
import { Grid, Paper, TextField, Typography, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Define paperStyle if needed or remove if not used
const paperStyle = {
    padding: 20,
    marginTop: 10,
    marginBottom: 10,
};

// Define the heading style
const headingStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
};

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    
    const handleLogin = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3001/Login", { email, password })
            .then(result => {
                console.log(result.data);
                if (result.data.message === 1) { // Access the message property
                    navigate("/CreatePost");
                } else {
                    console.log(result.data);
                    alert("Login failed");
                }
            })
            .catch(err => {
                console.log(err);
                alert("An error occurred. Please try again.");
            });
    };
    

    const btnStyle = {
        marginTop: "3rem", 
        fontSize: "1.2rem", 
        fontWeight: "700", 
        backgroundColor: "blue", 
        borderRadius: "0.5rem",
        color: "white",
        padding: "10px 20px"
    };

    return (
        <div>
            <h1>Hello</h1>
            <Grid align="center" className="wrapper">
                <Paper style={paperStyle} sx={{
                    width: {
                        xs: '80vw',     // 0
                        sm: '50vw',     // 600
                        md: '40vw',     // 900
                        lg: '30vw',     // 1200
                        xl: '20vw',     // 1536 
                    },
                    height: {
                        lg: '60vh',
                    }
                }}>
                    <Typography style={headingStyle} variant="h5">Login</Typography>
                    <form onSubmit={handleLogin}>
                        <TextField name='email' label='Enter email' fullWidth margin="normal" onChange={(e) => setEmail(e.target.value)} />
                        <TextField name='password' label='Enter password' fullWidth margin="normal" type="password" onChange={(e) => setPassword(e.target.value)} />
                        <Button type="submit" style={btnStyle}>Login</Button>
                    </form>
                </Paper>
            </Grid>
        </div>
    )
}

export default Login;
