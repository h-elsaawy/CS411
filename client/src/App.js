import { BrowserRouter, Routes, Route } from "react-router-dom"
import './App.css';

import Home from "./pages/home.jsx"
import Watchlists from "./pages/watchlists.jsx"
import Videos from "./pages/videos.jsx"
import Login from "./container/Login.js"
import Search from "./components/Search";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/search" element={<Search/>}></Route>
          <Route path="/videos" element={<Videos/>}></Route>
          <Route path="/watchlist" element={<Watchlists/>}></Route>
          <Route path="/login" element={ <Login/>}></Route>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
