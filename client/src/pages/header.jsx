// Common header for all pages. Import and include the following code where you want the header to appear
// import Header from "./header.jsx"
// <>
// {Header()}
// </>

import { Link } from "react-router-dom";


export default function Header() {
   return (
    
    <>
        <h1> Market Watch </h1> <div  ></div>
        {/* <div className="menuBar"> */}
        <menu className="menuBar">
            <button className="menu"><Link to="/">Top Trending Channels</Link></button>
            <button className="menu">{sessionStorage.getItem("username") ? (<Link to="/watchlist">Watchlist</Link>) : (<Link to="/login">Watchlist</Link>)}</button>
            <button className="menu"><Link to="/search">Search Videos</Link></button>
            <button className="menu"><Link to="/login">Sign In</Link></button>
        </menu>
        {/* </div> */}
        
   </>
    );
}