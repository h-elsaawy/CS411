import React from "react"
import { useNavigate } from "react-router-dom";
import Header from "./header.jsx"

const Dashboard = () => {
    const navigate = useNavigate();

    const handleSignOut = () => {

        sessionStorage.removeItem('username'); 
        alert("You have been succesfully signed out. You will automatically be directed to home page.");
        return navigate("/login");
    }

    return (
        <div>
            <> {Header()} </>
            User Account
            <button type="submit" onClick={handleSignOut}>Sign Out</button>  

        </div>
    )
}

export default Dashboard