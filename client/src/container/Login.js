import { React, useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import Navbar from "./Navbar.jsx"
import './Login.css';

export default function Login() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();

  const handleRegistration = () => {
    // Use Navigate to redirect to the registration page
    return navigate('/register');
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (username === "" || password === "") {
      alert("Username and Password cannot be blank!")

    } else {
      let credentials = {username: username.trim(), password: password}
      const res = await loginUser(credentials);

      if (res !== true) {
        alert("Invalid username or password.")
      
      } else {
        alert("Welcome @" + sessionStorage.getItem('username') + ". You will automatically be directed to home page.");
        return navigate("/");
      }
    }
  };

  async function loginUser(credentials) {
    try {
      const response = await axios.post("http://localhost:8800/login", credentials, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Send boolean of login status to handle next steps.
      if (response.data.success) {
        // Save the token (e.g., in sessionStorage) for subsequent requests
        sessionStorage.setItem('username', response.data.username);
        sessionStorage.setItem('watchlist', JSON.stringify(response.data.channels));
        console.log("User logged in, token written successfully." )
        return true;

      } else {
        // Handle login failure
        console.error("Invalid Username or Password", response.data.success);
        return false;
      }
    } catch (error) {
      console.error('Error in the Fetch function', error);
      return false;
    }
  }


  return(

    <div className="login-wrapper">
        <>
          {Navbar()}
        </>
      <h2>Please Log In</h2>
      <form >
        <label>
          <p>Username: <input type="text" autoFocus onChange={e => setUserName(e.target.value)}/> </p>
        </label>
        <label>
          <p>Password:   <input type="password" onChange={e => setPassword(e.target.value)}/> </p>
        </label>
        <div>
          <br></br>
          <button type="submit" onClick={handleSubmit}>Submit</button>  
          <button type="register" onClick={handleRegistration}>Register</button>
          
        </div>
      </form>

    </div>
  )
}
