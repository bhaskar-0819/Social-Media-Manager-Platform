import React from "react"
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import  Logout  from "./Logout";
function Navbar() {
    return (
        <div>
            <AppBar>
                <Toolbar>
                    <Typography variant="h4" sx={{flexGrow:1}}>Automation</Typography>
                    <Button variant="contained" to='/Login' component={Link}>Login</Button>
                    <Button variant="contained" to='/Signup' component={Link}>Signup</Button>
                    <Logout/>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default Navbar
