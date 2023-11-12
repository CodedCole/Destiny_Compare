import { useEffect, useState } from "react";
import logo from './logo.svg';
import './App.css';
import StatsScreen from './StatsScreen.js';

function App() {
  const [users, setUsers] = useState([]);
  const stats = 1; 
  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);
  if (stats == 0) {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        <h1>Users</h1>
        {users.map((user) => (
          <p key={user.id}>{user.name}</p>
        ))}
        </header>
      </div>
    );
  }
  else {
    return <StatsScreen />; 
  }
}
export default App;
