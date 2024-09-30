import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Logout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear the token from local storage
        localStorage.removeItem("token");


        navigate("/login");
    };

    return (
        <div>
            <Button variant="contained" onClick={handleLogout}>Logout</Button>
        </div>
    );
}

export default Logout;
