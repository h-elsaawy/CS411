import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"
import './App.css';

import Home from "./pages/home.jsx"
import Watchlists from "./pages/watchlists.jsx"
import Videos from "./pages/videos.jsx"


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/videos" element={<Videos/>}></Route>
          <Route path="/watchlists" element={<Watchlists/>}></Route>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
