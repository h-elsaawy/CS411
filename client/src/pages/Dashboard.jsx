import { React, useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios'

import Header from "./header.jsx"

const Dashboard = () => {
    const navigate = useNavigate();
    const [newPassword1, setNewPassword1] = useState("");
    const [newPassword2, setNewPassword2] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [changingPassword, setChangingPassword] = useState(false);


    const handleSignOut = () => {

        sessionStorage.removeItem('username'); 
        alert("You have been succesfully signed out. You will automatically be directed to home page.");
        return navigate("/login");
    }

    async function changePassword() {
        if (newPassword1 === newPassword2) {
            // Check the user's credentials to authenticate.
            const credentials = {username:sessionStorage.getItem('username'),
                                password: oldPassword }
            console.log("submit clicked: " + JSON.stringify(credentials))
            try {
                const response = await axios.post("http://localhost:8800/login", credentials, {
                    headers: {
                    "Content-Type": "application/json",
                    },
                });
            
                // If user logged in successfully. Send request to update password.
                if (response.data.success) {
                    console.log("User old password is correct." )
                    const newCredentials = {username:sessionStorage.getItem('username'),
                                            password: newPassword1 }
                    // Change the user's password
                    const response2 = await axios.post("http://localhost:8800/changePass", newCredentials, {
                        headers: {
                        "Content-Type": "application/json",
                        },
                    });
                    if (response2.data.success) {
                        console.log(response2.data.message)
                        alert(response2.data.message)
                        setChangingPassword(false)
                    } else {
                        console.log('User change failed.')
                    }

                } else {
                    // Handle login failure
                    console.error("Invalid Password,", response.data.success);
                    alert('Old password is incorrect.')
                    return false;
                }
            } catch (error) {
                console.error('Error in the Fetch function', error);
                return false;
            }
        } else {
            alert("Passwords do not match.")
        }
    }

    const handleChangePass = () => {
        setChangingPassword(true)

    }

    return (
        <div>
            <> {Header()} </>
            <div id="dashboard">
                {changingPassword ? (
                    <div>
                        Change User Password
                        <label>
                            <p>Input Old Password: <input type="password" onChange={e => setOldPassword(e.target.value)} /> </p>
                            <p>Input New Password: <input type="password" onChange={e => setNewPassword1(e.target.value)} /> </p>
                            <p>Re-enter Password: <input type="password" onChange={e => setNewPassword2(e.target.value)} /> </p>
                        </label>
                        <p> <button type="submit" onClick={changePassword}>Change Password</button> </p>
                    </div>
                ) : (
                    <div>
                        User Account
                        <p> <button type="submit" onClick={handleChangePass}>Change Password</button> </p>
                        <p> <button type="submit" onClick={handleSignOut}>Sign Out</button> </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard