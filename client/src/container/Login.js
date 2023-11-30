import React from 'react';
import { useState } from "react"
import { Navigate } from "react-router-dom";
import Header from "../pages/header.jsx"
// import './Login.css';

export default function Login() {
  const [username, setUserName] = useState([]);
  const [password, setPassword] = useState([]);
  
  const handleSubmit = async e => {
    // e.preventDefault();
    let credentials = {username, password}
    if (username === "" || password === "") {
      alert("Username and Password cannot be blank!")

    } else {
      const res = await loginUser(credentials);

      if (res !== true) {
        alert("Invalid username or password.")
      
      
      } else {
        alert(sessionStorage.getItem('username') + " is logged in");
        return <Navigate replace to="http://localhost:3000/" />
      }
    }
  };

  async function loginUser(credentials) {
    try {
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
        // Save the token (e.g., in sessionStorage) for subsequent requests
        sessionStorage.setItem('username', data.username);
        
        console.log("token written successfully", sessionStorage.getItem('username'))
        
        return true;
      } else {
        // Handle login failure
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
        <>
          {Header()}
        </>
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
