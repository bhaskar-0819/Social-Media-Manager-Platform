import React, { useState } from 'react'
import { Grid, Paper, TextField, Typography, Button } from '@mui/material'
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const paperStyle = {
    padding: 20,
    marginTop: 10,
    marginBottom: 10,
};

const headingStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
};

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [instaId, setInstaId] = useState("");
    const [instaPassword, setInstaPassword] = useState("");

    const navigate = useNavigate();

    const handleSignup = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3001/Signup", { email, password, instaId, instaPassword })
            .then(result => {
                if (result.status === 201) {
                    navigate("/Login");
                }
            })
            .catch(err => {
                if (err.response && err.response.status === 400) {
                    window.alert("Email already exists. Please use a different email.");
                } else {
                    console.log(err);
                }
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
                        xs: '80vw',     
                        sm: '50vw',     
                        md: '40vw',     
                        lg: '30vw',     
                        xl: '20vw',      
                    },
                    height: {
                        lg: '60vh',
                    }
                }}>
                    <Typography style={headingStyle} variant="h5">Signup</Typography>
                    <form onSubmit={handleSignup}>
                        <TextField required name='email' onChange={(e) => setEmail(e.target.value)} label='Enter email' fullWidth margin="normal" />
                        <TextField required name='password' onChange={(e) => setPassword(e.target.value)} label='Enter password' fullWidth margin="normal" type="password" />
                        <TextField required name='instaid' onChange={(e) => setInstaId(e.target.value)} label='Enter Instagram id' fullWidth margin="normal" />
                        <TextField required name='instapassword' onChange={(e) => setInstaPassword(e.target.value)} label='Enter instagram password' fullWidth margin="normal" type="password" />
                        <Button type="submit" style={btnStyle}>Signup</Button>
                    </form>
                </Paper>
            </Grid>
        </div>
    )
}

export default Signup
