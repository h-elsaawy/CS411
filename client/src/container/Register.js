import { React, useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import Header from "../pages/header.jsx"

const Register = () => {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [region, setRegion] = useState("");
    const [role, setRole] = useState("");

    const navigate = useNavigate();

    async function createUser(userInfo) {
        try {
          const response = await axios.post("http://localhost:8800/register", userInfo, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          console.log(response)
          // Send boolean of login status to handle next steps.
          if (response.data.success) {
            // Save the token (e.g., in sessionStorage) for subsequent requests
            // sessionStorage.setItem('username', response.data.username);
            console.log("Transaction went through.")
            return true;
    
          } else {
            // Handle login failure
            console.error("Transaction failed.");
            return false;
          }
        } catch (error) {
          console.error('Error in the Fetch function', error);
          return false;
        }
      }
  
    const handleSubmit = async e => {
        // e.preventDefault();

        if (username === "") {
            alert("Username cannot be blank!")
        // } else if (password === "" || password.length < 5) {
        } else if (password === "") {
            alert("Password must be greater than 6 charachters!")
        } else if (firstName === "" ) {
            alert("First Name cannot be blank!")
        } else if (lastName === "" ) {
            alert("Last Name cannot be blank!")
        }else if (email === ""  ) {
            // || !email.includes("@")
            alert("Please enter a valid Email!")
        } else {
            if (role === "") {setRole(0)} 

            let userInfo = {username: username.trim(), 
                            password: password, 
                            name: firstName.concat(" ", lastName), 
                            email: email,
                            region: region,
                            role: role}
            alert(userInfo)
            const res = await createUser(userInfo);
  
//         if (res !== true) {
//           alert("Invalid username or password.")
        
//         } else {
//           alert(`Welcome to Creator Capital Index @${sessionStorage.getItem('username')}. 
// You will automatically be directed to the Sign In page.`);
//           return navigate("/");
//         }
      }
    };
  
    return(
  
      <div className="login-wrapper">
          <>
            {Header()}
          </>
        <h2>Create New Account</h2>
        <form >
            <label> <p>Username: <input className="input" type="text" autoFocus onChange={e => setUserName(e.target.value)}/> </p></label>  
            <label> <p>Password:   <input type="password" onChange={e => setPassword(e.target.value)}/>  </p></label> 
            <label> <p>First Name:   <input type="firstName" onChange={e => setFirstName(e.target.value)}/>  </p></label>  
            <label> <p>Last Name:   <input type="lastName" onChange={e => setLastName(e.target.value)}/> </p></label>  
            
            <label> <p>Email:   <input type="email" onChange={e => setEmail(e.target.value)}/>  </p></label>  
            <label> <p><input type="checkbox" /> Sign me up for daily newsletter! </p></label>              
            <legend> Role: 
                <input type="radio" name="role" value="0" onChange={e => setRole(e.target.value)}/> <label>Creator</label>
                <input type="radio" name="role" value="1" onChange={e => setRole(e.target.value)}/> <label>Sponsor</label>    
            </legend>    
            
            <label> <p> Region: 
                <select id="region" name="region" size="1" onChange={e => setRegion(e.target.value)}>
                    <option value="">Select a Region</option>
                    <option value="US">United States</option>
                    <option value="BR">Brazil</option>
                    <option value="CA">Canada</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="GB">United Kingdom</option>
                    <option value="IN">India</option>
                    <option value="JP">Japan</option>
                    <option value="KR">Korea</option>
                    <option value="MX">Mexico</option>
                    <option value="RU">Russia</option>
                </select>
            </p></label>  

          <div>
            <br></br>
            <button type="submit" onClick={handleSubmit}>Submit</button>  
            
          </div>
        </form>
      </div>
    )
}

export default Register
