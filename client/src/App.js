import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"
import './App.css';

import Home from "./pages/home.jsx"
import Add from "./pages/add.jsx"
import Videos from "./pages/videos.jsx"


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/add" element={<Add/>}></Route>
          <Route path="/videos" element={<Videos/>}></Route>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
