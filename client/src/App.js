import { BrowserRouter, Routes, Route } from "react-router-dom"
import './App.css';

import Home from "./pages/home.jsx"
import Watchlists from "./pages/watchlists.jsx"
import Watchlist from "./pages/watchlist.jsx"
import Search from "./pages/search.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import Login from "./container/Login.js"
import Register from "./container/Register.js"


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/search" element={<Search/>}></Route>
          <Route path="/watchlist" element={<Watchlists/>}></Route>
          <Route path="/watchlist/:id" element={<Watchlist/>}></Route>
          <Route path="/login" element={ <Login/>}></Route>
          <Route path="/register" element={ <Register/>}></Route>
          <Route path="/dashboard" element={ <Dashboard/>}></Route>
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
