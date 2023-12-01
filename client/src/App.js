import { BrowserRouter, Routes, Route } from "react-router-dom"
import './App.css';

import Home from "./pages/home.jsx"
import Watchlists from "./pages/watchlists.jsx"
import Videos from "./pages/videos.jsx"
import Login from "./container/Login.js"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/videos" element={<Videos/>}></Route>
          <Route path="/watchlist" element={<Watchlists/>}></Route>
          <Route path="/login" element={ <Login/>}></Route>
          sdfghfgh

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
