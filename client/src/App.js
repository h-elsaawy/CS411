import { BrowserRouter, Routes, Route } from "react-router-dom"
import './App.css';

import Home from "./pages/home.jsx"
import Watchlists from "./pages/watchlists.jsx"
import Search from "./pages/search.jsx"
import Login from "./container/Login.js"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/search" element={<Search/>}></Route>
          <Route path="/watchlist" element={<Watchlists/>}></Route>
          <Route path="/login" element={ <Login/>}></Route>
          

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
