import React from 'react';
import logo from './images/DestinyCompareLogo.png';

function Navbar({ page, setPage }) {
  return (
    <div className="navbar">
        <div className="logo" onClick={() => setPage(0)}>
            <img src={logo} alt="Logo" />
        </div>
        <ul>
        <div className="navbar-button">
            <li>
                <button onClick={() => setPage(1)}>COMPARE</button>
            </li>
            <li>
                <button onClick={() => setPage(0)}>HOME SCREEN</button>
            </li>
        </div>
        </ul>
    </div>
  );
}

export default Navbar;