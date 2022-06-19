import React, { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Home from './components/Home';
import MyNavbar from "./components/MyNavbar";
import About from './components/About';
import Footer from './components/Footer';
import NotFound from './components/NotFound';
import Login from './components/Login';
import SignUp from './components/Signup';
import Dashboard from './components/Dashboard';
import axios from 'axios';

function App() {

  const [currUser, setCurrUser] = useState(null);
  
  useEffect(() => {
    (async () => {
      try {
        const resp = await axios.get("/api/@me", {
          withCredentials: true,
        });
        setCurrUser(resp.data);
      } catch (error) {
        setCurrUser(null);
      }
    })();
  }, []);

  return (
    <>
      <BrowserRouter>
        <MyNavbar currUser={currUser} />
        <div style={{ minHeight: '90vh' }}>
          <Routes>
            <Route exact path='/' element={currUser!==null ? <Dashboard /> : <Home />}> </Route>
            <Route exact path='/about' element={<About />}> </Route>
            <Route exact path='/login' element={<Login />}></Route>
            <Route exact path='/signUp' element={<SignUp />}></Route>
            <Route exact path='/error' element={<NotFound />}></Route>
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
