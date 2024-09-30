import { useState } from 'react'

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from './Components/Home';
// import Home from './Components/Home';
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import  Navbar  from "./Components/Navbar";
import CreatePost from './Components/CreatePost';
import Logout from './Components/Logout';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
                <Navbar/>
              <Routes>
                  <Route path="/home" element={<Home/>} />
                  <Route path="/Signup" element={<Signup/>} />
                  <Route path="/Login" element={<Login/>} />
                  <Route path="/CreatePost" element={<CreatePost/>} />
                  <Route path="/logout" element={<Logout />} />
              </Routes>
          </BrowserRouter>
    </>
  )
}

export default App
