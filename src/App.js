import { useEffect, useState } from "react";
import './App.css';
import HomeScreen from './homeScreen/homeScreen.js'
import StatsScreen from './statsScreen/statsScreen.js';
import Navbar from './Navbar.js';

function App() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const stats = 1; 
  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);
  
  if (page === 0) {
    return (
      <div className="App">
        <Navbar page={page} setPage={setPage} />
        <HomeScreen />
      </div>
    );
  }
  if(page === 1) {
    return(
    <div className="App">
      <Navbar page={page} setPage={setPage} />
      <StatsScreen /> 
    </div>)
  }
}
export default App;
