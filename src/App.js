import { useEffect, useState } from "react";
import logo from './logo.svg';
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
  
  if (page == 0) {
    return (
      <div className="App">
        <Navbar page={page} setPage={setPage} />  
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        <h1>Users</h1>
        {users.map((user) => (
          <p key={user.id}>{user.name}</p>
        ))}
        </header>
        <HomeScreen />
      </div>
    );
  }
  if(page == 1) {
    return(
    <div className="App">
      <Navbar page={page} setPage={setPage} />
      <StatsScreen />; 
    </div>)
  }
}
export default App;
