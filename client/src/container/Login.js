import React from 'react';
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUserName] = useState([]);
  const [password, setPassword] = useState([]);
  
  
  const handleSubmit = async e => {
    // e.preventDefault();
    let credentials = {username, password}
    if (username === "" || password === "") {
      alert("Username and Password cannot be blank!")
    } else {

    const res = await loginUser(credentials);

    console.log(res)
    console.log(sessionStorage.getItem('token'))
    if (res !== true) {
      alert("Invalid username or password.")}
    
    // Inside the successful login block
    else {
      console.log(sessionStorage.getItem('username') + " is logged in");
      navigate("/");

      // Log the current route after the navigation
      console.log("Current route after navigation:", window.location.pathname);
    }
      
    }
  }

  async function loginUser(credentials) {
    try {
      console.log("Sending login request...");
      const response = await fetch('http://localhost:8800/login', {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
  
      const data = await response.json();
  
      if (data.success) {
        sessionStorage.setItem('username', data.username);
        console.log("Login successful!");
        return true;
      } else {
        console.error("Invalid Username or Password", data.message);
        return false;
      }
    } catch (error) {
      console.error('Error in the Fetch function', error);
      return false;
    }
  }


  return(
    <div className="login-wrapper">
      <h1>Please Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Username: <input type="text" onChange={e => setUserName(e.target.value)}/> </p>
        </label>
        <label>
          <p>Password:   <input type="password" onChange={e => setPassword(e.target.value)}/> </p>
        </label>
        <div>
          <br></br><button type="submit">Submit</button>
          
        </div>
      </form>
    </div>
  )
}
