import './App.css';
import Navbar from './components/Navbar';
import { Routes, Route, Link, Navigate, Outlet } from 'react-router-dom'
import Signup from './pages/signup';
import Home from './pages/Home';
import Tips from './pages/Tips';
import Profile from './pages/profile';
import { useContext, useState } from 'react';
import { LoadingContext } from "./context/loading.context"
import Login from './pages/login';
import Footer from './components/footer';
import WeatherApp from './components/WeatherWidget';
import TipDetail from './pages/TipDetail';



function App() {
 
  const [isBackgroundDimmed, setIsBackgroundDimmed] = useState(false);

  function handleDimBackground() {
    setIsBackgroundDimmed(true);
    
  }

function handleDimNav (){
setIsBackgroundDimmed(true)

}
  const { authUser, getTips, setComment} = useContext(LoadingContext)

  const getToken = () => {
    return localStorage.getItem("authToken")
  }

  const LoggedIn = () => {
    return getToken() ? <Outlet /> : <Navigate to="/" />;
  };

  const NotLoggedIn = () => {
    return !getToken() ? <Outlet /> : <Navigate to="/" />;
  };
 
 
 
  return (
    <div className={`app ${isBackgroundDimmed ? "dimmed" : ""}`}>
      <WeatherApp />
      <Navbar className="nav" handleDimNav={handleDimNav}/>
      
    
      <Routes>
        
        <Route path='/' element={<div style={{ display: 'flex', justifyContent: 'center', marginTop: "100px"}}>
            <Home className="tips" dimBackground={handleDimBackground} isBackgroundDimmed={isBackgroundDimmed} setIsBackgroundDimmed={setIsBackgroundDimmed}/>
          </div>
        } />
        <Route path='/all-tips' element={
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: "100px"}}>
            <Tips className="tips"/>
          </div>
        } />

          <Route path='/signup' element={
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: "100px"}}>
            <Signup className="tips"/>
          </div>
        } />

          <Route path={`/users/profile/:id`} element={
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: "100px"}}>
              <Profile className="tips" isBackgroundDimmed={isBackgroundDimmed}
          setIsBackgroundDimmed={setIsBackgroundDimmed}/>
            </div>
          } />
                 <Route path={`/tips/tip-detail/:id`} element={
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: "100px"}}>
              <TipDetail className="tips"/>
            </div>
          } />
              <Route path={`/login`} element={
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: "100px"}}>
              <Login className="tips"/>
            </div>
          } />

      </Routes>
    
      <Footer />
    </div>
  );
}

export default App;

